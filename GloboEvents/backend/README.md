# GloboEvents Backend Documentation

## Overview
GloboEvents is a full-stack web application that allows users to search for events in a specified city using the Ticketmaster API. This README provides instructions for setting up and running the backend of the application.

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone https://github.com/yourusername/GloboEvents.git
   cd GloboEvents/backend
   ```

2. **Create a virtual environment:**
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**
   ```
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Ensure you have your Ticketmaster API key set as an environment variable:
   ```
   export TICKETMASTER_API_KEY='your_api_key'  # On Windows use `set TICKETMASTER_API_KEY=your_api_key`
   ```

## Running the Application
To start the Flask server, run:
```
python app.py
```
The server will start on `http://127.0.0.1:5000`.

## API Endpoints

- **GET /events**
  - **Description:** Retrieves a list of events for a specified city.
  - **Query Parameters:**
    - `city`: The name of the city to search for events.
  - **Response:** A JSON object containing a list of events.

## Testing
  - **Events:** http://127.0.0.1:5000/events?city=Seattle  
  - **All Events:** https://app.ticketmaster.com/discovery/v2/events.json?apikey=key
  

## Usage
Once the server is running, you can make requests to the `/events` endpoint to retrieve event data for a specific city. Use the frontend application to interact with this backend service.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.