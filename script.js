const API_KEY = "51a17df105e024f49c4eb74868e5f16e";
let units ="metric";
let currentCity = "Gambela";

// get html elment
let city = document.querySelector(".city"),
    date = document.querySelector(".date"),
    weatherStatus = document.querySelector(".weather-status"),
    weatherIcon = document.querySelector(".weather-icon"),
    temperature = document.querySelector(".temp-value"),
    humidity = document.querySelector(".humidity-value"),
    wind = document.querySelector(".wind-value"),
    pressure = document.querySelector(".pressure-value"),
    sunrise = document.getElementById("sunrise-value"),
    sunset = document.getElementById("sunset-value"),
    userLocation = document.querySelector(".search-form");

//Convert code to name
function convertCountryCode(country){
  let regionName = new Intl.DisplayNames(["eng"], {type:'region'});
  return regionName.of (country);
}

// conevert timestamp to date

function convertTimeStamp(timestamp, timezone){
  const convertTimeZone = timezone/3600;
  let date = new Date(timestamp*1000);
  let options ={
    weekday:"long",
    day: "numeric",
    month:"long",
    year: "numeric",
    hour: "numeric",
    minute:"numeric",
    timezone:`ETC/GMT ${convertTimeZone} >= 0? "+":"-"${Math.abs(convertTimeZone)}`,
    hourly12: true,
  }
  return date.toLocaleString("en-US", options)
}
// change time from timestamp to readable
function sunriseTime(sunrisetimestamp){
  let sunriseDate = new Date(sunrisetimestamp*1000);
  let options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourly12: true
  };
  return sunriseDate.toLocaleTimeString('en-US', options);
}
function sunsetTime(timestamp){
  let sunsetTimeStamp = new Date(timestamp*1000);
  options ={
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourly12: true
  }
  return sunsetTimeStamp.toLocaleTimeString('en-US', options);
}

//for user, use the input button
document.querySelector(".search-form").addEventListener("submit", e => {
  let search = document.querySelector(".user-location");
  e.preventDefault();
  currentCity = search.value;
  getWeather()
})
//for user, use search icon
document.getElementById("search-icon").addEventListener("click", e=>{
  let search = document.querySelector(".user-location");
  e.preventDefault();
  currentCity = search.value;
   getWeather();
  
});

//unit conversion
document.getElementById("converter").addEventListener("change", (event) =>{
    units = event.target.value;
    if(currentCity === "Gambela" ){
      getWeather(currentCity)
    }
    else{
      let searchCity = document.querySelector(".user-location");
      currentCity = searchCity.value;
      getWeather(currentCity)
    }
});


function getWeather(){
  fetch(`https://api.openweathermap.org/data/2.5/weather?q= ${currentCity}&appid=${API_KEY}&units=${units}`).then(response =>{
    if(!response.ok){
      alert("City not found!");
      throw new Error("City not found");
    }
   return response.json();
  })
  .then(data => {
  city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`;
  date.innerHTML = `${convertTimeStamp(data.dt, data.timezone)}`;
  weatherStatus.innerHTML = `<p> ${data.weather[0].main} </p>`;
  weatherIcon.innerHTML=`<img src ="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`;
  temperature.innerHTML = `${data.main.temp.toFixed()}&#176`;
  humidity.innerHTML = `${data.main.humidity}%`;
  wind.innerHTML = `${data.wind.speed}${units==="imperial"? " mph":" m/s"}`;
  pressure.innerHTML = `${data.main.pressure} hpa`;
  sunrise.innerHTML =`${sunriseTime(data.sys.sunrise)}`;
  sunset.innerHTML = `${sunsetTime(data.sys.sunset)}`;
  console.log(data);})
  .catch(error => console.error(error));
}
document.body.addEventListener("load", getWeather());