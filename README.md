# Movie Watchlist

A simple, modern web application to search for movies and manage your personal watchlist.

---

> **Live site:** [https://movie-watchlist-achigyus.netlify.app/](https://movie-watchlist-achigyus.netlify.app/)

---

## 📸 Screenshot

![Movie Watchlist Screenshot](/screenshot.png)

---


## 🚀 Features

- **Search for Movies:** Instantly search for movies using the OMDB API.
- **Add to Watchlist:** Save your favorite movies to a persistent watchlist (stored in your browser).
- **Remove from Watchlist:** Easily remove movies from your watchlist.
- **Responsive Design:** Looks great on desktop and mobile.
- **Dark & Light Mode:** Automatically adapts to your system theme.
- **Accessible:** Keyboard focus styles and semantic HTML for better accessibility.

---

## 🛠️ How It Was Built

- **Frontend:** HTML5, CSS3 (with [Tailwind CSS](https://tailwindcss.com/)), and vanilla JavaScript (ES6 modules).
- **API:** [OMDB API](https://www.omdbapi.com/) for movie data.
- **Persistence:** Uses `localStorage` to save your watchlist.
- **Tooling:** Designed for easy integration with modern build tools (like Vite).

---

## 💻 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/movie-watchlist.git
cd movie-watchlist
```

### 2. Install Dependencies

If you use a build tool (like Vite), install dependencies:

```bash
npm install
```

### 3. Set Up OMDB API Key

1. [Get a free OMDB API key](https://www.omdbapi.com/apikey.aspx).
2. Create a `.env` file in the project root and add:

    ```
    VITE_OMDB_API_KEY=your_api_key_here
    ```

### 4. Run Locally

If using Vite or similar:

```bash
npm run dev
```

Or simply open `index.html` in your browser for basic usage.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

Please follow the existing code style and add tests or documentation where appropriate.

---

## 📄 License

MIT License

---

**Made with ❤️ for movie lovers.**