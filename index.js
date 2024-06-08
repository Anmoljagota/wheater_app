//Getting the data from api
const apikey = "wsicmdkbrrbcjaz7e7ny5e4ras7cif5zk3i5kdn1";

//function to create sun icon
// Function to create and insert the sun element
function createSunElement() {
  const sunContainer = document.createElement("div");
  sunContainer.className = "sun-container";

  const sun = document.createElement("div");
  sun.className = "sun";

  const rays = document.createElement("div");
  rays.className = "rays";

  for (let i = 1; i <= 12; i++) {
    const ray = document.createElement("div");
    ray.className = `ray ray${i}`;
    rays.appendChild(ray);
  }

  sun.appendChild(rays);
  sunContainer.appendChild(sun);

  return sunContainer;
}

// Function to add a new sun element to the container
function addSun() {
  const sunElement = createSunElement();
  return sunElement;
}

const extractTime = (dateString) => {
  // Parse the date string into a Date object
  const date = new Date(dateString);
  // Extract hours, minutes, and seconds
  let hours = date.getHours();
  const minutes = date.getMinutes();
  // Determine AM or PM
  let ampm = hours >= 12 ? "PM" : "AM";
  // Convert hours from 24-hour to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  // Format hours, minutes, to be always two digits
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  // Combine into a formatted time string
  const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
  return formattedTime;
};

//TO Show The Data of current weather
const ShowData = (weatherdetails) => {
  if (
    weatherdetails.current.summary.includes("sunny") ||
    weatherdetails.current.summary.includes("Clear")
  ) {
    document.body.style.backgroundColor = "#0E7578";
  } else {
    document.body.style.backgroundColor = "#191923";
  }
  // <i class="fa-solid fa-cloud-showers-heavy"></i>
  var parent = document.querySelector(".hourly-weather");

  parent.innerHTML = "";
  weatherdetails.hourly.data.forEach((ele, i) => {
    if (i % 4 === 0) {
      const div = document.createElement("div");
      div.classList.add("hour", "flex-center");
      const time = extractTime(ele.date);
      const timeheading = document.createElement("p");
      timeheading.setAttribute("class", "time");
      timeheading.innerHTML = time;
      // div.appendChild(timeheading);
      const iconElement = document.createElement("i");
      ele.summary === "Cloudy"
        ? iconElement.classList.add("fa-solid", "fa-cloud", "weather-icon")
        : iconElement.classList.add(
            "fa-solid",
            "fa-cloud-showers-heavy",
            "weather-icon"
          );
      const addelement = ele.summary === "Sunny" ? addSun() : iconElement;
      const temp = document.createElement("div");
      temp.setAttribute("class", "temp");
      temp.innerText = `${ele.temperature}°C`;
      div.append(timeheading, addelement, temp);
      parent.appendChild(div);
    }
  });
};

//API TO GET DATA 
const GetWeatherDetails = async (lat, lon, val) => {
  try {
    const url =
      lat === null && lon === null
        ? `https://www.meteosource.com/api/v1/free/point?place_id=${val}&sections=all&timezone=UTC&language=en&units=metric&key=${apikey}`
        : `https://www.meteosource.com/api/v1/free/point?lat=${lat}&lon=${lon}&sections=all&timezone=UTC&language=en&units=metric&key=${apikey}`;
    const res = await fetch(url);
    const data = await res.json();

    ShowData(data);
    DaysWeather(data);
    mainweather(data, val);
  } catch (err) {
    console.log(err);
  }
};
const GetLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        GetWeatherDetails(latitude, longitude);
      },
      (err) => {
        console.log(err.message);
      }
    );
  }
};

//NEXT 7 DAY FORECASE

const DayOfweek = (dateString) => {
  const date = new Date(dateString);
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = daysOfWeek[date.getDay()];
  const shortDayString = dayOfWeek.substring(0, 3);
  return shortDayString;
};
const DaysWeather = (weatherdata) => {
  const main = document.querySelector("#main-day-forecast");
  main.innerHTML = "";
  weatherdata.daily.data.forEach((ele) => {
    const currentday = DayOfweek(ele.day);
    const div = document.createElement("div");
    div.setAttribute("class", "current-day");
    const dayAbbreviation = document.createElement("div");
    dayAbbreviation.className = "day-abbreviation";
    dayAbbreviation.innerText = currentday;

    const weatherCondition = document.createElement("div");
    weatherCondition.setAttribute("class", "weatherCondition");
    const iconElement = document.createElement("i");
    const weather = document.createElement("div");
    const temp = document.createElement("p");
    temp.innerText = `${ele.all_day.temperature}°C`;
    weather.innerHTML = ele.weather;
    ele.weather.includes("cloudy")
      ? iconElement.classList.add("fa-solid", "fa-cloud", "weather-icon")
      : iconElement.classList.add(
          "fa-solid",
          "fa-cloud-showers-heavy",
          "weather-icon"
        );
    const addelement = ele.weather.includes("sunny") ? addSun() : iconElement;
    weatherCondition.append(addelement, weather);
    div.append(dayAbbreviation, weatherCondition, temp);
    main.append(div);
  });
};
let id;
const getcity = () => {
  if (id) {
    clearTimeout(id);
  }
  id = setTimeout(() => {
    const val = document.querySelector(".input-wrapper>input").value;

    val && GetWeatherDetails(null, null, val);
  }, 2000);
};


//Mainn DAY wheater details
function mainweather(data, val) {
  const icon = document.getElementById("weather-icon");
  if (val) {
    document.getElementById("city").innerText = val;
  }

  icon.innerHTML = "";

  const chance_rain = document.getElementById("rain-chace");
  const temp = document.getElementById("temp");
  icon.innerHTML = "";
  chance_rain.innerText = `chance of rain ${data.current.precipitation.total}%`;
  temp.innerText = `${data.current.temperature}°C`;
  chance_rain.style.color = "#787272";
  const iconElement = document.createElement("i");
  data.current.summary.includes("cloudy")
    ? iconElement.classList.add("fa-solid", "fa-cloud", "weather-icon")
    : iconElement.classList.add(
        "fa-solid",
        "fa-cloud-showers-heavy",
        "weather-icon"
      );
  const addelement = data.current.summary.includes("cloudy")
    ? iconElement
    : addSun();
  addelement.style.fontSize = "8rem";

  icon.append(addelement);
}


window.addEventListener("DOMContentLoaded", () => {
  GetLocation();
});