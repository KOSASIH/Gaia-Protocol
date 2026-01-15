import os
from cryptography.hazmat.primitives.asymmetric import kyber
from cryptography.hazmat.primitives import serialization
from utils.encryption import EncryptionUtils

class KeyManager:
    def __init__(self, key_dir='security/keys/'):
        self.key_dir = key_dir
        os.makedirs(key_dir, exist_ok=True)

    def generate_quantum_keys(self):
        """Generate Kyber keys for quantum resistance."""
        private_key = kyber.Kyber512PrivateKey.generate()
        public_key = private_key.public_key()
        # Save keys
        with open(os.path.join(self.key_dir, 'kyber_private.pem'), 'wb') as f:
            f.write(private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            ))
        with open(os.path.join(self.key_dir, 'kyber_public.pem'), 'wb') as f:
            f.write(public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            ))
        print("Quantum keys generated.")

    def encrypt_sensitive_data(self, data, key_file='kyber_public.pem'):
        """Encrypt data with quantum key."""
        with open(os.path.join(self.key_dir, key_file), 'rb') as f:
            public_key = serialization.load_pem_public_key(f.read())
        encrypted = EncryptionUtils.quantumKeyExchange(public_key)  # Simplified
        return encrypted

    def rotate_keys(self):
        """Rotate keys periodically."""
        self.generate_quantum_keys()
        print("Keys rotated for security.")

# Example
manager = KeyManager()
manager.generate_quantum_keys()
encrypted = manager.encrypt_sensitive_data("planetary_secret")
print("Data encrypted:", encrypted)
