document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:5000/events'; // Backend API endpoint

    document.getElementById('searchButton').addEventListener('click', async () => {
        const cityName = document.getElementById('cityInput').value;
        const size = document.getElementById('sizeInput').value || 10; // Default to 10 if size is not specified
        const eventsList = document.getElementById('eventsList');
        eventsList.innerHTML = ''; // Clear previous results

        if (!cityName) {
            alert('Please enter a city name');
            return;
        }

        try {
            //const response = await fetch(`${apiUrl}?city=${cityName}`);
            const response = await fetch(`${apiUrl}?city=${cityName}&size=${size}`);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data = await response.json();
            console.log('Events data:', data); // Add this line to debug
            if (data.length === 0) {
                eventsList.innerHTML = '<p>No events found for the specified city.</p>';
            } else {
                displayEvents(data);
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
                <p>${event.classifications && event.classifications[0] && event.classifications[0].genre ? event.classifications[0].genre.name : 'No genre available'}</p>
                <p>${event.classifications && event.classifications[0] && event.classifications[0].subGenre ? event.classifications[0].subGenre.name : 'No sub-genre available'}</p>
                ${event.info ? `<p>${event.info}</p>` : ''}
                <p><a href="${event.url}" target="_blank">Event Link</a></p>
                <button onclick="fetchEventImages('${event.id}')">View Images</button>
                <div id="images-${event.id}" class="event-images"></div>
            `;
            eventsList.appendChild(eventItem);
        });
    }

    window.fetchEventImages = async function(eventId) {
        try {
            const response = await fetch(`${apiUrl}/${eventId}/images`);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data = await response.json();
            const imagesContainer = document.getElementById(`images-${eventId}`);
            imagesContainer.innerHTML = '';

            if (data.length > 0) {
                const img = document.createElement('img');
                img.src = data[0].url;
                img.alt = 'Event Image';
                imagesContainer.appendChild(img);
            } else {
                imagesContainer.innerHTML = '<p>No images available.</p>';
            }
        } catch (error) {
            console.error('Error fetching event images:', error);
            const imagesContainer = document.getElementById(`images-${eventId}`);
            imagesContainer.innerHTML = `<p>Error retrieving images. Please try again. ${error.message}</p>`;
        }
    }
});