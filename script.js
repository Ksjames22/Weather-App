const apiKey = '5c73939af862b16168a36bd715f86959'; 
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');
const historyList = document.getElementById('history-list');


searchForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const cityName = cityInput.value.trim();
  if (cityName) {
    getWeather(cityName);
    cityInput.value = '';
  }
});

// Function to fetch weather data from OpenWeatherMap API
async function getWeather(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}`);
    if (!response.ok) {
      throw new Error('City not found');
    }
    const data = await response.json();
    console.log(data);
    renderWeather(data);
    saveToLocalStorage(city);
    renderSearchHistory();
  } catch (error) {
    console.error('Error fetching weather:', error);
    alert('City not found. Please enter a valid city name.');
  }
}

// Function to render current weather and forecast
function renderWeather(data) {
  // Clear previous data
  currentWeather.innerHTML = '';
  forecast.innerHTML = '';

  // Current weather
  const current = data.list[0];
  const currentDate = new Date(current.dt * 1000).toLocaleDateString();
  const iconUrl = `http://openweathermap.org/img/wn/${current.weather[0].icon}.png`;
  
  const currentWeatherHTML = `
    <h2>${data.city.name} (${currentDate}) <img src="${iconUrl}" alt="${current.weather[0].description}"></h2>
    <p>Temperature: ${current.main.temp} °C</p>
    <p>Humidity: ${current.main.humidity}%</p>
    <p>Wind Speed: ${current.wind.speed} m/s</p>
  `;
  currentWeather.innerHTML = currentWeatherHTML;

  // 5-day forecast
  for (let i = 1; i < data.list.length; i += 8) {
    const forecastData = data.list[i];
    const forecastDate = new Date(forecastData.dt * 1000).toLocaleDateString();
    const forecastIconUrl = `http://openweathermap.org/img/wn/${forecastData.weather[0].icon}.png`;

    const forecastHTML = `
      <div>
        <p>${forecastDate}</p>
        <img src="${forecastIconUrl}" alt="${forecastData.weather[0].description}">
        <p>Temp: ${forecastData.main.temp} °C</p>
        <p>Humidity: ${forecastData.main.humidity}%</p>
        <p>Wind: ${forecastData.wind.speed} m/s</p>
      </div>
    `;
    forecast.innerHTML += forecastHTML;
  }
}

// Function to save searched city to localStorage
function saveToLocalStorage(city) {
  let history = JSON.parse(localStorage.getItem('weather_history')) || [];
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem('weather_history', JSON.stringify(history));
  }
}

// Function to render search history
function renderSearchHistory() {
  historyList.innerHTML = '';
  const history = JSON.parse(localStorage.getItem('weather_history')) || [];

  history.forEach(city => {
    const li = document.createElement('li');
    li.textContent = city;
    li.addEventListener('click', () => getWeather(city));
    historyList.appendChild(li);
  });
}

// Initial call to render search history on page load
renderSearchHistory();

