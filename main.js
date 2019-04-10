const btnMenu = document.querySelector('.btn__menu--disp');
const input = document.querySelector('.input');
const menuWrapper = document.querySelector('.input-wrapper');
const city = document.querySelector('.curr-weather__city');
const temp = document.querySelector('.curr-weather__temp');
const icon = document.querySelector('.curr-weather i');

const getUserWeather = () => {
    const success = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const Url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&APPID=0c3984878742697ffa63809549271e91`;
        getData(Url);
    }
    const error = () => {
        city.textContent = 'Unable to retrieve your location';
    }
    //Check if browser supports W3C Geolocation API
    if (!navigator.geolocation) {
        city.textContent = 'Geolocation is not supported by your browser';
    } else {
        city.textContent = 'Locating…';
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

const getPickedWeather = () => {
    if (input.value) {
        const Url = `https://api.openweathermap.org/data/2.5/forecast?q=${input.value}&units=metric&APPID=0c3984878742697ffa63809549271e91`;
        getData(Url);
        toggleDisplay();
    } else input.focus();
}

const getData = (Url) => {
    fetch(Url)
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                return Promise.reject({
                    status: response.status,
                    statusText: response.statusText
                })
            }
        })
        .then(data => {
            // Display city
            document.querySelector('.curr-weather__city').textContent = data.city.name;

            // Create array with all needed data
            const weatherData = [];
            const dayNames = [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ];
            data.list.forEach(item => {
                weatherData.push({
                    date: item.dt_txt,
                    time: item.sys.pod,
                    day: dayNames[new Date(item.dt_txt).getDay()],
                    temp: item.main.temp,
                    icon: item.weather[0].id,
                    description: item.weather[0].main
                })
            })
            console.log(weatherData);

            // Display current weather data
            // Display current temperature
            const currTemp = Math.floor(weatherData[0].temp);
            document.querySelector('.curr-weather__temp').textContent = `${currTemp} °C`;
            // Display current weather icon
            const timeOfDay = (weatherData[0].time === 'd') ? 'day' : 'night';
            const icon = document.querySelector('.curr-weather i');
            icon.className = `wi-owm-${timeOfDay}-${weatherData[0].icon}`;
            icon.classList.add('wi');
            // Get forecast data
            const getForecastData = (item) => {
                return (item.day !== weatherData[0].day);
            }
            const forecastData = weatherData.filter(getForecastData);
            console.log(forecastData);

            // Get forecast by day with max temperature
            const forecastByDay = []
            const getForecastDay = (dayData) => {
                console.log(dayData);
                const forecastDayMax = dayData.reduce(function (prev, curr) {
                    return (prev.temp >= curr.temp) ? prev : curr;
                })
                console.log(forecastDayMax);
                forecastByDay.push(forecastDayMax);
            }
            for (let i = 0; i < forecastData.length; i += 8) {
                let j = i + 8;
                getForecastDay(forecastData.slice(i, j));
            }
            console.log(forecastByDay);

            // Display forecast
            for (let i = 0; i < 3; i++) {
                document.querySelector(`.day${i} .forecast__day`).textContent = forecastByDay[i].day;
                document.querySelector(`.day${i} .forecast__temp`).textContent = `${Math.floor(forecastByDay[i].temp)} °C`;
                document.querySelector(`.day${i} .forecast__desc`).textContent = forecastByDay[i].description;
            }
        })
        .catch(error => {
            if (error.status === 404) {
                city.textContent = "City not found";
                clearContent();
            }
        })
}

let active = true;
const toggleDisplay = () => {
    btnMenu.classList.toggle('active');
    menuWrapper.classList.toggle('active');
    if (active) {
        setTimeout(() => {
            input.focus();
        }, 500);
        input.value = '';
    }
    active = !active;
}

const clearContent = () => {
    icon.classList = '';
    temp.textContent = '';
    for (let i = 0; i < 3; i++) {
        document.querySelector(`.day${i} .forecast__day`).textContent = '';
        document.querySelector(`.day${i} .forecast__temp`).textContent = '';
        document.querySelector(`.day${i} .forecast__desc`).textContent = '';
    }
}

btnMenu.addEventListener('click', toggleDisplay);

// Actions to show weather by geolocation
document.addEventListener('DOMContentLoaded', getUserWeather);
document.querySelector('.btn__menu--geo').addEventListener('click', () => {
    getUserWeather();
    if (menuWrapper.classList.contains('active')) toggleDisplay();
});

// Actions to show weather by picked city
document.querySelector('.btn__submit').addEventListener('click', getPickedWeather);
menuWrapper.addEventListener('keypress', (e) => {
    if ((e.keyCode == 13) && (!!input.value) && (menuWrapper.classList.contains('active'))) {
        getPickedWeather();
    }
});