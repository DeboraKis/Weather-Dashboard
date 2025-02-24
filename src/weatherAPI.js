/**
 * Weather Dashboard API Functions
 * 
 * This file contains functions that handle API calls to the weather service.
 * Replace the mock data in app.js with these functions when you're ready to
 * connect to a real weather API.
 */

// You'll need to replace this with your actual API key
const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Fetch weather data from OpenWeatherMap API
 * @param {string} city - City name to fetch weather for
 * @returns {Promise} - Weather data object
 */
async function fetchWeatherData(city) {
    try {
        // Fetch current weather
        const currentWeatherResponse = await fetch(
            `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        
        if (!currentWeatherResponse.ok) {
            throw new Error(`Error: ${currentWeatherResponse.status}`);
        }
        
        const currentData = await currentWeatherResponse.json();
        
        // Fetch forecast data
        const forecastResponse = await fetch(
            `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        
        if (!forecastResponse.ok) {
            throw new Error(`Error: ${forecastResponse.status}`);
        }
        
        const forecastData = await forecastResponse.json();
        
        // Process and format the data
        return formatWeatherData(currentData, forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

/**
 * Format the raw API data into a consistent structure
 * @param {Object} currentData - Current weather data from API
 * @param {Object} forecastData - Forecast data from API
 * @returns {Object} - Formatted weather data
 */
function formatWeatherData(currentData, forecastData) {
    // Format current weather
    const current = {
        temp: currentData.main.temp,
        feelsLike: currentData.main.feels_like,
        description: currentData.weather[0].description,
        iconUrl: `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`,
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        pressure: currentData.main.pressure
    };
    
    // Process and format forecast data
    // The API returns data every 3 hours, so we need to extract daily data
    const forecast = [];
    const dailyForecasts = {};
    
    // Group forecast by day
    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = {
                temps: [],
                icons: [],
                descriptions: []
            };
        }
        
        dailyForecasts[date].temps.push(item.main.temp);
        dailyForecasts[date].icons.push(item.weather[0].icon);
        dailyForecasts[date].descriptions.push(item.weather[0].description);
    });
    
    // Extract one entry per day (up to 5 days)
    Object.keys(dailyForecasts).slice(0, 5).forEach(date => {
        const dayData = dailyForecasts[date];
        
        // Get the most common icon and description for the day
        const mostCommonIcon = getMostFrequent(dayData.icons);
        const mostCommonDescription = getMostFrequent(dayData.descriptions);
        
        forecast.push({
            date: date,
            maxTemp: Math.max(...dayData.temps),
            minTemp: Math.min(...dayData.temps),
            description: mostCommonDescription,
            // iconUrl: `https://openweathermap.org/img/wn/${mostCommonIcon}@2x.png`
        });
    });
    
    return {
        city: currentData.name,
        country: currentData.sys.country,
        current,
        forecast
    };
}

/**
 * Get the most frequent item in an array
 * @param {Array} arr - Array of items
 * @returns {*} - Most frequent item
 */
function getMostFrequent(arr) {
    const counts = arr.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {});
    
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
}

// export { fetchWeatherData };