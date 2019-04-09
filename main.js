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
                console.log(data)
            }
        })
}
const toggleDisplay = () => {
    document.querySelector('.input-wrapper').classList.toggle('active');
}

document.querySelector('.btn--submit').addEventListener('click', getPickedWeather);

document.querySelector('.btn--menu').addEventListener('click', toggleDisplay);