"use strict";
const api = "https://api.openweathermap.org/data/2.5/weather?q=bangkok&units=metric&appid=01d9f2d66b5fb9c863aa86b5cb001cd2";
const btn = document.querySelector("button");
const search = document.querySelector("input");
const refresh = document.querySelector(".refresh");
const img = document.querySelector("img");
const forecastContainer = document.getElementById('forecast');
const cityNameDiv = document.querySelector('.city-name');
const overcastDiv = document.querySelector('.overcast');
const tempLargeDiv = document.querySelector('.temp-large');
const humidityDiv = document.querySelector('.humidity');
const pressureDiv = document.querySelector('.pressure');
const windDiv = document.querySelector('.wind');
const visibilityDiv = document.querySelector('.visibility');
const sunriseDiv = document.querySelector('.sunrise');
const sunsetDiv = document.querySelector('.sunset');
const msgwDiv = document.querySelector('.msgw');
const weatherIconLarge = document.getElementById('weather-icon-large');


function formatTime(unix, timezoneOffset) {
    const date = new Date((unix + timezoneOffset) * 1000);
    return date.toUTCString().match(/\d{2}:\d{2}/)[0];
}

const getData = async () => {
    if (!search.value.trim()) {
        cityNameDiv.innerText = "Please enter a city name.";
        overcastDiv.innerText = '';
        tempLargeDiv.innerText = '';
        weatherIconLarge.style.display = 'none';
        humidityDiv.innerText = '';
        pressureDiv.innerText = '';
        windDiv.innerText = '';
        visibilityDiv.innerText = '';
        sunriseDiv.innerText = '';
        sunsetDiv.innerText = '';
        msgwDiv.innerText = '';
        forecastContainer.innerHTML = '';
        return;
    }
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search.value}&units=metric&appid=01d9f2d66b5fb9c863aa86b5cb001cd2`);
    if(response.ok){
        let data = await response.json();
        let t = data.main.temp;
        let cityName = data.name;
        let humidity = data.main.humidity;
        let pressure = data.main.pressure;
        let weather = data.weather[0].description;
        let icon = data.weather[0].icon;
        let windSpeed = data.wind.speed;
        let windKmh = (windSpeed * 3.6).toFixed(1);
        let vis = data.visibility;
        let sunr = data.sys.sunrise;
        let suns = data.sys.sunset;
        let tz = data.timezone;
        cityNameDiv.innerText = cityName;
        overcastDiv.innerText = weather;
        tempLargeDiv.innerText = `${t}°C`;
        if (icon) {
            weatherIconLarge.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            weatherIconLarge.style.display = 'block';
        } else {
            weatherIconLarge.style.display = 'none';
        }
        humidityDiv.innerText = `Humidity: ${humidity}%`;
        pressureDiv.innerText = `Pressure: ${pressure} hPa`;
        windDiv.innerText = `Wind: ${windKmh} km/h`;
        visibilityDiv.innerText = `Visibility: ${(vis/1000).toFixed(1)} km`;
        sunriseDiv.innerText = `Sunrise: ${formatTime(sunr, tz)}`;
        sunsetDiv.innerText = `Sunset: ${formatTime(suns, tz)}`;
        msgwDiv.innerText = '';
        afterWeatherDataLoaded();
        getForecast(cityName);
    }
    else{
        clr();
        forecastContainer.innerHTML = '';
        cityNameDiv.innerText = `${search.value.toUpperCase()} ${response.statusText}`;
        overcastDiv.innerText = '';
        tempLargeDiv.innerText = '';
        weatherIconLarge.style.display = 'none';
        humidityDiv.innerText = '';
        pressureDiv.innerText = '';
        windDiv.innerText = '';
        visibilityDiv.innerText = '';
        sunriseDiv.innerText = '';
        sunsetDiv.innerText = '';
        msgwDiv.innerText = '';
    }
};

const getForecast = async (city) => {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=01d9f2d66b5fb9c863aa86b5cb001cd2`);
    if(response.ok){
        let data = await response.json();
        // Get one forecast per day (at 12:00)
        let daily = {};
        data.list.forEach(item => {
            if(item.dt_txt.includes('12:00:00')) {
                const date = item.dt_txt.split(' ')[0];
                daily[date] = item;
            }
        });
        forecastContainer.innerHTML = '';
        Object.values(daily).slice(0,5).forEach(item => {
            const day = new Date(item.dt_txt).toLocaleDateString(undefined, { weekday: 'short' });
            const icon = item.weather[0].icon;
            const temp = Math.round(item.main.temp);
            const desc = item.weather[0].description;
            forecastContainer.innerHTML += `
                <div class="forecast-day">
                    <div>${day}</div>
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
                    <div>${temp}°C</div>
                    <div style="font-size:0.8em;">${desc}</div>
                </div>
            `;
        });
    } else {
        forecastContainer.innerHTML = '<div style="color:red;">No forecast data</div>';
    }
};

