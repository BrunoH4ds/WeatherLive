const API_KEY = "YOUR_API_KEY_openweathermap";

/* ELEMENTOS -------------------------------------------------------*/

const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");

const locationElement = document.getElementById("location");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feelsLike");

const humidity = document.getElementById("humidity");
const pressure = document.getElementById("pressure");
const windSpeed = document.getElementById("windSpeed");
const windDirection = document.getElementById("windDirection");
const visibility = document.getElementById("visibility");
const uvi = document.getElementById("uvi");
const clouds = document.getElementById("clouds");
const dewPoint = document.getElementById("dewPoint");
const rain = document.getElementById("rain");
const snow = document.getElementById("snow");
const windGust = document.getElementById("windGust");

const timezone = document.getElementById("timezone");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const latitude = document.getElementById("latitude");
const longitude = document.getElementById("longitude");

const updatedAt = document.getElementById("updatedAt");

const alerts = document.getElementById("alerts");
const alertText = document.getElementById("alertText");

searchButton.addEventListener("click", () => {
  searchWeather(cityInput.value.trim());
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchWeather(cityInput.value.trim());
  }
});

async function searchWeather(city) {

  if (!API_KEY || API_KEY === "SUA_API_KEY_AQUI") {
    alert("Api Key não encontrada.");

    return;
  }

  try {
    searchButton.disabled = true;

    const url =
      `https://api.openweathermap.org/data/2.5/weather` +
      `?q=${encodeURIComponent(city)}` +
      `&appid=${API_KEY}` +
      `&units=metric` +
      `&lang=pt_br`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Não foi possível encontrar essa localização.");
    }

    const data = await response.json();

    updateWeather(data);
  } catch (error) {
    console.error(error);

    alert(error.message);
  } finally {
    
    searchButton.disabled = false;
  }
}

function updateBackground(weatherMain) {
  const body = document.body;

  body.classList.remove(
    "weather-clear",
    "weather-clouds",
    "weather-rain",
    "weather-drizzle",
    "weather-thunderstorm",
    "weather-snow",
    "weather-mist"
  );

  switch (weatherMain) {

    case "Clear":
      body.classList.add("weather-clear");
      break;

    case "Clouds":
      body.classList.add("weather-clouds");
      break;

    case "Rain":
      body.classList.add("weather-rain");
      break;

    case "Drizzle":
      body.classList.add("weather-drizzle");
      break;

    case "Thunderstorm":
      body.classList.add("weather-thunderstorm");
      break;

    case "Snow":
      body.classList.add("weather-snow");
      break;

    case "Mist":
    case "Fog":
    case "Haze":
      body.classList.add("weather-mist");
      break;

    default:
      body.classList.add("weather-clouds");
  }
}

/* FORMATAR TEMPO -------------------------------------------------------*/
function formatTime(unixTime, timezoneOffset) {
  if (!unixTime) {
    return "--:--";
  }

  const date = new Date((unixTime + timezoneOffset) * 1000);

  return date.toISOString().substring(11, 16);
}

/* DIRECAO DO VENTO -------------------------------------------------------*/
function getWindDirection(degrees) {
  const directions = ["N", "NE", "L", "SE", "S", "SO", "O", "NO"];

  const index = Math.round(degrees / 45) % 8;

  return `${degrees}° (${directions[index]})`;
}

/* ATUALIZA OS DADOS -------------------------------------------------------*/
function updateWeather(data) {

  locationElement.textContent = `${data.name || "Local"}, ${data.sys?.country || ""}`;

  temperature.textContent = `${Math.round(data.main.temp)}°C`;

  feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;

  const weather = data.weather?.[0];

  if (weather) {
    description.textContent = weather.description;

    weatherIcon.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

    weatherIcon.alt = weather.description;

    updateBackground(
      weather.main,
      weather.icon
    );
  }

  humidity.textContent = `${data.main.humidity}%`;

  pressure.textContent = `${data.main.pressure} hPa`;

  windSpeed.textContent = `${data.wind?.speed ?? "--"} m/s`;

  windDirection.textContent =
    data.wind?.deg !== undefined ? getWindDirection(data.wind.deg) : "--";

  visibility.textContent = data.visibility
    ? `${(data.visibility / 1000).toFixed(1)} km`
    : "-- km";

  clouds.textContent = `${data.clouds?.all ?? "--"}%`;

  dewPoint.textContent =
    data.dew_point !== undefined
      ? `${Math.round(data.dew_point)}°C`
      : "--°C";

  uvi.textContent = data.uvi !== undefined ? data.uvi : "--";

  windGust.textContent =
    data.wind?.gust !== undefined ? `${data.wind.gust} m/s` : "-- m/s";

  rain.textContent =
    data.rain?.["1h"] !== undefined
      ? `${data.rain["1h"]} mm/h`
      : "0 mm/h";

  snow.textContent =
    data.snow?.["1h"] !== undefined
      ? `${data.snow["1h"]} mm/h`
      : "0 mm/h";

  latitude.textContent = data.coord?.lat ?? "--";

  longitude.textContent = data.coord?.lon ?? "--";

  timezone.textContent = data.timezone ? data.timezone : "--";

  const offset = data.timezone || 0;

  sunrise.textContent = formatTime(data.sys?.sunrise, offset);

  sunset.textContent = formatTime(data.sys?.sunset, offset);

  updatedAt.textContent = formatTime(data.dt, offset);

  if (data.alerts && data.alerts.length > 0) {
    alerts.style.display = "block";

    alertText.textContent = JSON.stringify(data.alerts);
  } else {
    alerts.style.display = "none";
  }
}