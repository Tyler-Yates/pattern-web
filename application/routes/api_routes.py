from flask import Blueprint, current_app, jsonify, redirect, request
from flask_accept import accept

from application.data.document_dao import DocumentDao

API_BLUEPRINT = Blueprint("routes_api", __name__, url_prefix="/api/v1/")


@API_BLUEPRINT.route("/documents")
def documents_api_page():
    documents = _get_dao().get_documents()
    return jsonify(list(documents))


@API_BLUEPRINT.route("/documents/<document_id>")
def document_api_page(document_id):
    document = _get_dao().get_document(document_id)
    if document:
        return jsonify(document)
    else:
        return _as_json("Document with ID {document_id} not found!"), 404


@API_BLUEPRINT.route("/documents", methods=["POST"])
@accept("application/x-www-form-urlencoded", "multipart/form-data", "text/html")
def add_document_api_form():
    form_data = None
    if request.form:
        form_data = request.form.get("document_text", None)

    if form_data:
        inserted_document = _get_dao().insert_document(form_data)
        return redirect(f"/documents/{inserted_document.inserted_id}", code=302)
    else:
        return "Document must have text!", 400


def _as_json(message: str) -> str:
    return jsonify({"message": message})


def _get_dao() -> DocumentDao:
    return current_app.config["DB"]
