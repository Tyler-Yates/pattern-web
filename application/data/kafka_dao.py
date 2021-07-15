from typing import List

from confluent_kafka import Producer
from cryptography.fernet import Fernet


# DAO for interacting with Kafka cluster.
class KafkaDao:
    def __init__(self, brokers: str, username: str, password: str, encryption_key: str):
        self.brokers = brokers
        self.username = username
        self.password = password
        self.encryption_key = encryption_key

        self.encrypter = Fernet(encryption_key.encode())

        conf = {
            'bootstrap.servers': self.brokers,
            'session.timeout.ms': 6000,
            'default.topic.config': {'auto.offset.reset': 'smallest'},
            'security.protocol': 'SASL_SSL',
            'sasl.mechanisms': 'SCRAM-SHA-256',
            'sasl.username': self.username,
            'sasl.password': self.password
        }

        self.producer = Producer(**conf)
        print(f"Kafka topics: {self.producer.list_topics().topics}")

        self.topic = "yx3jf0q2-default"

    def produce_message(self, key: str, message: str):
        # We need to encrypt the message since our Kafka host does not provide encryption by default.
        encrypted_message = self.encrypter.encrypt(message.encode())

        self.producer.produce(topic=self.topic, key=key, value=encrypted_message)
