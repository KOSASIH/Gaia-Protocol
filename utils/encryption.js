const crypto = require('crypto');
const { Kyber } = require('kyber-crystals');  // Install via npm: npm install kyber-crystals

class EncryptionUtils {
  static encryptData(data, key) {
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  static decryptData(encrypted, key) {
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  }

  static quantumKeyExchange(publicKey) {
    // Simplified Kyber key exchange
    const kyber = new Kyber();
    const { ciphertext, sharedSecret } = kyber.encapsulate(publicKey);
    return { ciphertext, sharedSecret };
  }
}

module.exports = EncryptionUtils;
