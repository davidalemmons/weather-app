function convertTemperature(temperature, unit) {
    return unit === 'F' ? (temperature * 9/5) + 32 : (temperature -32) * 5/9;
}
 
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
            console.log('Full data received from API:', data);
            displayWeather(data, unit);
            displayForecast(data, unit);
            display24hr(data, unit);
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error);
        });
}
 
function displayWeather(data, unit) {
    let temperature = data.current.temp_c;
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
 
function display24hr(data, unit) {
    const unitLabel = unit === 'C' ? '°C' : '°F';
    const container = document.getElementById('hr-container');

    container.innerHTML = '';

    for (let i = 0; i < 24; i++) {
        const hourForecast = data.forecast.forecastday[0].hour[i];

        if (!hourForecast) {
            console.error('Forecast data for hour ' + (i + 1) + ' is missing');
            continue;
        }

        const hourDiv = document.createElement('div');
        hourDiv.className = 'hour-container';

        hourDiv.innerHTML = `
            <div id="hour${i + 1}">${formatHour(hourForecast.time)}</div>
            <div id="temphr${i + 1}">Temp: ${(unit === 'C' ? hourForecast.temp_c.toFixed(2) : hourForecast.temp_f.toFixed(2)) + unitLabel}</div>
            <img id="weather-iconhr${i + 1}" src="${hourForecast.condition.icon}" alt="Weather Icon">
            <div id="weather-conditionhr${i + 1}">Condition: ${hourForecast.condition.text}</div>
            <div id="humidityhr${i + 1}">Humidity: ${hourForecast.humidity}%</div>
            <div id="windhr${i + 1}">Wind: ${hourForecast.wind_mph} mph</div>
        `;

        container.appendChild(hourDiv);
    }
}

function formatHour(hourString) {
    const time = new Date(hourString);
    return time.getHours() + ':00';
}

function displayForecast(data, unit) {
    const unitLabel = unit === 'C' ? '°C' : '°F';
    const container = document.getElementById('forecast-container');

    container.innerHTML = '';

    for (let i = 0; i < 7; i++) {
        const dayForecast = data.forecast.forecastday[i];

        if (!dayForecast) {
            console.error('Forecast data for day ' + (i + 1) + ' is missing');
            continue;
        }

        const forecastDiv = document.createElement('div');
        forecastDiv.id = 'date' + (i + 1);
        forecastDiv.innerHTML = `
            <div id="day${i + 1}">${dayForecast.date}</div>
            <div id="temp${i + 1}low">Low: ${(unit === 'C' ? dayForecast.day.mintemp_c.toFixed(2) : dayForecast.day.mintemp_f.toFixed(2)) + unitLabel}</div>
            <div id="temp${i + 1}high">High: ${(unit === 'C' ? dayForecast.day.maxtemp_c.toFixed(2) : dayForecast.day.maxtemp_f.toFixed(2)) + unitLabel}</div>
            <img id="weather-icon${i + 1}" src="${dayForecast.day.condition.icon}" alt="Weather Icon">
            <div id="weather-condition${i + 1}">Condition: ${dayForecast.day.condition.text}</div>
            <div id="humidity${i + 1}">Humidity: ${dayForecast.day.avghumidity}%</div>
            <div id="wind${i + 1}">Wind: ${dayForecast.day.maxwind_mph} mph</div>
        `;

        container.appendChild(forecastDiv);
    }
}

function convertTemperature(temp, unit) {
    return unit === 'F' ? (temp * 9/5) + 32 : temp;
}


function enableDragScroll(el) {
    let isDown = false;
    let startX;
    let scrollLeft;

    el.addEventListener('mousedown', (e) => {
        isDown = true;
        el.classList.add('active');
        startX = e.pageX - el.offsetLeft;
        scrollLeft = el.scrollLeft;
    });

    el.addEventListener('mouseleave', () => {
        isDown = false;
        el.classList.remove('active');
    });

    el.addEventListener('mouseup', () => {
        isDown = false;
        el.classList.remove('active');
    });

    el.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startX) * 2;
        el.scrollLeft = scrollLeft - walk;
    });
}

enableDragScroll(document.getElementById('hr-container'));


document.getElementById('get-weather-btn').addEventListener('click', function() {
    const location = document.getElementById('location-input').value;
    const unit =document.querySelector('input[name="unit"]:checked').value;
    getWeather(location, unit);
});
 
document.querySelectorAll('input[name="unit"]').forEach((input) => {
    input.addEventListener('change', () => {
        const location = document.getElementById('location-input').value;
        if (location) {
            const unit =document.querySelector('input[name="unit"]:checked').value;
            getWeather(location, unit);
        }
    });
});
 
window.onload = function() {
    const defaultLocation = 'Muncie,IN';
    const defaultUnit =document.querySelector('input[name="unit"]:checked').value;
    getWeather(defaultLocation, defaultUnit);
};
