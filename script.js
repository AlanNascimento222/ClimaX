const searchForm = document.querySelector('#searchForm')
const cityInput = document.querySelector('#city_name')
const weatherContainer = document.querySelector('#weatherContainer')
const alertBox = document.querySelector('#alert')

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
            return showAlert(
                json.cod == 404
                    ? 'Cidade não encontrada.'
                    : 'Não foi possível concluir a ação.'
            )
        }

        const dailyRange = await getDailyRange(json.coord.lat, json.coord.lon)

        showJsonInfos({
            city: json.name,
            country: json.sys.country,
            temp: json.main.temp,
            tempMax: dailyRange ? dailyRange.max : json.main.temp_max,
            tempMin: dailyRange ? dailyRange.min : json.main.temp_min,
            windSpeed: json.wind.speed * 3.6, // a API devolve m/s; a tela mostra km/h
            humidity: json.main.humidity,
            weatherIcon: json.weather[0].icon,
            description: json.weather[0].description
        })
    } catch (error) {
        showAlert('Falha na conexão. Tente novamente.')
    }
})

// A API de clima atual devolve temp_min/temp_max como uma faixa de ~1°C do
// momento da leitura, não os extremos do dia. Aqui pegamos o extremo real.
async function getDailyRange(lat, lon) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
        const response = await fetch(url)
        const data = await response.json()
        const max = data.daily?.temperature_2m_max?.[0]
        const min = data.daily?.temperature_2m_min?.[0]

        if (typeof max !== 'number' || typeof min !== 'number') return null

        return { max, min }
    } catch (error) {
        return null
    }
}

function showAlert(msg) {
    alertBox.textContent = msg
    alertBox.classList.remove('is-error')

    if (!msg) return

    // força o navegador a reiniciar a animação mesmo com a mesma mensagem
    void alertBox.offsetWidth
    alertBox.classList.add('is-error')
}

function showJsonInfos(json) {
    showAlert('')

    document.querySelector('#cityName').textContent = `${json.city}, ${json.country}`
    document.querySelector('#currentTemp').textContent = `${json.temp.toFixed(0)}°C`
    document.querySelector('#weatherDescription').textContent = `${json.description}`
    document.querySelector('#maxTempDesc').textContent = `${json.tempMax.toFixed(0)}°C`
    document.querySelector('#minTempDesc').textContent = `${json.tempMin.toFixed(0)}°C`
    document.querySelector('#windSpeedDesc').textContent = `${json.windSpeed.toFixed(0)}km/h`
    document.querySelector('#humidityDesc').textContent = `${json.humidity}%`
    document.querySelector('#weatherIcon').setAttribute('src', `https://openweathermap.org/img/wn/${json.weatherIcon}@2x.png`)

    // reinicia a animação de entrada em toda busca concluída
    weatherContainer.classList.remove('show')
    void weatherContainer.offsetWidth
    weatherContainer.classList.add('show')
}

// refazer com o Open Meteo
// geocoding pra requisitar
// fazer conta na vercel
