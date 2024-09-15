import { useState, useEffect } from 'react';
import axios from 'axios';

const useCountry = (name) => {
  const [country, setCountry] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!name) return;

    const fetchCountryData = async () => {
      try {
        console.log('fetching country data...');
        const response = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
        setCountry(response.data[0]);
        setError(null);
      } catch (error) {
        setCountry(null);
        setError('not found...');
      }
    };

    fetchCountryData();
  }, [name]);

  return { country, error };
};

export default useCountry;
