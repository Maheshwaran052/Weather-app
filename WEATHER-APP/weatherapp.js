const apiKey = "c4e7da8bb5d914e64e3130b55aa5216d";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

//When button is clicked, the city name which is typed in the searchbox should be searched.
//The searchbox value is passed as a parameter to checkWeather as the city name

searchBtn.addEventListener("click", () => {
  const city = searchBox.value.trim();
  if (city === "") {
    console.error("City name is required");
    document.querySelector(".weather").classList.remove("show");
    alert("Please enter a city name.");
  } else if (!isValidCityName(city)) {
    console.error("Invalid city name");
    document.querySelector(".weather").classList.remove("show");
    alert(" Only Uppercase,lowercase and blankspace characters are allowed");
  } else {
    checkWeather(city);
  }
});


function isValidCityName(city) {
  const regex = /^[a-zA-Z\s]+$/; // Regular expression to allow only letters and spaces

  return regex.test(city);
}


async function checkWeather(city) {
  try {
    const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);

    switch (response.status) {
     
      case 401:
        handleUnauthorisedAccess(response);
        break;
      case 404:
        handleInvalidData();
        break;
      default:
        const data = await response.json();
        updateUIWeatherData(data);
        mapWeatherToImage(data);
        display();
        console.log(data);
        break;
    }
  } catch (error) {
    handleRequestError(error);
  }
}



function handleUnauthorisedAccess(response) {
  console.error("Unauthorized access:", response);
  alert("Unauthorized access. Please try again later.");
}

function handleInvalidData() {
  document.querySelector(".error").classList.add("show");
  document.querySelector(".weather").classList.remove("show");
  alert("City data not found. Please enter a valid city name.");
}

function updateUIWeatherData(data) {
  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
}

function mapWeatherToImage(data) {
  const weatherIconMappings = new Map([
    ["Clouds", "images/clouds.png"],
    ["Clear", "images/clear.png"],
    ["Rain", "images/rain.png"],
    ["Drizzle", "images/drizzle.png"],
    ["Mist", "images/mist.png"],
    ["Haze", "images/Haze.png"]
  ]);

  const icon = data.weather[0].main;

  if (weatherIconMappings.has(icon)) {
    weatherIcon.src = weatherIconMappings.get(icon);
  } else {
    weatherIcon.src = "";
    weatherIcon.alt = `${icon} image is not found`;
  }
}

function display() {
  document.querySelector(".error").classList.remove("show");
  document.querySelector(".weather").classList.add("show");
}

function handleRequestError(error)
{
  console.error("Request failed:",error);
  alert("Oops! an error occured while fetching data from api. Please try again later");
}
