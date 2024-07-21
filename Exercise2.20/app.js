const apiKey = 'I didnt want to share my API key';

document.getElementById('searchBox').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    if (query.length > 0) {
        fetch(`https://restcountries.com/v3.1/all`)
            .then(response => response.json())
            .then(data => {
                const filteredCountries = data.filter(country => country.name.common.toLowerCase().includes(query));
                displayResults(filteredCountries);
            });
    } else {
        document.getElementById('results').innerHTML = '';
    }
});

function displayResults(countries) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    if (countries.length > 10) {
        resultsDiv.innerHTML = 'Too many matches, specify another filter';
    } else if (countries.length > 1) {
        countries.forEach(country => {
            const countryDiv = document.createElement('div');
            countryDiv.textContent = country.name.common;

            const showButton = document.createElement('button');
            showButton.textContent = 'show';
            showButton.addEventListener('click', () => displayCountryDetails(country));

            countryDiv.appendChild(showButton);
            resultsDiv.appendChild(countryDiv);
        });
    } else if (countries.length === 1) {
        displayCountryDetails(countries[0]);
    }
}

function displayCountryDetails(country) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h2>${country.name.common}</h2>
        <p>capital: ${country.capital}</p>
        <p>area: ${country.area}</p>
        <p>languages:</p>
        <ul>
            ${Object.values(country.languages).map(language => `<li>${language}</li>`).join('')}
        </ul>
        <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="100">
    `;

    if (country.capital) {
        fetchWeatherData(country.capital);
    }
}

function fetchWeatherData(capital) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
        });
}

function displayWeatherData(data) {
    const weatherDiv = document.createElement('div');
    weatherDiv.innerHTML = `
        <h3>Weather in ${data.name}</h3>
        <p>temperature: ${data.main.temp} °C</p>
        <p>wind: ${data.wind.speed} m/s</p>
        <p>${data.weather[0].description}</p>
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather icon">
    `;
    document.getElementById('results').appendChild(weatherDiv);
}
