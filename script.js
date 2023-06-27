const apiKey = "c1ab2c00ee8700801e0052c1001c8f54";
const apiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric";

const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

async function getForecast(city) {
    const response = await fetch(apiUrl + "&appid=" + apiKey + "&q=" + city);
    var data = await response.json();
    if (data.cod == 200) updateValues(data);
    else if (data.cod == 404) alert("City Not Found");
    else alert("Error fetching data from API")
    console.log(data);
}

function $(id) {
    return document.getElementById(id);
}

function getTime(time) {
    let T = new Date(time * 1000);
    if (T.getHours() > 12) {
        return (T.getHours() - 12).toString().padStart(2, "0") + ":" + T.getMinutes().toString().padStart(2, "0") + " PM";
    }
    return T.getHours().toString().padStart(2, "0") + " : " + T.getMinutes().toString().padStart(2, "0") + " AM";
}

const updateValues = (data) => {
    let D = new Date();
    $('location').innerText = data.city.name;
    $("weatherIcon").src = `icons/${data.list[0].weather[0].icon}.svg`;
    $('temperature').innerText = Math.round(data.list[0].main.temp);

    $("weatherDescription").innerText=(data.list[0].weather[0].description).toString();

    $('dateTime').innerText =
        "Time: " + D.getHours().toString().padStart(2, "0") +
        " : " + D.getMinutes().toString().padStart(2, "0") +
        " - " +
        "Date: " + D.getDate().toString().padStart(2, "0") +
        " / " + (D.getMonth() + 1).toString().padStart(2, "0");
    $("currentWeather").style.background = `url('images/${data.list[0].weather[0].icon}.jpg') no-repeat center center/cover`;
    $('sunrise').innerText = getTime(data.city.sunrise);
    $('sunset').innerText = getTime(data.city.sunset);
    $('humidity').innerText = data.list[0].main.humidity + "%";
    $('pressure').innerText = data.list[0].main.pressure + " hPa";
    $('wind').innerText = data.list[0].wind.speed + " m/s";
    $('level').innerText = data.list[0].main.grnd_level + " hPa";
    $('visiblity').innerText = data.list[0].visibility + " m";

    // Update forecast

    const forecastTiles = $('forecastContainer').children;
    for (let i = 0; i < 5; i++) {
        forecastTiles[i].children[0].src = `icons/${data.list[i * 8].weather[0].icon}.svg`;
        forecastTiles[i].children[1].innerHTML = weekday[(D.getDay() + i) % 7];
        forecastTiles[i].children[2].innerHTML = Math.round(data.list[i * 8].main.temp) + "&#8451;";
    }

}

function changeLocation(event) {
    event.preventDefault();
    const cityName = $("locationInput").value;
    getForecast(cityName);
}
window.onload = () => {
    getForecast('Srinagar');
    $("form").addEventListener('submit', changeLocation);
}


function scrollForecast(right) {
    const scrollContainer = $('forecastContainer');
    if (right) {

        scrollContainer.scrollTo(scrollContainer.scrollLeft + 50, 0)
        scrollContainer.scrollIntoView({ behavior: 'smooth' });
    }
    else {
        // if(scrollContainer.scrollLeft=0) return;
        scrollContainer.scrollTo(scrollContainer.scrollLeft - 50, 0)
    }
}