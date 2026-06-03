# AeroNav | Interactive Navigation Menu (PRODIGY_WD_01)

A premium interactive navigation menu with a multi-section landing page featuring dynamic scroll-based styling, smooth pseudo-element hover effects, active section indicators (Scrollspy), and a mobile-responsive sliding drawer menu.

Developed as **Task 01** of the **Web Development Internship** at **Prodigy InfoTech**.

## 🌟 Features

- **Fixed Position Header**: The navigation menu stays locked at the top of the viewport for constant accessibility.
- **Scroll-Based transitions**: The header transitions from fully transparent with no borders to a frosted glass background (`backdrop-filter`) with shadows and borders when scrolling past 50px.
- **Micro-Animated Hover Effects**: Links animate a gradient underline expanding from the center outwards on hover.
- **IntersectionObserver Scrollspy**: Automatically tracks scrolling sections (Home, Services, Portfolio, About, Contact) and highlights the corresponding nav link dynamically without custom scroll-math lags.
- **Hamburger Drawer Menu**: A custom mobile hamburger button that transforms into an "X" shape and slides in a full-height glassmorphic navbar menu drawer.

---

## 🛠️ Built With

- **HTML5**: Semantic web structure.
- **CSS3**: Layout flexbox/grids, keyframes, transitions, mobile drawer styling, and Google Fonts.
- **JavaScript**: Window scroll event detection, mobile drawer toggles, and IntersectionObserver API.

---

## 📂 Repository Structure

```text
navigation-menu/
├── index.html       # Landing page structure and sections
├── style.css        # Premium navbar styling, hover lines, scrolled state, and mobile drawer
└── script.js        # Mobile toggles and scrollspy IntersectionObserver logic
```

---

## 🚀 How to Run

1. Clone or open the folder on your system.
2. Double-click the `index.html` file to run directly in your web browser.
3. Or serve it locally:
   ```bash
   python -m http.server 8080
   ```
   Open `http://localhost:8080/navigation-menu/` in your browser.
