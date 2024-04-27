import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import './home.css';


interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

const API_KEY = 'c079d624b3b2abbd145fccdaa7aef7a6';
const ICON_BASE_URL = 'http://openweathermap.org/img/wn/';

const Home: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState<string>('');
 const [error, setError] = useState<string | null>('');

  const handleCityChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (city.trim() !== '') {
        const response = await axios.get<WeatherData>(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        setWeatherData(response.data);
        setError(null);
      }
    } catch (error) {
      setError('Oops city not found... ');
      setWeatherData(null);
    }
  };

  return (
     <div className='background'>
      <div className="home-container">

        <form onSubmit={handleSubmit} className="form-container">
          <input 
            type="text" 
            value={city} 
            onChange={handleCityChange} 
            placeholder="search the city..." 
            className="input-field"
          />
          <button type="submit" className="submit-button">
            <img src="https://icones.pro/wp-content/uploads/2021/06/icone-loupe-noir.png" alt="Enviar" className="submit-icon" />
          </button>
        </form>
        {error &&(
          <div>
            <img src='https://cdni.iconscout.com/illustration/premium/thumb/location-finding-error-2748723-2289757.png?f=webp' alt='not found' className='error-image'/>
             <p>{error}</p>
             <p>please search again </p>          
          </div>
        )

        }
        {weatherData && (
          <div className="dataStyle">
            <h2>{weatherData.name}, {weatherData.sys.country}</h2>
            <div className="line"></div>
            
            <img
              src={`${ICON_BASE_URL}${weatherData.weather[0].icon}@2x.png`}
              alt="Icono del clima"
              className='weather-icon'
            />
            
            <div className="data-row">
              <div className="data-column">
                <p>{weatherData.main.temp} °C</p>
                <p>{weatherData.weather[0].description}</p>
              </div>
              <div className="data-column">
                <p>Humidity: {weatherData.main.humidity}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
