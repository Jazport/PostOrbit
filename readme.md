# PostOrbit

**PostOrbit** is a futuristic movie & TV show discovery web app that lets users search for films and series, view detailed information, and explore similar content — all powered by **The Movie Database (TMDB) API**.

Users can seamlessly navigate through similar movies and TV shows inside a modal with smooth left/right scrolling and dynamic content loading.

---

## Features

* Search **movies and TV shows**
* View detailed info in a modal (poster, rating, overview, release date)
* Discover **similar movies & TV shows**
* Scroll through similar content with navigation buttons
* Click similar items to load more details (no page refresh)
* Futuristic UI with animated loader and glassmorphism effects
* Responsive design (mobile-friendly)

---

## Tech Stack

### Frontend

* HTML5
* CSS3 (Glassmorphism + animations)
* Vanilla JavaScript

### Backend

* Node.js
* Express.js
* Axios

### API

* [The Movie Database (TMDB)](https://www.themoviedb.org/documentation/api)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/postorbit.git
cd postorbit
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your TMDB API key

In both:

* `utils/utils.js`
* `server.js`

Replace:

```js
const TMDB_API_KEY = 'YOUR_API_KEY_HERE';
```

You can get a free API key from:
[https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

Or visit the hosted site: https://postorbit.onrender.com/

---

### 4. Run the app

```bash
node server.js
```

Then open:

```
http://localhost:3000
```

---

## How It Works

1. User searches for a movie or TV show
2. App fetches results from TMDB
3. Clicking a card opens a modal with full details
4. Similar movies & TV shows load dynamically
5. Navigation buttons scroll through similar content
6. Clicking a similar item loads new info in the same modal

---

## UI Highlights

* Glassmorphism modal design
* Animated UFO loading screen
* Neon sci-fi color palette
* Smooth hover & click animations
* Fixed starry background for depth

---

## Future Improvements

* Favorites Watchlist
* User authentication
* Trailers via YouTube API
* Light / Dark mode toggle
* Infinite carousel scrolling

---

## Credits

* Movie data provided by **TMDB**
* Background image from **Unsplash**
* Designed & developed by **Jazlyn Portillo**
