import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import { WiDaySunny, WiCloud, WiSnow, WiDayCloudy, WiRain, WiNa, WiWindBeaufort0, WiThermometer, WiHumidity, WiRainWind } from 'react-icons/wi';
import { RingLoader } from 'react-spinners'; 

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const WeatherMap = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(); // Fetch data initially

    const interval = setInterval(() => {
      fetchData(); // Fetch data every 1 minute
    }, 60000); // 60000 milliseconds = 1 minute

    setTimeout(() => {
      setLoading(false); 
    }, 5000); 

    return () => clearInterval(interval); 
  }, []);

  const fetchData = () => {
    setLoading(true); 
    const token = localStorage.getItem('authToken');
    axios.get('http://localhost:3000/api/weatherData/current', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setWeatherData(response.data);
        console.log(response.data);
        setLoading(false); // Set loading to false after fetching data
      })
      .catch(error => {
        console.error('Failed to fetch weather data:', error);
        setLoading(false); // Set loading to false on error as well
      });
  };

  const getWeatherIcon = (temperature) => {
    // Weather icons based on temperature range
    if (temperature >= 0 && temperature < 10) {
      return <WiSnow size={30} className="text-gray-500" />; // Snow icon for very cold temperatures
    } else if (temperature >= 10 && temperature < 20) {
      return <WiRainWind size={30} className="text-blue-300" />; // Cloudy icon for cold to moderate temperatures
    } else if (temperature >= 20 && temperature < 30) {
      return <WiDayCloudy size={30} className="text-yellow-500" />; // Mostly sunny icon for warm temperatures
    } else if (temperature >= 30 && temperature <= 40) {
      return <WiDaySunny size={30} className="text-orange-500" />; // Sunny icon for hot temperatures
    } else {
      return <WiNa size={30} className="text-black" />; // Default icon
    }
  };

  return (
    <div>
      <h1 className="text-3xl text-center mb-6">Department of Meteorology Sri Lanka</h1>
      <div className="w-full h-screen">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <RingLoader color="#4A90E2" loading={loading} size={80} /> {/* Use RingLoader component for spinner */}
          </div>
        ) : (
          <MapContainer center={[6.9271, 79.8612]} zoom={7} className="w-full h-full">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {weatherData.map((station, index) => {
              if (station._id && station._id.coordinates) {
                // Determine weather condition based on temperature
                let weatherCondition;
                if (station.avgTemperature >= 30) {
                  weatherCondition = 'Sunny';
                } else if (station.avgTemperature >= 20 && station.avgTemperature < 30) {
                  weatherCondition = 'Mostly Sunny';
                } else if (station.avgTemperature >= 10 && station.avgTemperature < 20) {
                  weatherCondition = 'Cloudy';
                } else {
                  weatherCondition = 'Snowy';
                }

                return (
                  <Marker key={index} position={[station._id.coordinates[1], station._id.coordinates[0]]} icon={defaultIcon}>
                    <Popup>
                      <div>
                        <div className="mb-2 flex items-center justify-center">
                          <strong className="mr-2"> Weather Condition: {weatherCondition} </strong>
                          {getWeatherIcon(station.avgTemperature)}
                        </div>
                        <div className="mb-2">
                          <strong><WiThermometer size={20} color="orange" /> Temperature:</strong> {station.avgTemperature}°C
                        </div>
                        <div className="mb-2">
                          <strong><WiHumidity size={20} color="blue" /> Humidity:</strong> {station.avgHumidity}%
                        </div>
                        <div>
                          <strong><WiWindBeaufort0 size={20} color="gray" /> Air Pressure:</strong> {station.avgAirPressure} hPa
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              }
              return null;
            })}

          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default WeatherMap;
