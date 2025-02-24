document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const weatherDisplay = document.getElementById('weather-display');
    const errorMessage = document.getElementById('error-message');
    const loading = document.getElementById('loading');
    const savedLocationsList = document.getElementById('saved-locations-list');
    
    // API Key (I would replace this with my own API key in a real application)
    const apiKey = 'YOUR_API_KEY'; // Replace with my OpenWeatherMap API key
    
    // Save search history in localStorage
    let savedLocations = JSON.parse(localStorage.getItem('savedLocations')) || [];
    
    // Display saved locations
    function displaySavedLocations() {
        savedLocationsList.innerHTML = '';
        savedLocations.forEach(location => {
            const locationElement = document.createElement('div');
            locationElement.classList.add('saved-location-item');
            locationElement.textContent = location;
            locationElement.addEventListener('click', () => {
                searchInput.value = location;
                getWeatherData(location);
            });
            savedLocationsList.appendChild(locationElement);
        });
    }
    
    // Save a location
    function saveLocation(location) {
        if (!savedLocations.includes(location)) {
            savedLocations.push(location);
            if (savedLocations.length > 5) {
                savedLocations.shift(); // Keep only the 5 most recent locations
            }
            localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
            displaySavedLocations();
        }
    }
    
    // Function to get weather data
    async function getWeatherData(city) {
        showLoading();
        hideError();
        
        try {
            // For demo purposes, I'll simulate API calls with mock data
            
            // const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
            // const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock data for demonstration purposes
            const weatherData = getMockWeatherData(city);
            
            displayWeatherData(weatherData);
            saveLocation(city);
        } catch (error) {
            showError('Failed to fetch weather data. Please try again.');
            console.error('Error fetching weather data:', error);
        } finally {
            hideLoading();
        }
    }
    
    // Function to display weather data
    function displayWeatherData(data) {
        weatherDisplay.innerHTML = '';
        
        // Current weather
        const currentWeatherEl = document.createElement('div');
        currentWeatherEl.classList.add('current-weather');
        
        const date = new Date();
        const locationInfoEl = document.createElement('div');
        locationInfoEl.classList.add('location-info');
        locationInfoEl.innerHTML = `
            <h2>${data.city}, ${data.country}</h2>
            <p>${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        `;
        
        const weatherIconEl = document.createElement('img');
        weatherIconEl.classList.add('weather-icon');
        weatherIconEl.src = data.current.iconUrl;
        weatherIconEl.alt = data.current.description;
        
        const temperatureEl = document.createElement('div');
        temperatureEl.classList.add('temperature');
        temperatureEl.textContent = `${Math.round(data.current.temp)}°C`;
        
        const descriptionEl = document.createElement('div');
        descriptionEl.classList.add('description');
        descriptionEl.textContent = data.current.description;
        
        const detailsEl = document.createElement('div');
        detailsEl.classList.add('details');
        detailsEl.innerHTML = `
            <div class="detail-item">
                <strong>Feels Like</strong>
                <p>${Math.round(data.current.feelsLike)}°C</p>
            </div>
            <div class="detail-item">
                <strong>Humidity</strong>
                <p>${data.current.humidity}%</p>
            </div>
            <div class="detail-item">
                <strong>Wind</strong>
                <p>${data.current.windSpeed} m/s</p>
            </div>
            <div class="detail-item">
                <strong>Pressure</strong>
                <p>${data.current.pressure} hPa</p>
            </div>
        `;
        
        const saveButton = document.createElement('button');
        saveButton.classList.add('save-button');
        saveButton.textContent = 'Save Location';
        saveButton.addEventListener('click', () => saveLocation(data.city));
        
        currentWeatherEl.appendChild(locationInfoEl);
        currentWeatherEl.appendChild(weatherIconEl);
        currentWeatherEl.appendChild(temperatureEl);
        currentWeatherEl.appendChild(descriptionEl);
        currentWeatherEl.appendChild(detailsEl);
        currentWeatherEl.appendChild(saveButton);
        
        weatherDisplay.appendChild(currentWeatherEl);
        
        // Forecast
        const forecastEl = document.createElement('div');
        forecastEl.classList.add('forecast');
        
        data.forecast.forEach(day => {
            const forecastDayEl = document.createElement('div');
            forecastDayEl.classList.add('forecast-day');
            
            const dayDate = new Date(day.date);
            
            forecastDayEl.innerHTML = `
                <h3>${dayDate.toLocaleDateString('en-US', { weekday: 'short' })}</h3>
                <img class="forecast-icon" src="${day.iconUrl}" alt="${day.description}">
                <p class="forecast-temp">${Math.round(day.maxTemp)}° / ${Math.round(day.minTemp)}°</p>
                <p class="forecast-desc">${day.description}</p>
            `;
            
            forecastEl.appendChild(forecastDayEl);
        });
        
        weatherDisplay.appendChild(forecastEl);
    }
    
    // Helper functions
    function showLoading() {
        loading.style.display = 'block';
    }
    
    function hideLoading() {
        loading.style.display = 'none';
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    
    function hideError() {
        errorMessage.style.display = 'none';
    }
    
    // Mock weather data for demo purposes
    function getMockWeatherData(city) {
        const iconCodes = ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d'];
        const descriptions = ['Clear sky', 'Few clouds', 'Scattered clouds', 'Broken clouds', 'Shower rain', 'Rain', 'Thunderstorm', 'Snow'];
        
        // Generate a consistent "random" number based on city name
        const hashCode = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const baseTemp = 15 + (hashCode % 20); // Temperature between 15-35°C
        
        const currentWeather = {
            temp: baseTemp,
            feelsLike: baseTemp - 2,
            description: descriptions[hashCode % descriptions.length],
            iconUrl: `https://openweathermap.org/img/wn/${iconCodes[hashCode % iconCodes.length]}@2x.png`,
            humidity: 40 + (hashCode % 40),
            windSpeed: 2 + (hashCode % 8),
            pressure: 1000 + (hashCode % 30)
        };
        
        const forecast = [];
        for (let i = 1; i <= 5; i++) {
            const dayOffset = (hashCode + i) % descriptions.length;
            const dayTemp = baseTemp + (i % 5) - 2;
            
            forecast.push({
                date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
                maxTemp: dayTemp + 2,
                minTemp: dayTemp - 2,
                description: descriptions[dayOffset],
                iconUrl: `https://openweathermap.org/img/wn/${iconCodes[dayOffset]}@2x.png`
            });
        }
        
        return {
            city,
            country: 'Demo', // In a real app, this would come from the API
            current: currentWeather,
            forecast
        };
    }
    
    // Event listeners
    searchButton.addEventListener('click', () => {
        const city = searchInput.value.trim();
        if (city) {
            getWeatherData(city);
        } else {
            showError('Please enter a city name');
        }
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
    
    // Initialize
    displaySavedLocations();
    
    // Load default city if available
    if (savedLocations.length > 0) {
        getWeatherData(savedLocations[savedLocations.length - 1]);
    } else {
        getWeatherData('London');
    }
});