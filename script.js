const weatherDiv = document.getElementById('weather');
const getWeatherBtn = document.getElementById('getWeather');
const voiceSearchBtn = document.getElementById('voiceSearch');
const manualSearchBtn = document.getElementById('manualSearch');
const cityInput = document.getElementById('cityInput');
const datetimeEl = document.getElementById('datetime');

// Display current date and time
function updateTime() {
  const now = new Date();
  datetimeEl.textContent = now.toLocaleString();
}
updateTime();
setInterval(updateTime, 60000);

// Mock weather by city
function fetchWeatherByCity(city) {
  const mockData = {
    name: city,
    temp: 20 + Math.floor(Math.random() * 6),
    description: "partly cloudy",
    wind: (2 + Math.random() * 3).toFixed(1),
    icon: "🌤️"
  };
  displayWeather(mockData);
}

// Mock weather by location
function fetchWeatherByCoords(lat, lon) {
  const mockData = {
    name: "Your Location",
    temp: 26,
    description: "sunny",
    wind: 2.2,
    icon: "☀️"
  };
  displayWeather(mockData);
}

// Display mock data
function displayWeather(data) {
  weatherDiv.innerHTML = `
    <h2>${data.icon} ${data.name}</h2>
    <p>${data.description}</p>
    <p>🌡️ Temp: ${data.temp}°C</p>
    <p>💨 Wind: ${data.wind} m/s</p>
  `;
}

// Location button
getWeatherBtn.addEventListener('click', () => {
  weatherDiv.innerHTML = "Getting location...";
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      () => weatherDiv.innerHTML = "Location access denied."
    );
  } else {
    weatherDiv.innerHTML = "Geolocation not supported.";
  }
});

// Manual search button
manualSearchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    weatherDiv.innerHTML = "Searching...";
    fetchWeatherByCity(city);
  } else {
    weatherDiv.innerHTML = "Please enter a city.";
  }
});

// Voice button
voiceSearchBtn.addEventListener('click', () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Speech recognition not supported.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();
  weatherDiv.innerHTML = "🎤 Listening...";

  recognition.onresult = (event) => {
    const city = event.results[0][0].transcript;
    cityInput.value = city;
    fetchWeatherByCity(city);
  };

  recognition.onerror = (event) => {
    weatherDiv.innerHTML = "Voice error: " + event.error;
  };
});
