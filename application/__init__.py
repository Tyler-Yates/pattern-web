import logging
import os

from flask import Flask, request, redirect

from application.data.custom_json_encoder import CustomJsonEncoder
from application.data.document_dao import DocumentDao
from application.data.kafka_dao import KafkaDao
from application.routes.api_routes import API_BLUEPRINT
from application.routes.html_routes import HTML_BLUEPRINT

# Key to use when accessing flask app config
DATABASE_CONFIG_KEY = "DB"
KAFKA_CONFIG_KEY = "KF"

logging.basicConfig(level=logging.INFO)


def _setup_app(app: Flask):
    @app.before_request
    def before_request():
        # Redirect to HTTPS automatically
        if request.url.startswith("http://"):
            url = request.url.replace("http://", "https://", 1)
            code = 301
            return redirect(url, code=code)


def create_flask_app() -> Flask:
    # Create the flask app
    app = Flask(__name__)

    # Set custom JSON encoder to handle MongoDB ObjectID
    app.json_encoder = CustomJsonEncoder

    # Create the database DAO and add it to the flask app config for access by the blueprints
    app.config[DATABASE_CONFIG_KEY] = DocumentDao()

    # Create the Kafka DAO and add it to the flask app config for access by the blueprints
    app.config[KAFKA_CONFIG_KEY] = KafkaDao(
        os.environ["CLOUDKARAFKA_BROKERS"],
        os.environ["CLOUDKARAFKA_USERNAME"],
        os.environ["CLOUDKARAFKA_PASSWORD"],
        os.environ["ENCRYPTION_KEY"]
    )

    # Set up the app
    _setup_app(app)

    # Register blueprints to add routes to the app
    app.register_blueprint(API_BLUEPRINT)
    app.register_blueprint(HTML_BLUEPRINT)

    return app
