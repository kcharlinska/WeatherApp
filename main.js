document.querySelector('.btn--submit').addEventListener('click', function (e) {
    e.preventDefault();
    const txt = document.querySelector('.input').value;
    $.getJSON('https://api.openweathermap.org/data/2.5/forecast?q=' + txt + '&units=metric&APPID=0c3984878742697ffa63809549271e91', (data) => {
        console.log(data);
    });
});

document.querySelector('.btn--menu').addEventListener('click', () => {
    document.querySelector('.input-wrapper').classList.toggle('active');
})