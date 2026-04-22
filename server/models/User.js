const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class User {
  static async create({ firstName, lastName, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    const userRef = await db.collection('users').add({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      verified: false,
      verificationToken,
      createdAt: new Date(),
    });

    return { id: userRef.id, firstName, lastName, email, verificationToken };
  }

  static async findByEmail(email) {
    const snapshot = await db.collection('users').where('email', '==', email).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  static async findByVerificationToken(token) {
    const snapshot = await db.collection('users').where('verificationToken', '==', token).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  static async verifyUser(userId) {
    await db.collection('users').doc(userId).update({
      verified: true,
      verificationToken: null,
    });
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;