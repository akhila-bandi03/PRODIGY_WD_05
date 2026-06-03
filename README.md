# Aero | Dynamic Weather Dashboard (PRODIGY_WD_05)

A premium, interactive weather dashboard application built using vanilla HTML, CSS (modern Glassmorphism/Neumorphism design principles), and asynchronous Javascript. It fetches real-time weather information, hourly forecasts, and 7-day outlooks using the Open-Meteo API.

This project was developed as **Task 05** of the **Web Development Internship** at **Prodigy InfoTech**.

## 🌟 Features

- **Real-Time Geocoding Search**: Automatically queries and fetches weather data for any city globally with custom autocomplete suggestions.
- **Smart Geolocation Detection**: Auto-detects the user's current location to render immediate local weather details, with a graceful default fallback (London, UK) in case of restrictions.
- **Dynamic Weather Themes**: The page's ambient styling, gradients, and animated overlays change dynamically based on the current weather condition:
  - **Sunny**: Warm golden rays and sky-blue gradient.
  - **Cloudy**: Subtle drifting animated 3D-like clouds.
  - **Rainy**: Interactive falling raindrops.
  - **Snowy**: Gentle drifting snowflakes.
- **Interactive Metrics Grid**: Includes key meteorological variables:
  - Wind Speed & Direction (compass-based conversion)
  - Relative Humidity (with visual fill gauge)
  - UV Index (with color-coded danger zone slider)
  - Precipitation Probability
  - Barometric Air Pressure
  - Visibility (with range classification)
- **Hourly Forecast**: Responsive horizontal scroll-snap timeline depicting weather conditions for the next 24 hours.
- **7-Day Forecast**: Clean breakdown of high and low temperatures for the upcoming week.
- **Unit Swapping (°C ⇄ °F)**: Effortless metric conversion that instantly translates temperature values across the entire dashboard and converts wind speed units (km/h vs. mph).
- **Responsive Layout**: Designed for mobile, tablet, and desktop viewing.

---

## 🛠️ Built With

- **Structure**: HTML5 (Semantic elements)
- **Styling**: Custom CSS3 variables, glassmorphic filters, keyframe animations, responsive grid & flexbox layouts.
- **Fonts**: *Plus Jakarta Sans* & *Outfit* (Google Fonts)
- **Icons**: FontAwesome 6.4.0
- **APIs**: Open-Meteo Weather API & Open-Meteo Geocoding API

---

## 📂 Repository Structure

```text
PRODIGY_WD_05/
├── index.html       # Application layout and HTML skeletal structure
├── style.css        # Premium design system, glassmorphism UI, and keyframe animations
├── script.js        # Core asynchronous application logic, API calls, and DOM manipulation
└── README.md        # Documentation and Project Overview
```

---

## 🚀 How to Run the Project

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/PRODIGY_WD_05.git
   ```
2. **Open index.html**:
   - Double-click on `index.html` to open it in your default web browser.
   - Alternatively, serve it locally using a development server (e.g. VS Code Live Server or python):
     ```bash
     python -m http.server 8080
     ```
     Then navigate to `http://localhost:8080` in your browser.

---

## 📸 Screenshots

### Sunny Weather (London Fallback)
![London Initial State](https://raw.githubusercontent.com/your-username/PRODIGY_WD_05/main/screenshot_london.png)

### Search & Suggestions UI
![Search Suggestions](https://raw.githubusercontent.com/your-username/PRODIGY_WD_05/main/screenshot_newyork.png)

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

---

*Done as part of the Prodigy InfoTech Web Development Internship program.*
