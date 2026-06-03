# Chrono | Premium Stopwatch Web Application (PRODIGY_WD_02)

A high-accuracy digital stopwatch web application featuring a sleek glassmorphic UI, analog progress ring indicator, interactive controls, and dynamic lap-time logs showing differences between fastest and slowest laps.

Developed as **Task 02** of the **Web Development Internship** at **Prodigy InfoTech**.

## 🌟 Features

- **High-Precision Timing**: Employs the HTML5 high-resolution timer (`performance.now()`) to track elapsed milliseconds without browser-interval drifts.
- **Visual Progress Ring**: SVG circular stroke animation fills smoothly to represent the seconds cycle, glowing vibrantly when active.
- **Lap & Split Logger**: Record individual lap split intervals along with cumulative elapsed time.
- **Dynamic Highlights**: Automatically calculates and colors the fastest lap (green) and slowest lap (red) to visualize timing differences.
- **Frosted Glass UI**: Clean aesthetics utilizing gradient background layers, dark translucent panels, and micro-animated responsive controls.

---

## 🛠️ Built With

- **HTML5**: Structured semantic layout.
- **CSS3**: Variables, SVG stroke control, keyframe blinking animations, and responsive flexbox alignment.
- **JavaScript**: Time tracking math, high-accuracy loop intervals, list arrays, and conditional highlights.

---

## 📂 Repository structure

```text
stopwatch/
├── index.html       # Stopwatch UI markup
├── style.css        # Glassmorphic layout, circular timer, button states, and lap list
└── script.js        # Precision timer, pause/resume calculations, and lap logs
```

---

## 🚀 How to Run

1. Clone or open the folder on your system.
2. Double-click the `index.html` file to run directly in your web browser.
3. Or serve it locally:
   ```bash
   python -m http.server 8080
   ```
   Open `http://localhost:8080/stopwatch/` in your browser.
