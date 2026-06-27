# Vanilla Forge

A curated collection of vanilla JavaScript and TypeScript projects built with modern ES6+ features, design patterns, and browser APIs. No frameworks, no libraries — just pure HTML, CSS, JavaScript, and TypeScript.

## Features

- **Single Page Application** — Hash-based routing with Home, About, and Projects pages
- **Interactive Demos** — Each project includes a live, runnable demo
- **Responsive Design** — Layout adapts seamlessly from desktop to mobile
- **Soothing Light Theme** — Clean, eye-friendly color palette with smooth transitions

## Projects

| # | Project | Concepts |
|---|---------|----------|
| 1 | **Calculator** | DOM Manipulation, Event Handling, Array Methods, CSS Grid |
| 2 | **Image Carousel** | DOM Manipulation, Event Handling, Timers, Debounce, Infinite Scroll |
| 3 | **Toast Notification** | DOM Manipulation, CSS Animations, Event Handling, requestAnimationFrame |
| 4 | **Two-Way Data Binding** | Proxies, Data Binding, Custom Events, Observer Pattern |
| 5 | **Stopwatch** | Timers, requestAnimationFrame, State Management, Event Handling |
| 6 | **Countdown Timer** | Timers, Form Handling, DOM Manipulation, User Input Validation |
| 7 | **Guess the Word** | Game Logic, DOM Manipulation, Event Handling, Randomization |
| 8 | **Rock Paper Scissors** | Game Logic, Randomization, DOM Manipulation, Event Handling |
| 9 | **HTTP Client with Interceptors** | Fetch API, Interceptors, Retry Logic, AbortController, Error Handling |
| 10 | **Reactive State Manager** | Proxy, Reflect, State Management, Middleware, Observer Pattern, Derived State |

## Project Highlights

### HTTP Client (`http-client.js`)
A fetch-based HTTP client featuring:
- **Request/Response Interceptors** — Chainable middleware for modifying requests and responses
- **Automatic Retry** — Exponential backoff with random jitter for transient failures
- **Cancellation** — Built-in AbortController support for request cancellation
- **Timeout** — Configurable request timeout

### Reactive State Manager (`state-manager.js`)
A mini state management library inspired by Zustand/Redux:
- **Deep Reactive Proxy** — Nested state mutations are automatically intercepted using ES6 Proxy and Reflect
- **State Subscription** — Subscribe to changes with an unsubscribe callback
- **Derived Selectors** — Auto-recomputing computed values that only update when dependencies change
- **Middleware Chain** — Redux-style middleware for logging, analytics, or side effects

## Getting Started

### Prerequisites
- Node.js 16+
- npm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
vanilla-forge/
├── index.html              # SPA shell with all page sections
├── index.js                # App entry — routing, navigation, demo orchestration
├── styles/
│   └── main.css            # Custom layout and component styles
├── output.css              # Compiled Tailwind CSS utility classes
├── javascript-projects/    # Individual project implementations
│   ├── calculator.js
│   ├── carousel.js
│   ├── guess-word.js
│   ├── http-client.js      # Fetch wrapper with interceptors
│   ├── project-demos.js    # Demo HTML templates and initializers
│   ├── projects-data.js    # Project metadata and stats
│   ├── state-manager.js    # Reactive state management
│   ├── stopwatch.js
│   ├── timer.js
│   ├── toast.js
│   └── two-way-data-bind.js
├── utilities/              # Shared helpers and utilities
│   ├── dom-builder.js      # Programmatic DOM element creation
│   ├── helpers.js          # Debounce, scroll-to-top, template decorator
│   ├── images/             # Static images
│   └── mock-data/          # JSON data for carousel, accordion, calculator
└── tailwind.config.js
```

## Tech Stack

- **Vanilla JavaScript** (ES6+) — Classes, modules, Proxies, async/await, Fetch API
- **HTML5** — Semantic markup, responsive design
- **CSS3** — Flexbox, Grid, CSS Variables, transitions, backdrop-filter
- **Tailwind CSS** — Utility-first CSS framework (pre-compiled)
- **Vite** — Development server and build tool

## License

ISC
