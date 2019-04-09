const getPickedWeather = () => {
    const input = document.querySelector('.input').value;
    const Url = `https://api.openweathermap.org/data/2.5/forecast?q=${input}&units=metric&APPID=0c3984878742697ffa63809549271e91`;
    getData(Url);
    toggleDisplay();
}
const getData = (Url) => {
    function handleErrors(response) {
        if (!response.ok) {
            // city.textContent = "Something goes wrong";
            throw Error(response.statusText);
        }
        return response;
    }
    fetch(Url)
        .then(handleErrors)
        .then(response => {
            return response.json();
        })
        .catch(error => {
            console.log(error);
        })
        .then(data => {
            if (!data) {
                city.textContent = "Correct your city";
                clearContent();
            } else {
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

            }
        })
}
const toggleDisplay = () => {
    document.querySelector('.input-wrapper').classList.toggle('active');
}

document.querySelector('.btn--submit').addEventListener('click', getPickedWeather);

document.querySelector('.btn--menu').addEventListener('click', toggleDisplay);