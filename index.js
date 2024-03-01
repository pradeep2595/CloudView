const searchButton = document.querySelector(".search-btn");
const cityInput = document.querySelector(".city-input");
const weatherCardsDiv = document.querySelector(".weather-cards");
const currentWeatherDiv = document.querySelector(".current-weather");

const API_KEY = '';

const createWeatherCard = (cityName, weatherItem, index) => {

    if(index === 0){
        return `<div class="details">
        <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
        <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)} C</h4>
        <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
    </div>
    <div class="icon">
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0]}@4x.png" alt="weather-icon">
        <h4>${weatherItem.weather[0].description}</h4>
    </div>`;
    }else{
        return `<li class="card">
    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0]}@2x.png" alt="weather-icon">
    <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)} C</h4>
    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
</li>`;
    }

}

const getWeatherDetails = (cityName, lat , lon) => {
    
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=5&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        console.log(data);
        const uniqueForecastDays = [];

        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });
        cityInput.value = "";
        weatherCardsDiv.innerHTML = "";
        currentWeatherDiv.innerHTML = "";

        fiveDaysForecast.forEach((weatherItem, index) => {
            if(index === 0){
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
            //weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem));
            //createWeatherCard(weatherItem);
        });

    }).catch(() => {
        alert("Error");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName) return;

    const API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    
    fetch(API_URL).then(res => res.json()).then(data => {
        if(!data.length){
            return alert(`No co-ordinates found for ${cityName}`);
        }
        console.log(data);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);

    }).catch(() => {
        alert("Error");
    });
}

searchButton.addEventListener("click", getCityCoordinates);

