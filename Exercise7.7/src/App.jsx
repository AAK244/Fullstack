import { useState } from 'react';
import useCountry from './useCountry';

const App = () => {
  const [value, setValue] = useState('');
  const [search, setSearch] = useState('');
  const { country, error } = useCountry(search);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const onSearch = (event) => {
    event.preventDefault();
    setSearch(value);
  };

  return (
    <div>
      <form onSubmit={onSearch}>
        <input value={value} onChange={handleChange} placeholder="Search for a country..." />
        <button type="submit">find</button>
      </form>
      <div id="results">
        {error && <div>{error}</div>}
        {country && (
          <div>
            <h2>{country.name.common}</h2>
            <p>capital: {country.capital ? country.capital[0] : 'No capital'}</p>
            <p>area: {country.area}</p>
            <p>languages:</p>
            <ul>
              {country.languages ? Object.values(country.languages).map(language => (
                <li key={language}>{language}</li>
              )) : 'No languages available'}
            </ul>
            <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="100" />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
