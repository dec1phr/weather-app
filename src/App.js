import React, { useState } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState(0); // To track selected day for hourly forecast

  const fetchWeather = async () => {
    try {
      const API_KEY = "1e86bc7ff38146bc92f150541240412";
      const formattedCity = city.trim().replace(/\s+/g, '+'); // Handling spaces in city names

      // Fetch current weather, hourly, and multi-day forecast
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${formattedCity}&days=7&hour=24`
      );

      if (response.data.error) {
        setError(response.data.error.message);
        setWeatherData(null);
      } else {
        setWeatherData(response.data);
        setError("");
      }
    } catch (err) {
      console.error(err);
      setError("City not found. Please try again.");
      setWeatherData(null);
    }
  };

  const handleDayClick = (index) => {
    setSelectedDay(index); // Update selected day for hourly forecast navigation
  };

  return (
    <div className="App">
      <h1 className="title">Weather Monitoring App</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeather}>Search</button>
      </div>

      {error && <p className="error">{error}</p>}

      {weatherData && (
        <div className="weather-info">
          {/* Current weather */}
          <div className="current-weather">
            <h2>{weatherData.location.name}, {weatherData.location.country}</h2>
            <p>Temperature: {weatherData.current.temp_c}°C</p>
            <p>Condition: {weatherData.current.condition.text}</p>
            <img src={weatherData.current.condition.icon} alt="Weather icon" />
            <p>Humidity: {weatherData.current.humidity}%</p>
            <p>Wind Speed: {weatherData.current.wind_kph} km/h</p>
          </div>

          {/* Multi-day forecast */}
          <div className="multi-day-forecast">
            <h3>Upcoming Forecast</h3>
            <div className="days-container">
              {weatherData.forecast.forecastday.map((day, index) => (
                <div
                  className={`day-card ${selectedDay === index ? "active" : ""}`}
                  key={index}
                  onClick={() => handleDayClick(index)}
                >
                  <h4>{new Date(day.date).toLocaleDateString()}</h4>
                  <p>Max: {day.day.maxtemp_c}°C</p>
                  <p>Min: {day.day.mintemp_c}°C</p>
                  <img src={day.day.condition.icon} alt="Weather icon" />
                </div>
              ))}
            </div>
          </div>

          {/* Hourly forecast for the selected day */}
          <div className="hourly-forecast">
            <h3>Hourly Forecast for {new Date(weatherData.forecast.forecastday[selectedDay].date).toLocaleDateString()}</h3>
            <div className="hourly-scroll">
              {weatherData.forecast.forecastday[selectedDay].hour.map((hour, index) => (
                <div className="hourly-card" key={index}>
                  <h4>{hour.time.split(" ")[1]}</h4>
                  <img src={hour.condition.icon} alt="Weather icon" />
                  <p>{hour.temp_c}°C</p>
                  <p>{hour.condition.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
