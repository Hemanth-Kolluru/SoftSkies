const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const snowEffect = document.querySelector(".snow");

let currentTab = userTab;
let isRaining = false;
const API_KEY = "ENTER-YOUR-API-KEY";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab) {
    if(clickedTab != currentTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active"))
        {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
            snowEffect.classList.remove("active");
        }
        else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e) {
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo) {
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    const id = weatherInfo?.weather?.[0]?.id;
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    if((id >= 500 && id<=531) || (id >= 200 && id<=232) || (id >= 300 && id<=321))
    {
        document.body.style.backgroundImage = "linear-gradient(160deg, #2c3e50 0%, #bdc3c7 100%)";
        startRain();
    }
    else
    {
        stopRain();
        document.body.style.backgroundImage = "linear-gradient(180deg,rgb(255, 176, 116) 0%, rgb(162, 196, 251) 100%)";
    }
    if(id >= 600 && id <= 622)
    {
        snowEffect.classList.add("active");
        document.body.style.backgroundImage = "linear-gradient(160deg, #3a4e7a 0%, #d7e0eb 100%)";
    }
    else
    {
        snowEffect.classList.remove("active");
    }
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText =`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {

    }
}

function showPosition(position) {
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}


const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);


const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit" , (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === "") 
        return;
    else {
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e) {
        loadingScreen.classList.remove("active");
    }
}

function startRain() {
    if (isRaining) return;
    isRaining = true;
    rain();
}

function stopRain() {
    isRaining = false;
    document.querySelectorAll("hr").forEach((hr) => hr.remove());
    document.querySelectorAll(".thunder").forEach((thunder) => thunder.remove());
}

function rain() {
    let hrElement;
    let counter = 100;
    for (let i = 0; i < counter; i++) {
        hrElement = document.createElement("HR");

        if (i === counter - 1) {
            hrElement.classList.add("thunder");
            document.body.appendChild(hrElement);
            continue;
        }

        hrElement.style.left = Math.floor(Math.random() * window.innerWidth) + "px";
        hrElement.style.animationDuration = 0.2 + Math.random() * 0.3 + "s";
        hrElement.style.animationDelay = Math.random() * 5 + "s";

        document.body.appendChild(hrElement);
    }
}