const apiKey = 'feb1ff444bc80722f2be90ae3228b585';
const getWeatherBtn = document.getElementById('getWeather');
const currentWeatherDiv = document.getElementById('currentWeather');
const forecastDiv = document.getElementById('forecast');

getWeatherBtn.addEventListener('click', () =>
{
    const city = document.getElementById('city').value;

    if (!city)
    {
        alert('Proszę wprowadzić nazwę miasta');
        return;
    }

    fetchCurrentWeather(city);
    fetchForecast(city);
});

function fetchCurrentWeather(city)
{
    const xmlhr = new XMLHttpRequest();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

    xmlhr.open('GET', url, true);
    xmlhr.onload = function ()
    {
        if (xmlhr.status === 200)
        {
            const data = JSON.parse(xmlhr.responseText);
            displayCurrentWeather(data);
        }
        else
        {
            currentWeatherDiv.innerHTML = 'Błąd w pobieraniu danych pogodowych';
        }
    };
    xmlhr.send();
}

function displayCurrentWeather(data)
{
    console.log(data);
    currentWeatherDiv.innerHTML = `
        <h2>Aktualna pogoda w ${data.name}</h2>
        <p>Temperatura: ${data.main.temp}°C</p>
        <p>Warunki: ${data.weather[0].description}</p>
    `;
}

function fetchForecast(city)
{
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

    fetch(url)
        .then(response =>
        {
            if (!response.ok)
            {
                throw new Error('Błąd w pobieraniu prognozy');
            }
            return response.json();
        })
        .then(data =>
        {
            console.log(data);
            displayForecast(data);
        })
        .catch(error =>
        {
            forecastDiv.innerHTML = 'Błąd w pobieraniu prognozy';
            console.error(error);
        });
}

function displayForecast(data)
{
    let forecastHTML = '<h2>Prognoza na 5 dni</h2>';
    data.list.forEach(item =>
    {
        forecastHTML += `
            <div class="weather">
                <p><strong>${item.dt_txt}</strong></p>
                <p>Temperatura: ${item.main.temp}°C</p>
                <p>Warunki: ${item.weather[0].description}</p>
            </div>
        `;
    });
    forecastDiv.innerHTML = forecastHTML;
}