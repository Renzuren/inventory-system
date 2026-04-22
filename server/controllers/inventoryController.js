const { db } = require('../config/firebase');
const Inventory = require('../models/Inventory');

const getInventory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { workspaceId, category, search, limit = 20, startAfter } = req.query;
    if (!workspaceId) return res.status(400).json({ error: 'workspaceId required' });

    let query = db.collection('inventory')
      .where('userId', '==', userId)
      .where('workspaceId', '==', workspaceId);

    if (category && category !== 'all') {
      query = query.where('category', '==', category);
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      query = query.orderBy('nameLower')
        .startAt(searchTerm)
        .endAt(searchTerm + '\uf8ff');
    } else {
      query = query.orderBy('createdAt', 'desc');
    }

    if (startAfter) {
      const startAfterDoc = await db.collection('inventory').doc(startAfter).get();
      query = query.startAfter(startAfterDoc);
    }

    const snapshot = await query.limit(parseInt(limit)).get();
    const items = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      };
    });
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];

    res.json({
      items,
      pagination: {
        hasMore: snapshot.docs.length === parseInt(limit),
        nextCursor: lastVisible ? lastVisible.id : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

const addItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { workspaceId, name, quantity, price, category } = req.body;
    if (!workspaceId) return res.status(400).json({ error: 'workspaceId required' });
    if (!name) return res.status(400).json({ error: 'Item name required' });

    const nameLower = name.toLowerCase();
    const existingSnapshot = await db.collection('inventory')
      .where('userId', '==', userId)
      .where('workspaceId', '==', workspaceId)
      .where('nameLower', '==', nameLower)
      .limit(1)
      .get();

    if (!existingSnapshot.empty) {
      return res.status(400).json({ error: 'An item with this name already exists in this workspace' });
    }

    const docRef = await db.collection('inventory').add({
      name,
      nameLower,
      quantity: parseInt(quantity),
      price: price ? parseFloat(price) : null,
      category: category || 'Uncategorized',
      userId,
      workspaceId,
      createdAt: new Date(),
    });
    await Inventory.addHistory(docRef.id, workspaceId, userId, parseInt(quantity), 0);
    res.status(201).json({
      id: docRef.id,
      name,
      quantity: parseInt(quantity),
      price: price ? parseFloat(price) : null,
      category: category || 'Uncategorized',
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { workspaceId, name, quantity, price, category } = req.body;
    
    if (!workspaceId) return res.status(400).json({ error: 'workspaceId required' });

    const itemRef = db.collection('inventory').doc(id);
    const itemDoc = await itemRef.get();
    if (!itemDoc.exists) return res.status(404).json({ error: 'Item not found' });
    
    const itemData = itemDoc.data();
    if (itemData.userId !== userId || itemData.workspaceId !== workspaceId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updateData = {};
    
    if (name !== undefined) {
      const newNameLower = name.toLowerCase();
      if (newNameLower !== itemData.nameLower) {
        const existingSnapshot = await db.collection('inventory')
          .where('userId', '==', userId)
          .where('workspaceId', '==', workspaceId)
          .where('nameLower', '==', newNameLower)
          .limit(1)
          .get();
        if (!existingSnapshot.empty) {
          return res.status(400).json({ error: 'An item with this name already exists' });
        }
        updateData.name = name;
        updateData.nameLower = newNameLower;
      }
    }
    
    if (quantity !== undefined) {
      const oldQuantity = itemData.quantity;
      const newQuantity = parseInt(quantity);
      updateData.quantity = newQuantity;
      await Inventory.addHistory(id, workspaceId, userId, newQuantity, oldQuantity);
    }
    
    if (price !== undefined) {
      updateData.price = price ? parseFloat(price) : null;
    }
    
    if (category !== undefined) {
      updateData.category = category;
    }

    if (Object.keys(updateData).length > 0) {
      await itemRef.update(updateData);
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { workspaceId } = req.query;
    if (!workspaceId) return res.status(400).json({ error: 'workspaceId required' });

    const itemRef = db.collection('inventory').doc(id);
    const itemDoc = await itemRef.get();
    if (!itemDoc.exists) return res.status(404).json({ error: 'Item not found' });
    if (itemDoc.data().userId !== userId || itemDoc.data().workspaceId !== workspaceId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    await itemRef.delete();

    const historySnapshot = await db.collection('inventory_history').where('itemId', '==', id).get();
    const batch = db.batch();
    historySnapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { workspaceId } = req.query;
    if (!workspaceId) return res.status(400).json({ error: 'workspaceId required' });

    const totalValue = await Inventory.getTotalValue(workspaceId, userId);
    const lowStockSnapshot = await db.collection('inventory')
      .where('userId', '==', userId)
      .where('workspaceId', '==', workspaceId)
      .where('quantity', '<=', 5)
      .get();
    const lowStockCount = lowStockSnapshot.size;
    const totalSnapshot = await db.collection('inventory')
      .where('userId', '==', userId)
      .where('workspaceId', '==', workspaceId)
      .get();
    const totalItems = totalSnapshot.size;
    const history = await Inventory.getHistory(workspaceId, userId, 30);

    const trendData = {};
    history.forEach(entry => {
      const date = entry.timestamp.toISOString().split('T')[0];
      if (!trendData[date]) trendData[date] = 0;
      trendData[date] += Math.abs(entry.change);
    });

    res.json({
      totalValue,
      lowStockCount,
      totalItems,
      trend: Object.entries(trendData).map(([date, changes]) => ({ date, changes })),
    });
  } catch (error) {
    next(error);
  }
};

const exportCSV = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { workspaceId } = req.query;
    if (!workspaceId) return res.status(400).json({ error: 'workspaceId required' });

    const snapshot = await db.collection('inventory')
      .where('userId', '==', userId)
      .where('workspaceId', '==', workspaceId)
      .get();
    const items = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
      };
    });

    let csv = 'Name,Category,Quantity,Price,Total Value,Created At\n';
    items.forEach(item => {
      const total = item.price ? item.price * item.quantity : '';
      csv += `"${item.name}","${item.category || ''}",${item.quantity},${item.price || ''},${total},"${item.createdAt}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=inventory.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

const bulkAddItems = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { workspaceId, items } = req.body;
    
    if (!workspaceId) return res.status(400).json({ error: 'workspaceId required' });
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array required' });
    }

    const results = [];
    const errors = [];
    const batch = db.batch();

    for (const item of items) {
      try {
        const { name, quantity, price, category } = item;
        if (!name) {
          errors.push({ item, error: 'Name required' });
          continue;
        }

        const nameLower = name.toLowerCase();
        const existingSnapshot = await db.collection('inventory')
          .where('userId', '==', userId)
          .where('workspaceId', '==', workspaceId)
          .where('nameLower', '==', nameLower)
          .limit(1)
          .get();

        if (!existingSnapshot.empty) {
          errors.push({ name, error: 'Item already exists in this workspace' });
          continue;
        }

        const docRef = db.collection('inventory').doc();
        batch.set(docRef, {
          name,
          nameLower,
          quantity: parseInt(quantity) || 0,
          price: price ? parseFloat(price) : null,
          category: category || 'Uncategorized',
          userId,
          workspaceId,
          createdAt: new Date(),
        });

        results.push({ id: docRef.id, name });
      } catch (err) {
        errors.push({ item, error: err.message });
      }
    }

    await batch.commit();

    res.status(201).json({
      added: results.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully added ${results.length} items.${errors.length ? ` ${errors.length} failed.` : ''}`,
    });
  } catch (error) {
    next(error);
  }
};
const getRecentHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { workspaceId, limit = 5 } = req.query;
    if (!workspaceId) return res.status(400).json({ error: 'workspaceId required' });

    const snapshot = await db.collection('inventory_history')
      .where('userId', '==', userId)
      .where('workspaceId', '==', workspaceId)
      .orderBy('timestamp', 'desc')
      .limit(parseInt(limit))
      .get();

    const history = await Promise.all(snapshot.docs.map(async (doc) => {
      const data = doc.data();
      // Fetch item name
      const itemDoc = await db.collection('inventory').doc(data.itemId).get();
      const itemName = itemDoc.exists ? itemDoc.data().name : 'Unknown item';
      return {
        id: doc.id,
        itemName,
        quantity: data.quantity,
        previousQuantity: data.previousQuantity,
        change: data.change,
        timestamp: data.timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    }));

    res.json(history);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInventory,
  addItem,
  updateItem,
  deleteItem,
  getStats,
  exportCSV,
  bulkAddItems,
  getRecentHistory,
};