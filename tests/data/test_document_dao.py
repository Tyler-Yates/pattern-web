import mongomock
import pytest

from application.data.document_dao import TEXT_FIELD, DocumentDao


@pytest.fixture
def document_dao() -> DocumentDao:
    database = mongomock.MongoClient().db
    return DocumentDao(database)


def test_insert_document(document_dao):
    text = "text123"
    result = document_dao.insert_document(text)
    inserted_document = document_dao.get_document(result.inserted_id)

    assert text == inserted_document[TEXT_FIELD]
