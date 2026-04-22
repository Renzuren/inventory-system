const { db } = require('../config/firebase');

class Workspace {
  static async create(userId, name) {
    // Check for duplicate name (case-insensitive)
    const existing = await this.findByName(userId, name);
    if (existing) {
      throw new Error('A workspace with this name already exists');
    }

    const docRef = await db.collection('workspaces').add({
      userId,
      name,
      nameLower: name.toLowerCase(),
      createdAt: new Date(),
    });
    return {
      id: docRef.id,
      name,
      createdAt: new Date().toISOString(),
    };
  }

  static async findByName(userId, name) {
    const nameLower = name.toLowerCase();
    const snapshot = await db.collection('workspaces')
      .where('userId', '==', userId)
      .where('nameLower', '==', nameLower)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  }

  static async findAllByUser(userId) {
    const snapshot = await db.collection('workspaces')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    });
  }

  static async findById(workspaceId, userId) {
    const doc = await db.collection('workspaces').doc(workspaceId).get();
    if (!doc.exists) return null;
    const data = doc.data();
    if (data.userId !== userId) return null;
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    };
  }

  static async delete(workspaceId, userId) {
    const workspace = await this.findById(workspaceId, userId);
    if (!workspace) throw new Error('Workspace not found or unauthorized');

    await db.collection('workspaces').doc(workspaceId).delete();

    const inventorySnapshot = await db.collection('inventory')
      .where('workspaceId', '==', workspaceId)
      .get();
    const batch = db.batch();
    inventorySnapshot.docs.forEach(doc => batch.delete(doc.ref));

    const historySnapshot = await db.collection('inventory_history')
      .where('workspaceId', '==', workspaceId)
      .get();
    historySnapshot.docs.forEach(doc => batch.delete(doc.ref));

    await batch.commit();
  }
}

module.exports = Workspace;