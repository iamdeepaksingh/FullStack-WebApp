# GloboEvents
GloboEvents is a full-stack web application that allows users to search for events in a specified city using the Ticketmaster API. 

## Project Structure
The project consists of two main components: the backend and the frontend.

### Backend
- **app.py**: The main entry point for the backend application, setting up a Flask server to handle requests and interact with the Ticketmaster API.
- **requirements.txt**: Lists the Python dependencies required for the backend, including Flask and requests.
- **README.md**: Documentation for the backend, including setup instructions and API endpoints.

### Frontend
- **index.html**: The main HTML file providing the structure for the user interface.
- **app.js**: JavaScript code for handling user interactions and making requests to the backend.
- **styles.css**: CSS styles defining the visual appearance of the frontend.
- **README.md**: Documentation for the frontend, including setup instructions.

## Getting Started
To set up the project, follow these steps:

1. Clone the repository.
2. Navigate to the `backend` directory and install the required Python packages:
   ```
   pip install -r requirements.txt
   ```
3. Run the backend server:
   ```
   python app.py
   ```
4. Open `frontend/index.html` in a web browser to access the application.

## Usage
Enter a city name in the input field and submit to retrieve a list of events happening in that city.

## License
This project is licensed under the MIT License.