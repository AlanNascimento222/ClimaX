const searchForm = document.querySelector('#searchForm')
const cityInput = document.querySelector('#city_name')
const weatherContainer = document.querySelector('#weatherContainer')

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const cityName = cityInput.value.trim()

    if (!cityName) {
        return showAlert('Digite uma cidade válida.')
    }

    const apiKey = "a0a859dd4a6cd9867c30e36f44331540"
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`

    try {
        const results = await fetch(apiUrl)
        const json = await results.json()

        if (json.cod != 200) {
            return showAlert('Não foi possível concluir a ação.')
        }

        showJsonInfos({
            city: json.name,
            country: json.sys.country,
            temp: json.main.temp,
            tempMax: json.main.temp_max,
            tempMin: json.main.temp_min,
            windSpeed: json.wind.speed,
            humidity: json.main.humidity,
            weatherIcon: json.weather[0].icon,
            description: json.weather[0].description
        })
    } catch (error) {
        showAlert('Falha na conexão. Tente novamente.')
    }
})

function showAlert(msg) {
    document.querySelector('#alert').textContent = msg
}

function showJsonInfos(json) {
    showAlert('')
    weatherContainer.classList.add('show')
    document.querySelector('#cityName').textContent = `${json.city}, ${json.country}`
    document.querySelector('#currentTemp').textContent = `${json.temp.toFixed(0)}°C`
    document.querySelector('#weatherDescription').textContent = `${json.description}`
    document.querySelector('#maxTempDesc').textContent = `${json.tempMax.toFixed(0)}°C`
    document.querySelector('#minTempDesc').textContent = `${json.tempMin.toFixed(0)}°C`
    document.querySelector('#windSpeedDesc').textContent = `${json.windSpeed.toFixed(0)}km/h`
    document.querySelector('#humidityDesc').textContent = `${json.humidity}%`
    document.querySelector('#weatherIcon').setAttribute('src', `https://openweathermap.org/img/wn/${json.weatherIcon}@2x.png`)
}

// refazer com o Open Meteo
// geocoding pra requisitar
// fazer conta na vercel
