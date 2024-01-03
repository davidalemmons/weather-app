function convertTemperature(temperature, unit) {
    return unit === 'F' ? (temperature * 9/5) + 32 : (temperature -32) * 5/9;
}
 
// Function to fetch and display weather data
function getWeather(location, unit) {
    const apiKey = '99665606db5b4da1b88144836233112';
    const url = 'http://api.weatherapi.com/v1/forecast.json?key=99665606db5b4da1b88144836233112&q='+location+'&days=7&aqi=no&alerts=no'

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Full data received from API:', data); // Log the full response
            displayWeather(data, unit);
            displayForecast(data, unit);
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error);
        });
}
 
// Function to display weather data
function displayWeather(data, unit) {
    let temperature = data.current.temp_c; // Assuming data is fetched in Celsius
    if (unit === 'F') {
        temperature = convertTemperature(temperature, unit);
    }
    const unitLabel = unit === 'C' ? '°C' : '°F';
 
    document.getElementById('location').textContent =data.location.name + ', ' + data.location.region;
    document.getElementById('time').textContent =data.location.localtime;
    document.getElementById('temperature').textContent = 'Temperature: ' + temperature.toFixed(2) + unitLabel;
    document.getElementById('weather-icon').src =data.current.condition.icon;
    document.getElementById('weather-condition').textContent ='Condition: ' + data.current.condition.text;
    document.getElementById('humidity').textContent = 'Humidity: ' +data.current.humidity + '%';
    document.getElementById('wind').textContent = 'Wind: ' +data.current.wind_mph + ' mph';
}
 
function displayForecast(data, unit) {
    const unitLabel = unit === 'C' ? '°C' : '°F';

    for (let i = 0; i < 7; i++) {
        let dayForecast = data.forecast.forecastday[i];

        if (!dayForecast) {
            console.error('Forecast data for day ' + (i + 1) + ' is missing');
            continue;
        }

        document.getElementById('day' + (i + 1)).textContent = dayForecast.date;
        document.getElementById('temp' + (i + 1) + 'low').textContent = 'Low: ' + (unit === 'C' ? dayForecast.day.mintemp_c.toFixed(2) : dayForecast.day.mintemp_f.toFixed(2)) + unitLabel;
        document.getElementById('temp' + (i + 1) + 'high').textContent = 'High: ' + (unit === 'C' ? dayForecast.day.maxtemp_c.toFixed(2) : dayForecast.day.maxtemp_f.toFixed(2)) + unitLabel;
        document.getElementById('weather-icon' + (i + 1)).src = dayForecast.day.condition.icon;
        document.getElementById('weather-condition' + (i + 1)).textContent = 'Condition: ' + dayForecast.day.condition.text;
        document.getElementById('humidity' + (i + 1)).textContent = 'Humidity: ' + dayForecast.day.avghumidity + '%';
        document.getElementById('wind' + (i + 1)).textContent = 'Wind: ' + dayForecast.day.maxwind_mph + ' mph';
    }
}



// Helper function to convert temperatures (if needed)
function convertTemperature(temp, unit) {
    return unit === 'F' ? (temp * 9/5) + 32 : temp; // Assuming a simple Celsius to Fahrenheit conversion
}

// Event listener for the 'Get Weather' button
document.getElementById('get-weather-btn').addEventListener('click', function() {
    const location = document.getElementById('location-input').value;
    const unit =document.querySelector('input[name="unit"]:checked').value;
    getWeather(location, unit);
});
 
// Event listeners for unit change
document.querySelectorAll('input[name="unit"]').forEach((input) => {
    input.addEventListener('change', () => {
        const location = document.getElementById('location-input').value;
        if (location) {
            const unit =document.querySelector('input[name="unit"]:checked').value;
            getWeather(location, unit);
        }
    });
});
 
// Fetch weather data for the default location and unit on window load
window.onload = function() {
    const defaultLocation = 'Muncie,IN';
    const defaultUnit =document.querySelector('input[name="unit"]:checked').value;
    getWeather(defaultLocation, defaultUnit);
};
