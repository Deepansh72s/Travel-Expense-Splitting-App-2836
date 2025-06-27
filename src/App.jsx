// GeolocationComponent.jsx
import React, { useState, useEffect } from 'react';

function GeolocationComponent() {
  const [address, setAddress] = useState('Locating...');

  useEffect(() => {
    const fetchLocation = async (latitude, longitude) => {
      try {
        const apiKey = 'd954c8a4df8842f9b2910b51438f2f1d';
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
        );
        const data = await response.json();
        const result = data?.results?.[0]?.formatted;
        setAddress(result || 'Address not found');
      } catch (error) {
        console.error('Reverse geocoding error:', error);
        setAddress('Unable to fetch address');
      }
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchLocation(latitude, longitude);
        },
        (error) => {
          console.error('Location error:', error);
          setAddress('Location unavailable');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setAddress('Geolocation not supported');
    }
  }, []);

  return (
    <div>
      <label className="font-semibold">📍 Location</label>
      <div className="p-2 mt-1 rounded bg-green-100 text-green-900">
        {address}
      </div>
    </div>
  );
}

export default GeolocationComponent;
