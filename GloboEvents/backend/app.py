import os
from flask import Flask, request, jsonify, send_from_directory
import requests
from dotenv import load_dotenv
from flask_cors import CORS
from datetime import datetime

load_dotenv()

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)  # Enable CORS for all routes

TICKETMASTER_API_KEY = os.getenv('TICKETMASTER_API_KEY')  # Set your Ticketmaster API key as an environment variable

if not TICKETMASTER_API_KEY:
    raise ValueError('TICKETMASTER_API_KEY environment variable is not set')

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/events', methods=['GET'])
def get_events():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'City name is required'}), 400

    size = request.args.get('size', 20)  # Default to 20 events if size is not specified

    url = f'https://app.ticketmaster.com/discovery/v2/events.json?city={city}&size={size}&apikey={TICKETMASTER_API_KEY}'
    print(f"Fetching events for city: {city} with size: {size}")
    response = requests.get(url)

    if response.status_code != 200:
        print(f"Failed to retrieve events: {response.status_code}, Response: {response.text}")
        return jsonify({'error': 'Failed to retrieve events'}), response.status_code

    events = response.json().get('_embedded', {}).get('events', [])
    print(f"Retrieved {len(events)} events")

    # Log the response to a file
    log_folder = 'log'
    if not os.path.exists(log_folder):
        os.makedirs(log_folder)
    current_datetime = datetime.now().strftime('%Y%m%d_%H%M%S')
    log_filename = f'{log_folder}/Log_SearchEventResponse_{current_datetime}.txt'
    with open(log_filename, 'w') as log_file:
        log_file.write(response.text)

    return jsonify(events)

@app.route('/events/<event_id>/images', methods=['GET'])
def get_event_images(event_id):
    locale = request.args.get('locale', '*')
    domain = request.args.get('domain')

    url = f'https://app.ticketmaster.com/discovery/v2/events/{event_id}/images.json?apikey={TICKETMASTER_API_KEY}&locale={locale}'
    if domain:
        url += f'&domain={domain}'

    response = requests.get(url)

    if response.status_code != 200:
        print(f"Failed to retrieve event images: {response.status_code}, Response: {response.text}")
        return jsonify({'error': 'Failed to retrieve event images'}), response.status_code

    images = response.json().get('images', [])
    return jsonify(images)

if __name__ == '__main__':
    app.run(debug=True)