document.addEventListener('DOMContentLoaded', () => {
    
    // --- State Variables ---
    let currentUnit = 'C'; // 'C' or 'F'
    let currentWeatherData = null;
    let selectedCityName = 'London';
    let selectedCountry = 'United Kingdom';
    let suggestionTimeout = null;

    // --- DOM Elements ---
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const suggestionsDropdown = document.getElementById('suggestions-dropdown');
    const geoBtn = document.getElementById('geo-btn');
    const unitCheckbox = document.getElementById('unit-checkbox');
    const errorPanel = document.getElementById('error-panel');
    const errorMessage = document.getElementById('error-message');
    const errorCloseBtn = document.getElementById('error-close-btn');
    const loadingOverlay = document.getElementById('loading-overlay');
    const dashboardContent = document.getElementById('dashboard-content');

    // Weather Display Elements
    const cityNameEl = document.getElementById('city-name');
    const currentDateEl = document.getElementById('current-date');
    const weatherDescBadge = document.getElementById('weather-description-badge');
    const currentTempEl = document.getElementById('current-temp');
    const tempDegreeSymbol = document.getElementById('temp-degree-symbol');
    const weatherMainIcon = document.getElementById('weather-main-icon');
    const feelsLikeTempEl = document.getElementById('feels-like-temp');
    const tempMaxEl = document.getElementById('temp-max');
    const tempMinEl = document.getElementById('temp-min');
    
    // Highlights Elements
    const windSpeedEl = document.getElementById('wind-speed');
    const windUnitEl = document.getElementById('wind-unit');
    const windDirEl = document.getElementById('wind-dir');
    const humidityValueEl = document.getElementById('humidity-value');
    const humidityGaugeFill = document.getElementById('humidity-gauge-fill');
    const humidityStatusEl = document.getElementById('humidity-status');
    const uvValueEl = document.getElementById('uv-value');
    const uvStatusEl = document.getElementById('uv-status');
    const uvAdviceEl = document.getElementById('uv-advice');
    const uvMarker = document.getElementById('uv-marker');
    const precipProbEl = document.getElementById('precip-prob');
    const pressureValueEl = document.getElementById('pressure-value');
    const pressureStatusEl = document.getElementById('pressure-status');
    const visibilityValueEl = document.getElementById('visibility-value');
    const visibilityStatusEl = document.getElementById('visibility-status');

    // Forecast Lists
    const hourlyScrollContainer = document.getElementById('hourly-scroll-container');
    const forecastListEl = document.getElementById('forecast-list');

    // Background Particle Elements
    const rainContainer = document.querySelector('.rain-container');
    const snowContainer = document.querySelector('.snow-container');


    // --- Weather Code Interpreter (WMO standard) ---
    const wmoWeatherCodes = {
        0: { desc: 'Clear Sky', icon: 'fa-sun', theme: 'sunny' },
        1: { desc: 'Mainly Clear', icon: 'fa-cloud-sun', theme: 'sunny' },
        2: { desc: 'Partly Cloudy', icon: 'fa-cloud-sun', theme: 'cloudy' },
        3: { desc: 'Overcast', icon: 'fa-cloud', theme: 'cloudy' },
        45: { desc: 'Foggy', icon: 'fa-smog', theme: 'cloudy' },
        48: { desc: 'Depositing Rime Fog', icon: 'fa-smog', theme: 'cloudy' },
        51: { desc: 'Light Drizzle', icon: 'fa-cloud-rain', theme: 'rainy' },
        53: { desc: 'Moderate Drizzle', icon: 'fa-cloud-rain', theme: 'rainy' },
        55: { desc: 'Heavy Drizzle', icon: 'fa-cloud-showers-heavy', theme: 'rainy' },
        56: { desc: 'Light Freezing Drizzle', icon: 'fa-cloud-meatball', theme: 'snowy' },
        57: { desc: 'Heavy Freezing Drizzle', icon: 'fa-cloud-meatball', theme: 'snowy' },
        61: { desc: 'Slight Rain', icon: 'fa-cloud-rain', theme: 'rainy' },
        63: { desc: 'Moderate Rain', icon: 'fa-cloud-showers-heavy', theme: 'rainy' },
        65: { desc: 'Heavy Rain', icon: 'fa-cloud-showers-heavy', theme: 'rainy' },
        66: { desc: 'Light Freezing Rain', icon: 'fa-cloud-meatball', theme: 'snowy' },
        67: { desc: 'Heavy Freezing Rain', icon: 'fa-cloud-meatball', theme: 'snowy' },
        71: { desc: 'Slight Snow Fall', icon: 'fa-snowflake', theme: 'snowy' },
        73: { desc: 'Moderate Snow Fall', icon: 'fa-snowflake', theme: 'snowy' },
        75: { desc: 'Heavy Snow Fall', icon: 'fa-snowflake', theme: 'snowy' },
        77: { desc: 'Snow Grains', icon: 'fa-snowflake', theme: 'snowy' },
        80: { desc: 'Slight Rain Showers', icon: 'fa-cloud-sun-rain', theme: 'rainy' },
        81: { desc: 'Moderate Rain Showers', icon: 'fa-cloud-showers-heavy', theme: 'rainy' },
        82: { desc: 'Violent Rain Showers', icon: 'fa-cloud-showers-heavy', theme: 'rainy' },
        85: { desc: 'Slight Snow Showers', icon: 'fa-snowflake', theme: 'snowy' },
        86: { desc: 'Heavy Snow Showers', icon: 'fa-snowflake', theme: 'snowy' },
        95: { desc: 'Thunderstorm', icon: 'fa-cloud-bolt', theme: 'rainy' },
        96: { desc: 'Thunderstorm with Slight Hail', icon: 'fa-cloud-bolt', theme: 'rainy' },
        99: { desc: 'Thunderstorm with Heavy Hail', icon: 'fa-cloud-bolt', theme: 'rainy' }
    };

    const interpretWeatherCode = (code) => {
        return wmoWeatherCodes[code] || { desc: 'Unknown Conditions', icon: 'fa-question', theme: 'sunny' };
    };


    // --- Geolocation Initiation ---
    const initGeolocation = () => {
        showLoading();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    selectedCityName = 'Current Location';
                    selectedCountry = '';
                    fetchWeatherData(lat, lon);
                },
                (error) => {
                    console.warn(`Geolocation error: ${error.message}. Falling back to default city.`);
                    // Fallback default city
                    fetchCoordinatesForCity('London');
                },
                { timeout: 6000 }
            );
        } else {
            console.warn('Geolocation is not supported by this browser. Falling back to default.');
            fetchCoordinatesForCity('London');
        }
    };


    // --- Fetch Coordinates from Open-Meteo Geocoding API ---
    const fetchCoordinatesForCity = async (cityName) => {
        showLoading();
        try {
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=5&language=en&format=json`);
            if (!response.ok) throw new Error('Geocoding service error');
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const primaryResult = data.results[0];
                selectedCityName = primaryResult.name;
                selectedCountry = primaryResult.country || '';
                fetchWeatherData(primaryResult.latitude, primaryResult.longitude);
            } else {
                hideLoading();
                showError(`City "${cityName}" not found. Please try another query.`);
            }
        } catch (err) {
            console.error(err);
            hideLoading();
            showError('Unable to connect to Geocoding server. Check your network.');
        }
    };


    // --- Fetch Weather Data from Open-Meteo API ---
    const fetchWeatherData = async (lat, lon) => {
        showLoading();
        hideError();
        try {
            const queryUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,uv_index,visibility&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
            const response = await fetch(queryUrl);
            if (!response.ok) throw new Error('Weather API service error');
            
            currentWeatherData = await response.json();
            renderWeatherDashboard();
            hideLoading();
        } catch (err) {
            console.error(err);
            hideLoading();
            showError('Could not fetch weather data. Please try again.');
        }
    };


    // --- Search Auto-suggestions ---
    const handleSuggestionsLookup = async (query) => {
        if (!query || query.trim().length < 2) {
            suggestionsDropdown.classList.remove('active');
            return;
        }

        try {
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
            if (!response.ok) return;
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                suggestionsDropdown.innerHTML = '';
                data.results.forEach(city => {
                    const item = document.createElement('div');
                    item.className = 'suggestion-item';
                    const countryText = city.country ? `, ${city.country}` : '';
                    const adminText = city.admin1 ? ` (${city.admin1})` : '';
                    item.innerHTML = `<strong>${city.name}</strong><span>${adminText}${countryText}</span>`;
                    
                    item.addEventListener('click', () => {
                        selectedCityName = city.name;
                        selectedCountry = city.country || '';
                        searchInput.value = `${city.name}${countryText}`;
                        suggestionsDropdown.classList.remove('active');
                        fetchWeatherData(city.latitude, city.longitude);
                    });
                    suggestionsDropdown.appendChild(item);
                });
                suggestionsDropdown.classList.add('active');
            } else {
                suggestionsDropdown.classList.remove('active');
            }
        } catch (err) {
            console.error('Suggestions fetch error:', err);
        }
    };


    // --- Unit Converter Helper ---
    const formatTemp = (celsiusVal) => {
        if (currentUnit === 'F') {
            return Math.round((celsiusVal * 9/5) + 32);
        }
        return Math.round(celsiusVal);
    };

    const formatWindSpeed = (speedKmh) => {
        if (currentUnit === 'F') {
            // Convert to mph
            return `${Math.round(speedKmh * 0.621371)} mph`;
        }
        return `${Math.round(speedKmh)} km/h`;
    };


    // --- UI Rendering ---
    const renderWeatherDashboard = () => {
        if (!currentWeatherData) return;
        
        const current = currentWeatherData.current;
        const daily = currentWeatherData.daily;
        const hourly = currentWeatherData.hourly;
        
        const weatherInfo = interpretWeatherCode(current.weather_code);

        // Update Background theme & animation overlay
        updateWeatherTheme(weatherInfo.theme);

        // Header Location & Date info
        cityNameEl.textContent = selectedCountry ? `${selectedCityName}, ${selectedCountry}` : selectedCityName;
        
        const dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };
        currentDateEl.textContent = new Date().toLocaleDateString('en-US', dateOptions);
        
        weatherDescBadge.textContent = weatherInfo.desc;

        // Current Temps
        currentTempEl.textContent = formatTemp(current.temperature_2m);
        tempDegreeSymbol.textContent = `°${currentUnit}`;
        feelsLikeTempEl.textContent = `${formatTemp(current.apparent_temperature)}°`;
        tempMaxEl.textContent = `${formatTemp(daily.temperature_2m_max[0])}°`;
        tempMinEl.textContent = `${formatTemp(daily.temperature_2m_min[0])}°`;

        // Weather Icon Animation setup
        weatherMainIcon.className = `fa-solid ${weatherInfo.icon} weather-icon-pulse`;

        // Highlights Card 1: Wind Status
        windSpeedEl.textContent = currentUnit === 'F' ? Math.round(current.wind_speed_10m * 0.621371) : Math.round(current.wind_speed_10m);
        windUnitEl.textContent = currentUnit === 'F' ? 'mph' : 'km/h';
        windDirEl.textContent = `Direction: ${getWindDirection(current.wind_direction_10m)} (${current.wind_direction_10m}°)`;

        // Highlights Card 2: Humidity Gauge & fill
        humidityValueEl.textContent = current.relative_humidity_2m;
        humidityGaugeFill.style.height = `${current.relative_humidity_2m}%`;
        humidityStatusEl.textContent = getHumidityStatus(current.relative_humidity_2m);

        // Highlights Card 3: UV Index slider bar position
        uvValueEl.textContent = current.uv_index.toFixed(1);
        const uvPerc = Math.min((current.uv_index / 12) * 100, 100);
        uvMarker.style.left = `${uvPerc}%`;
        const uvInfo = getUVStatus(current.uv_index);
        uvStatusEl.textContent = uvInfo.status;
        uvAdviceEl.textContent = uvInfo.advice;

        // Highlights Card 4: Precipitation Probability
        precipProbEl.textContent = daily.precipitation_probability_max[0];

        // Highlights Card 5: Air Pressure
        pressureValueEl.textContent = Math.round(current.pressure_msl);
        pressureStatusEl.textContent = getPressureStatus(current.pressure_msl);

        // Highlights Card 6: Visibility
        const visibilityKm = (current.visibility / 1000).toFixed(1);
        visibilityValueEl.textContent = visibilityKm;
        visibilityStatusEl.textContent = getVisibilityStatus(visibilityKm);

        // Render Hourly Scroll Cards (next 24 hours)
        renderHourlyForecast(hourly);

        // Render 7-Day Forecast Cards
        renderWeeklyForecast(daily);
    };

    const renderHourlyForecast = (hourly) => {
        hourlyScrollContainer.innerHTML = '';
        const now = new Date();
        const currentHour = now.getHours();

        // Display next 24 hourly increments
        for (let i = currentHour; i < currentHour + 24; i++) {
            const timeVal = new Date(hourly.time[i]);
            let displayTime = timeVal.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
            
            // Format current hour label
            if (i === currentHour) {
                displayTime = 'Now';
            }

            const codeInfo = interpretWeatherCode(hourly.weather_code[i]);
            
            const card = document.createElement('div');
            card.className = 'hourly-card';
            card.innerHTML = `
                <div class="hourly-time">${displayTime}</div>
                <div class="hourly-icon-box"><i class="fa-solid ${codeInfo.icon}"></i></div>
                <div class="hourly-temp">${formatTemp(hourly.temperature_2m[i])}°</div>
            `;
            hourlyScrollContainer.appendChild(card);
        }
    };

    const renderWeeklyForecast = (daily) => {
        forecastListEl.innerHTML = '';
        
        for (let i = 0; i < 7; i++) {
            const dateVal = new Date(daily.time[i]);
            
            let dayName = dateVal.toLocaleDateString('en-US', { weekday: 'long' });
            if (i === 0) dayName = 'Today';
            if (i === 1) dayName = 'Tomorrow';

            const codeInfo = interpretWeatherCode(daily.weather_code[i]);

            const row = document.createElement('div');
            row.className = 'forecast-row';
            row.innerHTML = `
                <span class="forecast-day">${dayName}</span>
                <span class="forecast-icon" title="${codeInfo.desc}"><i class="fa-solid ${codeInfo.icon}"></i></span>
                <div class="forecast-temps">
                    <span class="forecast-max">${formatTemp(daily.temperature_2m_max[i])}°</span>
                    <span class="forecast-min">${formatTemp(daily.temperature_2m_min[i])}°</span>
                </div>
            `;
            forecastListEl.appendChild(row);
        }
    };


    // --- Weather Theme Modifier & Animation Overlay Generators ---
    const updateWeatherTheme = (theme) => {
        // Clean current theme classes
        document.body.className = '';
        document.body.classList.add(`weather-${theme}`);

        // Empty ambient rain/snow nodes
        rainContainer.innerHTML = '';
        snowContainer.innerHTML = '';

        if (theme === 'rainy') {
            generateRainParticles();
        } else if (theme === 'snowy') {
            generateSnowParticles();
        }
    };

    const generateRainParticles = () => {
        const dropCount = 45;
        for (let i = 0; i < dropCount; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            drop.style.left = `${Math.random() * 100}%`;
            drop.style.animationDelay = `${Math.random() * 2}s`;
            drop.style.animationDuration = `${0.7 + Math.random() * 0.6}s`;
            rainContainer.appendChild(drop);
        }
    };

    const generateSnowParticles = () => {
        const flakesCount = 40;
        for (let i = 0; i < flakesCount; i++) {
            const flake = document.createElement('div');
            flake.className = 'snowflake';
            const size = 3 + Math.random() * 6;
            flake.style.width = `${size}px`;
            flake.style.height = `${size}px`;
            flake.style.left = `${Math.random() * 100}%`;
            flake.style.animationDelay = `${Math.random() * 4}s`;
            flake.style.animationDuration = `${3 + Math.random() * 3}s`;
            snowContainer.appendChild(flake);
        }
    };


    // --- Meteorological Utility Helper Routines ---
    const getWindDirection = (degree) => {
        const index = Math.round(((degree % 360) / 45));
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        return directions[index % 8];
    };

    const getHumidityStatus = (value) => {
        if (value < 30) return 'Dry Air';
        if (value > 65) return 'Sticky Air';
        return 'Comfortable';
    };

    const getUVStatus = (uv) => {
        if (uv <= 2) return { status: 'Low', advice: 'No protection needed' };
        if (uv <= 5) return { status: 'Moderate', advice: 'Wear sunscreen, sun hat' };
        if (uv <= 7) return { status: 'High', advice: 'Seek shade during midday' };
        if (uv <= 10) return { status: 'Very High', advice: 'Extra protection advised' };
        return { status: 'Extreme', advice: 'Avoid outdoor exposure' };
    };

    const getPressureStatus = (pressure) => {
        if (pressure < 1009) return 'Low Pressure';
        if (pressure > 1022) return 'High Pressure';
        return 'Standard';
    };

    const getVisibilityStatus = (visibilityKm) => {
        if (visibilityKm < 1) return 'Dense Fog';
        if (visibilityKm < 4) return 'Mist / Poor';
        if (visibilityKm < 10) return 'Hazy view';
        return 'Clear view';
    };


    // --- Event Listeners ---
    
    // City search text entry input changes
    searchInput.addEventListener('input', (e) => {
        const value = e.target.value;
        clearTimeout(suggestionTimeout);
        
        suggestionTimeout = setTimeout(() => {
            handleSuggestionsLookup(value);
        }, 300);
    });

    // Close recommendations panel if clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-form')) {
            suggestionsDropdown.classList.remove('active');
        }
    });

    // Search submit
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query.length > 0) {
            suggestionsDropdown.classList.remove('active');
            fetchCoordinatesForCity(query);
        }
    });

    // Geolocation trigger icon
    geoBtn.addEventListener('click', () => {
        searchInput.value = '';
        initGeolocation();
    });

    // Units toggle Celsius/Fahrenheit change
    unitCheckbox.addEventListener('change', (e) => {
        currentUnit = e.target.checked ? 'F' : 'C';
        renderWeatherDashboard();
    });

    // Error Alert Box Close
    errorCloseBtn.addEventListener('click', () => {
        hideError();
    });


    // --- Helper UI Loader Toggles ---
    function showLoading() {
        loadingOverlay.classList.add('active');
    }

    function hideLoading() {
        loadingOverlay.classList.remove('active');
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorPanel.classList.add('active');
        // Auto scroll to error on mobile
        errorPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideError() {
        errorPanel.classList.remove('active');
    }

    // --- On-load execution ---
    initGeolocation();
});
