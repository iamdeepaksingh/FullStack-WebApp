document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:5000/events'; // Backend API endpoint

    document.getElementById('searchButton').addEventListener('click', async () => {
        const cityInput = document.getElementById('cityInput');
        const sizeInput = document.getElementById('sizeInput');
        const nameFilterInput = document.getElementById('nameFilter');
        const dateFilterInput = document.getElementById('dateFilter');
        const eventsList = document.getElementById('eventsList');

        if (!cityInput || !sizeInput || !nameFilterInput || !dateFilterInput || !eventsList) {
            console.error('One or more input elements are missing in the DOM.');
            return;
        }

        const cityName = cityInput.value;
        const size = sizeInput.value || 10; // Default to 10 if size is not specified
        const nameFilter = nameFilterInput.value.toLowerCase();
        const dateFilter = dateFilterInput.value;
        eventsList.innerHTML = ''; // Clear previous results

        if (!cityName) {
            alert('Please enter a city name');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}?city=${cityName}&size=${size}`);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data = await response.json();
            console.log('Events data:', data); // Add this line to debug

            let filteredEvents = data;

            if (nameFilter) {
                filteredEvents = filteredEvents.filter(event => event.name.toLowerCase().includes(nameFilter));
            }
            if (dateFilter) {
                filteredEvents = filteredEvents.filter(event => event.dates.start.localDate === dateFilter);
            }

            if (filteredEvents.length === 0) {
                eventsList.innerHTML = '<p>No events found for the specified filters.</p>';
            } else {
                displayEvents(filteredEvents);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            eventsList.innerHTML = `<p>Error retrieving events. Please try again. ${error.message}</p>`;
        }
    });

    function displayEvents(events) {
        const eventsList = document.getElementById('eventsList');

        events.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            eventItem.innerHTML = `
                <h2>${event.name}</h2>
                <p>${event.dates.start.localDate}</p>
                <p id="location-${event.id}">Loading address...</p>
                ${event.info ? `<p>${event.info}</p>` : ''}
                <p><a href="${event.url}" target="_blank">Event Link</a></p>
                <button onclick="fetchEventImages('${event.id}')">View Image</button>
                <div id="images-${event.id}" class="event-images" style="display: none;"></div>
                <button onclick="viewMap('${event.id}', ${event._embedded.venues[0].location.latitude}, ${event._embedded.venues[0].location.longitude})">View Map</button>
                <div id="map-${event.id}" style="height: 300px; display: none;"></div> <!-- Add a map container for each event -->
            `;
            eventsList.appendChild(eventItem);

            // Fetch and display the address based on latitude and longitude
            const latitude = event._embedded.venues[0].location.latitude;
            const longitude = event._embedded.venues[0].location.longitude;
            fetchAddress(event.id, latitude, longitude);
        });
    }

    async function fetchAddress(eventId, latitude, longitude) {
        const provider = new window.GeoSearch.OpenStreetMapProvider();
        try {
            const results = await provider.search({ query: `${latitude},${longitude}` });
            const locationElement = document.getElementById(`location-${eventId}`);
            if (results && results.length > 0) {
                locationElement.textContent = results[0].label;
            } else {
                locationElement.textContent = 'Address not found';
            }
        } catch (error) {
            console.error('Error fetching address:', error);
            const locationElement = document.getElementById(`location-${eventId}`);
            locationElement.textContent = 'Address not found';
        }
    }

    window.fetchEventImages = async function(eventId) {
        const imagesContainer = document.getElementById(`images-${eventId}`);
        if (imagesContainer.style.display === 'none') {
            try {
                const response = await fetch(`${apiUrl}/${eventId}/images`);
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                const data = await response.json();
                imagesContainer.innerHTML = '';

                if (data.length > 0) {
                    const img = document.createElement('img');
                    img.src = data[0].url;
                    img.alt = 'Event Image';
                    imagesContainer.appendChild(img);
                } else {
                    imagesContainer.innerHTML = '<p>No images available.</p>';
                }
                imagesContainer.style.display = 'block';
            } catch (error) {
                console.error('Error fetching event images:', error);
                imagesContainer.innerHTML = `<p>Error retrieving images. Please try again. ${error.message}</p>`;
                imagesContainer.style.display = 'block';
            }
        } else {
            imagesContainer.style.display = 'none';
        }
    }

    window.viewMap = function(eventId, latitude, longitude) {
        const mapContainer = document.getElementById(`map-${eventId}`);
        if (mapContainer.style.display === 'none') {
            mapContainer.style.display = 'block';
            const map = L.map(`map-${eventId}`).setView([latitude, longitude], 13); // Center the map on the event location
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Add a marker to the map
            const marker = L.marker([latitude, longitude]).addTo(map);
            marker.bindPopup(`<b>${event.name}</b><br>${event.dates.start.localDate}`).openPopup();
        } else {
            mapContainer.style.display = 'none';
        }
    }
});