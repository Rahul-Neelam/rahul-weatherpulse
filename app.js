// Fetch weather data from an API
async function fetchWeatherData(location, forecast = false) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=9d7abbd1ba2755411427440b8786271d&units=metric`;
  if (forecast) {
    apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=9d7abbd1ba2755411427440b8786271d&units=metric`;
  }
  const response = await fetch(apiUrl);
  const data = await response.json();
  if (!response.ok) {
    throw new Error('Location Not Found');
  }
  return data;
}

// Update the current weather section
function updateCurrentWeather(data) {
  const currentWeatherSection = document.getElementById('current-weather');
  currentWeatherSection.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>Temperature: ${data.main.temp}&deg;C</p>
    <p>Weather: ${data.weather[0].description}</p>
    <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="${data.weather[0].description}" class="weather-image" width="100" height="100">
  `;
}

// Update the forecast section
function updateForecast(data) {
  const forecastSection = document.getElementById('forecast');
  forecastSection.classList.remove('hidden');
  forecastSection.innerHTML = `
    <h2>Weekly Forecast</h2>
    <ul>
      ${data.list.map(item => `
        <li>
          <h3>${new Date(item.dt_txt).toLocaleDateString()}</h3>
          <p>Temperature: ${item.main.temp}&deg;C</p>
          <p>Weather: ${item.weather[0].description}</p>
          <img src="https://openweathermap.org/img/w/${item.weather[0].icon}.png" alt="${item.weather[0].description}" class="weather-image" width="500" height="500">
        </li>
      `).join('')}
    </ul>
  `;
}

// Get weather data by location name
function getWeatherDataByLocation() {
  const locationInput = document.getElementById('location-input');
  const location = locationInput.value.trim();

  if (location) {
    fetchWeatherData(location)
      .then(data => updateCurrentWeather(data))
      .catch(error => {
        console.error(error);
        alert(`Error: ${error.message}\nPlease enter the correct location.`);
      });
  } else {
    console.log('Please enter a location.');
  }
}

// Get weather forecast for the user's location
function getWeatherForecast() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const data = await fetchWeatherData(`${latitude},${longitude}`, true);
      updateForecast(data);
    });
  } else {
    console.log('Geolocation is not supported by this browser.');
  }
}

// Event listener for search button
const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', getWeatherDataByLocation);

// Event listener for forecast link
const forecastLink = document.getElementById('forecast-link');
forecastLink.addEventListener('click', getWeatherForecast);

