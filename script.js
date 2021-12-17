"use strict";

const btnContainer = document.querySelector(".btn-container");
const btnWeather = document.querySelector(".btn-weather");
let input;
let temp;
let windSpeed;
let humidity;

const getCity = function (city) {
  fetch(`
  https://api.openweathermap.org/data/2.5/weather?q=${city}
  &units=imperial&appid=4498796788a55331a395a36bd3b20cbb
  `)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      temp = data.main.temp;
      console.log(`The current temperature in ${city}, is ${temp}`);
      windSpeed = data.wind.speed;
      console.log(`The current wind speed in ${city}, is ${windSpeed}`);
      humidity = data.main.humidity;
      console.log(`The current humidity in ${city}, is ${humidity}`);
    })
    .then(() => populateFields());
};

//gets id name from btns and runs get city
const getClick = function (e) {
  e.preventDefault();
  const click = e.target.id;
  console.log(click);
  getCity(click);
};
btnContainer.addEventListener("click", getClick);

//clears string in input
const clearString = function () {
  document.getElementById("city").value = "";
};

//Capturing the string
const cityString = function (e) {
  e.preventDefault();
  input = document.getElementById("city").value;
  console.log(input);
  getCity(input);
  clearString();
};

//Run city string on enter basesd on input
const enterKeyPressed = function (e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    cityString();
    console.log("enter hit");
  }
};

const populateFields = function () {
  document.getElementById("temp").innerHTML = temp;
  document.getElementById("wind").innerHTML = windSpeed;
  document.getElementById("humidity").innerHTML = humidity;
};

btnWeather.addEventListener("click", cityString);
