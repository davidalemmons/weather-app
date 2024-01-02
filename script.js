function convertTemperature(temperature, unit) {
    return unit === 'F' ? (temperature * 9/5) + 32 : (temperature -32) * 5/9;
}
 
// Function to fetch and display weather data
function getWeather(location, unit) {
    const apiKey = '99665606db5b4da1b88144836233112';
    const url = 'http://api.weatherapi.com/v1/current.json?key=' +apiKey + '&q=' + location + '&days=7&aqi=no&alerts=no';
 
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeather(data, unit);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            // Optionally, update the UI to inform the user of the error
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
    document.getElementById('temperature').textContent = 'Temperature: ' + temperature.toFixed(2) + unitLabel;
    document.getElementById('weather-icon').src =data.current.condition.icon;
    document.getElementById('weather-condition').textContent ='Condition: ' + data.current.condition.text;
    document.getElementById('humidity').textContent = 'Humidity: ' +data.current.humidity + '%';
    document.getElementById('wind').textContent = 'Wind: ' +data.current.wind_kph + ' kph';
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