btn.addEventListener("click", () => {
    getRandomImage();
    getData();
});

search.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        getRandomImage();
        getData();
    }
});

refresh.addEventListener("click", () => {
    clr();
    forecastContainer.innerHTML = '';
});

// Add automatic cycling of weather details
const weatherDetailsOrder = [
    humidityDiv,
    pressureDiv,
    windDiv,
    visibilityDiv,
    sunriseDiv,
    sunsetDiv
];
let currentDetailIndex = 0;
let weatherDetailInterval = null;

function showOnlyWeatherDetail(index) {
    weatherDetailsOrder.forEach((div, i) => {
        if (i === index) {
            div.style.display = '';
        } else {
            div.style.display = 'none';
        }
    });
}

function startWeatherDetailCycle() {
    if (weatherDetailInterval) clearInterval(weatherDetailInterval);
    showOnlyWeatherDetail(currentDetailIndex);
    weatherDetailInterval = setInterval(() => {
        currentDetailIndex = (currentDetailIndex + 1) % weatherDetailsOrder.length;
        showOnlyWeatherDetail(currentDetailIndex);
    }, 5000);
}

function stopWeatherDetailCycle() {
    if (weatherDetailInterval) clearInterval(weatherDetailInterval);
    weatherDetailsOrder.forEach(div => div.style.display = '');
}

// Start cycling after weather data is loaded
function afterWeatherDataLoaded() {
    currentDetailIndex = 0;
    startWeatherDetailCycle();
}

const clr = () => {
    cityNameDiv.innerText = "";
    overcastDiv.innerText = "";
    tempLargeDiv.innerText = "";
    weatherIconLarge.style.display = 'none';
    humidityDiv.innerText = "";
    pressureDiv.innerText = "";
    windDiv.innerText = "";
    visibilityDiv.innerText = "";
    sunriseDiv.innerText = "";
    sunsetDiv.innerText = "";
    msgwDiv.innerText = "";
    search.value = "";
    stopWeatherDetailCycle();
};
    

function getRandomImage(){
    const apiKey = 'KmAl00U7hxyRuHW5mBmMh-rbbRK0hPp-lZwfBJ6xrMk';
    $.ajax({
        type: 'GET',
        url: "https://api.unsplash.com/photos/random/?client_id=KmAl00U7hxyRuHW5mBmMh-rbbRK0hPp-lZwfBJ6xrMk&query=city",
        success: function(response){
            const imageUrl = response.urls.regular;
            $('#image-container').attr('src', imageUrl);
        },
        error: function(error){
            console.error('Error:',error);
        }
    });
}

// Add click functionality for app logo and title
const appLogo = document.querySelector('.app-logo');
const appTitle = document.querySelector('.app-title');
const appHeader = document.querySelector('.app-header');

let isLogoCentered = false;

function toggleLogoState() {
    if (isLogoCentered) {
        // Return to normal state
        appHeader.style.justifyContent = 'center';
        appLogo.style.marginRight = '0';
        appTitle.style.display = 'block';
        appTitle.style.marginLeft = '-10px';
        appLogo.style.transform = 'none';
    } else {
        // Center the logo and hide "eather"
        appHeader.style.justifyContent = 'center';
        appLogo.style.marginRight = '0';
        appTitle.style.display = 'none';
        appLogo.style.transform = 'scale(1.2)';
    }
    isLogoCentered = !isLogoCentered;
}

// Add click event listeners
appLogo.addEventListener('click', toggleLogoState);
appTitle.addEventListener('click', toggleLogoState);

// On page load, show default city
window.addEventListener('DOMContentLoaded', () => {
    if (!search.value) {
        search.value = 'indore';
    }
    getRandomImage();
    getData();
});