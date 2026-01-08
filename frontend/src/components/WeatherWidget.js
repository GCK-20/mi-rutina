import { useEffect, useState } from 'react';

function WeatherWidget() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=19.43&longitude=-99.13&current_weather=true'
      );
      const data = await res.json();
      setWeather(data.current_weather);
    };
    fetchWeather();
  }, []);

  if (!weather) return <p>Cargando clima...</p>;

  return (
    <div className="weather-card">
      <h3>Clima actual</h3>
      <p>🌡️ Temperatura: {weather.temperature} °C</p>
      <p>💨 Viento: {weather.windspeed} km/h</p>
    </div>
  );
}

export default WeatherWidget;