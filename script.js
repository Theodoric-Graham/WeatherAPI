'use strict';

const btnContainer = document.querySelector('.btn-container');
const btnWeather = document.querySelector('.btn-weather');
const weatherContainer = document.querySelector('.weather-container');
const forecastContainer = document.querySelector('.five-day');
const clearBtn = document.querySelector('.clear');

let oldContainer;
let currCity;
let currState;

//used to dynamically set days
const weekday = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];

//asks for geolocation
const getPosition = async function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

//populates .current-city
const populateFields = function (data) {
  document.getElementById('city-name').innerHTML = currCity;
  document.getElementById('temp').innerHTML = data.current.temp;
  document.getElementById('wind').innerHTML = data.current.wind_speed;
  document.getElementById('humidity').innerHTML = data.current.humidity;
  document.getElementById('uv').innerHTML = data.current.uvi;
};

const clearFields = function () {
  document.getElementById('city-name').innerHTML = '';
  document.getElementById('temp').innerHTML = 0;
  document.getElementById('wind').innerHTML = 0;
  document.getElementById('humidity').innerHTML = 0;
  document.getElementById('uv').innerHTML = 0;
};

const renderForecast = function (dataArr) {
  //only want the 5 day forecast
  dataArr.splice(5, 3);
  //uses new array
  dataArr.map(el => {
    //getting current day
    const dt = el.dt;
    const currentDay = new Date(dt * 1000);
    const day = weekday[currentDay.getDay()];
    //creating dynamic html template
    const html = `
    
    <div class="weather-forecast" id="${'old'}">
      <div class="city-day">
        <p class="forecast-text city-state">${currCity}, ${currState} </p>
        <p class="forecast-text day">${day}</p>
      </div>
      <div class="img-container">
        <img src="http://openweathermap.org/img/wn/${
          el.weather[0].icon
        }@2x.png" alt="weather icon" class="w-icon" />
      </div>
      <div class="forecast-info">
        <p class="forecast-text forecast-text-bottom  temp">Night: ${
          el.temp.night
        }</p>
        <p class="forecast-text forecast-text-bottom temp">Day: ${
          el.temp.day
        }</p>
        <p class="forecast-text forecast-text-bottom wind">Wind Speed: ${
          el.wind_speed
        } mph</p>
        <p class="forecast-text forecast-text-bottom humidity">Humidity: ${
          el.humidity
        }</p>
        <p class="forecast-text forecast-text-bottom uv">UV Index: ${el.uvi}</p>
      </div>
    `;
    //appending to DOM
    forecastContainer.insertAdjacentHTML('beforeend', html);
    oldContainer = document.querySelectorAll('#old');
  });
};

const clearContainer = function () {
  clearFields();
  oldContainer.forEach(el => {
    el.remove();
  });
};

// clearBtn.addEventListener('click', clearContainer);

const localWeather = async function (lat, lng) {
  try {
    //using geo data to use onecall
    const local = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=imperial&exclude={alerts}&appid=44fd4a683d34b7393e0bfa504d69c463`
    );
    //using reverse geocoding to get city name
    const resGeo = await fetch(
      `https://us1.locationiq.com/v1/reverse.php?key=pk.c379041808b3a7acd8229aa674a6d7c2&lat=${lat}&lon=${lng}&format=json`
    );
    const dataGeo = await resGeo.json();
    currCity = dataGeo.address.city;
    currState = dataGeo.address.state;

    //parsing data
    const localWeatherData = await local.json();
    //creating variables
    const forecastArr = localWeatherData.daily;
    renderForecast(forecastArr);
    //rendering data to dom
    populateFields(localWeatherData);
  } catch (err) {
    err => console.error(err);
  }
};

const runGeo = async function () {
  //Geolocation using getPosition
  const pos = await getPosition();
  //destructuring
  let { latitude: lat, longitude: lng } = pos.coords;
  localWeather(lat, lng);
};

runGeo();

const getCityData = async function (city) {
  //clear current forecast
  clearContainer();
  //fetching data based on city
  const cityFetch = await fetch(`
      https://api.openweathermap.org/data/2.5/weather?q=${city}
      &units=imperial&appid=4498796788a55331a395a36bd3b20cbb
      `);
  const cityData = await cityFetch.json();
  const cityLat = cityData.coord.lat;
  const cityLng = cityData.coord.lon;
  localWeather(cityLat, cityLng);
};

// gets id name from btns and runs get city based on id name
const getClick = function (e) {
  e.preventDefault();
  const click = e.target.id;
  //calling getCityData based on id name (ex getCityData('San Antonio'))
  getCityData(click);
};
btnContainer.addEventListener('click', getClick);

//clears string in input
const clearString = function () {
  document.getElementById('city').value = '';
};

//Capturing the string
const cityString = function (e) {
  e.preventDefault();
  const input = document.getElementById('city').value;
  console.log(input);
  getCityData(input);
  clearString();
};

//Run city string on enter based on input
const enterKeyPressed = function (e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    cityString();
    console.log('enter hit');
  }
};

btnWeather.addEventListener('click', cityString);
