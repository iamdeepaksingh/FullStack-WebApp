import os
import sys
import pytest
import requests
from flask import Flask

# Add the backend directory to the sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_index(client):
    """Test the index route."""
    rv = client.get('/')
    assert rv.status_code == 200
    assert b'GloboEvents' in rv.data

def test_get_events(client, monkeypatch):
    """Test the get_events route."""
    def mock_get(*args, **kwargs):
        class MockResponse:
            def __init__(self, json_data, status_code):
                self.json_data = json_data
                self.status_code = status_code
                self.text = str(json_data)  # Add the text attribute

            def json(self):
                return self.json_data

        return MockResponse({
            '_embedded': {
                'events': [
                    {'name': 'Event 1', 'dates': {'start': {'localDate': '2023-01-01'}}, 'id': '1'},
                    {'name': 'Event 2', 'dates': {'start': {'localDate': '2023-01-02'}}, 'id': '2'}
                ]
            }
        }, 200)

    monkeypatch.setattr(requests, 'get', mock_get)
    rv = client.get('/events?city=Seattle')
    assert rv.status_code == 200
    json_data = rv.get_json()
    assert len(json_data) == 2
    assert json_data[0]['name'] == 'Event 1'
    assert json_data[1]['name'] == 'Event 2'

def test_get_event_images(client, monkeypatch):
    """Test the get_event_images route."""
    def mock_get(*args, **kwargs):
        class MockResponse:
            def __init__(self, json_data, status_code):
                self.json_data = json_data
                self.status_code = status_code
                self.text = str(json_data)  # Add the text attribute

            def json(self):
                return self.json_data

        return MockResponse({
            'images': [
                {'url': 'https://example.com/image1.jpg'},
                {'url': 'https://example.com/image2.jpg'}
            ]
        }, 200)

    monkeypatch.setattr(requests, 'get', mock_get)
    rv = client.get('/events/1/images')
    assert rv.status_code == 200
    json_data = rv.get_json()
    assert len(json_data) == 2
    assert json_data[0]['url'] == 'https://example.com/image1.jpg'
    assert json_data[1]['url'] == 'https://example.com/image2.jpg'