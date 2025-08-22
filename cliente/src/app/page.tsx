"use client"

import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Image from "next/image";
import NavBar from "@/components/navbar";

//definimos los objetos en strings y numbers
interface WeatherData {
name: string

sys: {
  country: string
}

main: {
  temp: number,
  feels_like: number,
  humidity: number,
}

weather:{
  description: string,
  icon: string
}[]
}

// Imagenes de la Api y ApiKey de clima con la que trabajo
const API_KEY = 'c079d624b3b2abbd145fccdaa7aef7a6';
const ICON_BASE_URL = 'http://openweathermap.org/img/wn/';

// Creamos 3 estados: para el clima (weather), ciudades (cities), errores (error)
const Home: React.FC = () => {
  const [city, setCity] = React.useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = React.useState<string | null>('');  

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
      setError('The city was not found... ');
      setWeatherData(null);
    }
  };

return (
  <main className="bg-gray-100 bg-cover bg-center min-h-screen">
    <NavBar/>
  
    <div className="flex flex-col items-center p-5 min-h-screen">
    {/* Formulario donde el usuario busca la ciudad */}
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-center"
      >
     {/* Input para busqueda de la ciudad integrado con los diferentes eventos */}
        <div className="flex items-center">
          <input
            type="text"
            value={city}
            onChange={handleCityChange}
            placeholder="Search city..."
            className="border border-gray-300 p-2 rounded-lg"
          />
          <button 
            type="submit" 
            className="ml-2 bg-white text-white p-2 rounded-full cursor-pointer hover:bg-blue-950"
          >
            <Image
              src="/search.png"
              alt="Search"
              width={20}
              height={20}
            />
          </button>
        </div>

        {error && (
          <div className="text-red-500 mt-2">
            {error}
          </div>
        )}
      </form>
      
      {weatherData && (
        <div className="bg-white p-6 rounded-xl shadow-lg mt-8 text-center">
          <h2 className="text-2xl font-bold mb-2">{weatherData.name}, {weatherData.sys.country}</h2>
          <Image
            src={`${ICON_BASE_URL}${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
            width={100}
            height={100}
          />
          <p className="text-gray-700">Temperature: {weatherData.main.temp}°C</p>
          <p className="text-gray-700">Feels Like: {weatherData.main.feels_like}°C</p>
          <p className="text-gray-700">Humidity: {weatherData.main.humidity}%</p>
          <p className="text-gray-700">Condition: {weatherData.weather[0].description}</p>
        </div>
      )}
    </div>

    <footer className="bg-gray-950 p-4 text-white text-center">
      <p>&copy; 2025 Weather App. All rights reserved.</p>
    </footer>
  </main>
);
}

export default Home;
