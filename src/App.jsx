// GeolocationComponent.jsx
import React, { useState, useEffect } from 'react';

function GeolocationComponent() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [address, setAddress] = useState('Fetching location...');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });

          try {
            const apiKey = 'YOUR_REAL_OPENCAGE_API_KEY'; // Replace with your real OpenCage API key
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
              setAddress(data.results[0].formatted);
            } else {
              setAddress('Unable to fetch address');
            }
          } catch (error) {
            console.error('Reverse geocoding failed:', error);
            setAddress('Error fetching address');
          }
        },
        (error) => {
          console.error('Location error:', error);
          setAddress('Permission denied or unavailable');
        }
      );
    } else {
      setAddress('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <div>
      <label className="font-semibold">Location</label>
      <div className="p-2 mt-1 rounded bg-green-100 text-green-900">
        📍 {address}
      </div>
    </div>
  );
}

export default GeolocationComponent;
