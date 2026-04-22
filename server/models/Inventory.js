const { db } = require('../config/firebase');

class Inventory {
  static async addHistory(itemId, workspaceId, userId, quantity, previousQuantity) {
    await db.collection('inventory_history').add({
      itemId,
      workspaceId,
      userId,
      quantity,
      previousQuantity,
      change: quantity - previousQuantity,
      timestamp: new Date(),
    });
  }

  static async getHistory(workspaceId, userId, days = 30) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const snapshot = await db.collection('inventory_history')
      .where('workspaceId', '==', workspaceId)
      .where('userId', '==', userId)
      .where('timestamp', '>=', cutoff)
      .orderBy('timestamp', 'asc')
      .get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate?.() || new Date(),
      };
    });
  }

  static async getTotalValue(workspaceId, userId) {
    const snapshot = await db.collection('inventory')
      .where('workspaceId', '==', workspaceId)
      .where('userId', '==', userId)
      .get();
    let total = 0;
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.price && data.quantity) {
        total += data.price * data.quantity;
      }
    });
    return total;
  }
}

module.exports = Inventory;