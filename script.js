const UNSPLASH_API_KEY = "v1Ywe_PlkifPWtvKQWuh-5qX1vHYFGzzKoCtrsNEhaU";
const API_KEY = "2f5262129af8d21e1d3fe120a5f8c838";
const FORECAST_API_URL = "https://api.openweathermap.org/data/2.5/forecast";
const UNSPLASH_API_URL = "https://api.unsplash.com/photos/random";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

// Function to update the background image based on the weather description
function updateBackgroundImage(description) {
  const url = `${UNSPLASH_API_URL}?query=${description}&client_id=${UNSPLASH_API_KEY}`;
  axios
    .get(url)
    .then((response) => {
      const imageUrl = response.data.urls ? response.data.urls.regular : null;
      if (imageUrl) {
        document.body.style.backgroundImage = `url('${imageUrl}')`;
      } else {
        console.error("Invalid image response:", response.data);
      }
    })
    .catch((error) => console.error("Error fetching image:", error));
}

// Function to fetch weather data
async function fetchWeather(city) {
  try {
    const response = await axios.get(
      `${BASE_URL}weather?q=${city}&appid=${API_KEY}&units=metric`,
    );
    const { humidity, temp } = response.data.main;
    const { speed } = response.data.wind;
    const { description, icon } = response.data.weather[0];
    document.getElementById("humidity").textContent = humidity + "%";
    document.getElementById("temperature").textContent = temp + " °C";
    document.getElementById("wind-speed").textContent = speed + " km/h";
    document.getElementById("weather-description").textContent = description;
    document.getElementById("weather-icon").src =
      `https://openweathermap.org/img/w/${icon}.png`;
    updateBackgroundImage(description);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// Function to fetch forecast data
async function fetchForecast(city) {
  try {
    const response = await axios.get(
      `${FORECAST_API_URL}?q=${city}&appid=${API_KEY}&units=metric`,
    );
    for (let i = 0; i < 5; i++) {
      const { temp } = response.data.list[i * 8].main;
      const { icon } = response.data.list[i * 8].weather[0];
      document.getElementById(`temp-day-${i + 1}`).textContent =
        temp + " °C";
      document.getElementById(`icon-day-${i + 1}`).src =
        `https://openweathermap.org/img/w/${icon}.png`;
    }
  } catch (error) {
    console.error("Error fetching forecast data:", error);
  }
}

// Event listener for the search form submission
const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const city = document.getElementById("search-input").value;
  fetchWeather(city);
  fetchForecast(city);
});

// Function to use the current location button and display results in Celsius with weather icon
function displayCurrentLocationResultsInCelsius(weatherData) {
  document.getElementById("temperature").textContent =
    weatherData.temp + " °C";
  document.getElementById("wind-speed").textContent =
    weatherData.speed + " km/h";
  document.getElementById("humidity").textContent = weatherData.humidity + "%";
  document.getElementById("weather-icon").src =
    `https://openweathermap.org/img/w/${weatherData.icon}.png`;
}

// Event listener for the current location button
const currentLocationButton = document.getElementById("current-location");
currentLocationButton.addEventListener("click", function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async function (position) {
      const { latitude, longitude } = position.coords;
      try {
        const response = await axios.get(
          `${BASE_URL}weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`,
        );
        const weatherData = {
          temp: response.data.main.temp,
          speed: response.data.wind.speed,
          humidity: response.data.main.humidity,
          icon: response.data.weather[0].icon,
        };
        displayCurrentLocationResultsInCelsius(weatherData);
        fetchForecast(response.data.name || "");
        document.getElementById("weather-result").style.display = "block";
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

// Function to update time and date
function updateTimeAndDate() {
  const now = new Date();
  document.getElementById("current-time").textContent =
    now.toLocaleTimeString();
  document.getElementById("current-date").textContent =
    now.toLocaleDateString();
}

// Update time and date every second
setInterval(updateTimeAndDate, 1000);

updateTimeAndDate(); // Initial call to display time and date immediately

// Function to convert temperature between Celsius and Fahrenheit
function convertTemperature() {
  const temperatureElement = document.getElementById("temperature");
  const tempValue = parseFloat(temperatureElement.textContent.trim().split(" ")[0]);
  let newTemp;
  if (temperatureElement.textContent.includes("°C")) {
    newTemp = (tempValue * 9) / 5 + 32;
    temperatureElement.textContent = `${newTemp.toFixed(1)} °F`;
  } else {
    newTemp = ((tempValue - 32) * 5) / 9;
    temperatureElement.textContent = `${newTemp.toFixed(1)} °C`;
  }
}

// Event listener for the temperature conversion button
document
  .getElementById("convert-temp")
  .addEventListener("click", convertTemperature);

// Display current temperature, wind speed, and humidity in the search result
function displaySearchResult(weatherData) {
  document.getElementById("temperature").textContent = weatherData.temp + " °C";
  document.getElementById("wind-speed").textContent =
    weatherData.speed + " km/h";
  document.getElementById("humidity").textContent = weatherData.humidity + "%";
}
