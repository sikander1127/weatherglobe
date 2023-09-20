const apiKey = 'e5e608af37f0ce565691cfbe2d330ba3';
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');
const searchHistory = document.getElementById('search-history');

// Function to fetch current weather data
function fetchCurrentWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            // Process the data and display it in the "current-weather" section
            const cityName = data.name;
            const temperatureCelsius = data.main.temp;
            const temperatureFahrenheit = (temperatureCelsius * 9/5) + 32; // Convert to Fahrenheit
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;

            // Update the "current-weather" section with the data
            currentWeather.innerHTML = `
                <h2>${cityName}</h2>
                <p>Temperature: ${temperatureFahrenheit}°F (${temperatureCelsius}°C)</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
            `;

            // Call the fetchForecast function with latitude and longitude
            fetchForecast(data.coord.lat, data.coord.lon);
        })
        .catch((error) => {
            console.error('Error fetching current weather:', error);
        });
}

// Function to fetch 5-day forecast data using latitude and longitude
function fetchForecast(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            // Process the data and display it in the "forecast" section
            forecast.innerHTML = ''; // Clear previous forecast data

            const forecastData = data.list; // Get the complete forecast data

            // Create an object to group forecast data by date
            const groupedData = {};

            // Loop through the forecast data and group it by date
            forecastData.forEach((item) => {
                const date = new Date(item.dt * 1000);
                const dateString = date.toDateString();

                if (!groupedData[dateString]) {
                    groupedData[dateString] = [];
                }

                groupedData[dateString].push(item);
            });

            // Loop through the grouped data and create elements for each day's forecast
            for (const dateString in groupedData) {
                const dateData = groupedData[dateString];
                const date = new Date(dateData[0].dt * 1000).toDateString();
                const temperatureCelsius = dateData[0].main.temp;
                const temperatureFahrenheit = (temperatureCelsius * 9/5) + 32; // Convert to Fahrenheit
                const humidity = dateData[0].main.humidity;
                const windSpeed = dateData[0].wind.speed;
                const weatherIcon = dateData[0].weather[0].icon;

                // Create a container for each day's forecast
                const dayForecast = document.createElement('div');
                dayForecast.classList.add('forecast-item'); 

                // Update the dayForecast element with forecast information
                dayForecast.innerHTML = `
                    <h3>${date}</h3>
                    <img src="https://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
                    <p>Temperature: ${temperatureFahrenheit}°F (${temperatureCelsius}°C)</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Wind Speed: ${windSpeed} m/s</p>
                `;

                // Append the dayForecast to the "forecast" section
                forecast.appendChild(dayForecast);
            }
        })
        .catch((error) => {
            console.error('Error fetching forecast:', error);
        });
}

// Function to update the search history
function updateSearchHistory(city) {
    // Create a list item and append it to the "search-history" section
    const listItem = document.createElement('li');
    listItem.textContent = city;
    searchHistory.appendChild(listItem);

    // Add an event listener to the list item to allow clicking on a city in the history
    listItem.addEventListener('click', () => {
        fetchCurrentWeather(city);
    });
}

// Event listener for the form submission
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();

    if (city) {
        fetchCurrentWeather(city);
        updateSearchHistory(city);
        cityInput.value = ''; // Clear the input field
    }
});

// Initial setup: Populate search history UI from local storage (if available)
if (typeof(Storage) !== "undefined") '{'
    const searchHistoryList = JSON.parse(localStorage.getItem('searchHistory')) || [];
    updateSearchHistoryUI(searchHistoryList); '}'