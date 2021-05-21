import axios from 'axios';
import React, { useState, useEffect } from 'react';


const Countries = ({ countriesToDisplay, toggleDisplayMode, weather }) => {
  let singleView = countriesToDisplay.length === 1 ? true : false;

  return (
    countriesToDisplay.map(country =>
      <Country key={country.name}
        country={country}
        toggleDisplayMode={toggleDisplayMode}
        weather={weather}
        singleView={singleView}
      />
    )
  );
};


const Country = ({ country, toggleDisplayMode, weather, singleView }) => {

  if (country.displayMode === "tiled") {
    // Tiled display
    return (
      <>
        <p>
          {country.name}
          <button onClick={() => toggleDisplayMode(country.name)}>show</button>
        </p>
      </>
    );
  }
  else {
    // Expanded display
    
    const temperature = weather ? weather.current.temperature : "loading";
    const windSpeed = weather ? weather.current.wind_speed : "loading";
    const windDirection = weather ? weather.current.wind_dir : "loading";
    const current_weather_icon = weather ? weather.current.weather_icons : "";
    const weatherType = weather
      ? weather.current.weather_descriptions
      : "current weather icon";

    return (
      <>
        <h2>{country.name}</h2>
        <p>
          capital {country.capital}
          <br />
          population {country.population}
        </p>

        <h2>languages</h2>
        <ul>
          {
            country.languages.map(language =>
              <li key={language.name}>{language.name}</li>
            )
          }
        </ul>
        <img src={country.flag} height="75" width="100"
          alt={`flag of ${country.name}`} />

        {
          (() => {
            if (singleView && weather) {
              // Displays current weather condition for only one country
              return (
                <>
                  <h2>Weather in {country.capital}</h2>
                  <p>
                    <b>temperature: </b>{temperature} Celcius
                    <br />
                    <img
                      src={current_weather_icon}
                      alt={weatherType.toString().toLowerCase()}
                    />
                    <br />
                    <b>wind: </b>{windSpeed} mph direction {windDirection}
                  </p>
                </>
              );
            }
            else if (!singleView) {
              return (
                <>
                  <br />
                  <button onClick={() => toggleDisplayMode(country.name)}>
                    hide
                  </button>
                </>
              )
            }
          })() // Automatically invoked anonymous function  
        }
      </>
    );
  }
};


const Display = (props) => {
  const countryFilterLength = props.countryFilter.length;
  const countriesToDisplayLength = props.countriesToDisplay.length;

  // Render content based on the number of countries to be displayed  
  if (countryFilterLength === 0 && countriesToDisplayLength === 0) {
    return (<p>Enter a country filter</p>);
  }
  else if (countryFilterLength > 0 && countriesToDisplayLength === 0) {
    return (<p>Results not found, specify another filter</p>);
  }
  else if (countriesToDisplayLength > 10) {
    return (<p>Too many matches, specify another filter</p>)
  }
  else {
    return (
      <div>
        <Countries
          countriesToDisplay={props.countriesToDisplay}
          toggleDisplayMode={props.toggleDisplayMode}
          weather={props.weather}
        />
      </div>
    )
  }
};


const App = () => {
  const [countryFilter, setCountryFilter] = useState("");
  const [countries, setCountries] = useState(null);
  const [countriesToDisplay, setcountriesToDisplay] = useState([]);
  const [weather, setWeather] = useState(null);

  const handleFilterChange = (e) => {
    setCountryFilter(e.target.value);
    setWeather(null);

    // Reset display mode to 'tiled' when country filter is cleared
    if (e.target.value === "") {
      let resetDisplayMode = countries.map(country => {
        if (country.displayMode === "expanded") {
          country.displayMode = "tiled";
        }
        return country;
      })
      setCountries(resetDisplayMode);
      setcountriesToDisplay([]); // Empty the list of countries to display

      return;
    }

    const filterFirstChar = e.target.value[0];
    const filterLastChar = e.target.value[e.target.value.length - 1];

    let actualFilter = e.target.value;
    if (filterFirstChar === '"' && filterLastChar === '"') {
      actualFilter = e.target.value.slice(1, -1); // Removes quotes from filter
    }

    // Extract all the countries that match the filter
    let filteredCountryList = (actualFilter === "")
      ? []
      : countries.filter(country =>
        country.name
          .toLowerCase()
          .includes(actualFilter.toLowerCase())
      );

    // Filters country which may be part of the name of an another country
    if ((filterFirstChar === '"' && filterLastChar === '"') || filteredCountryList.length === 1) {
      if (filteredCountryList.length !== 1) {
        filteredCountryList = filteredCountryList.filter(country =>
          country.name.toLowerCase()
            .includes(actualFilter.toLowerCase())
          && actualFilter.length === country.name.length
        );
      }

      filteredCountryList = filteredCountryList.map(country => {
        country.displayMode = "expanded";
        return country;
      });
    }

    if (filteredCountryList.length === 1) {
      handleWeatherData(filteredCountryList[0].capital);
    }

    setcountriesToDisplay(filteredCountryList);
  };


  // Toggle display modes between 'tiled' view and 'expanded' view
  const toggleDisplayMode = (countryToToggle) => {
    const changedDisplayModeList = countries.map(country => {
      const name = country.name;
      let displayMode = country.displayMode;

      if (name === countryToToggle && displayMode === "tiled") {
        country.displayMode = "expanded";
      }
      else if (name === countryToToggle && displayMode === "expanded") {
        country.displayMode = "tiled";
      }
      return country;
    })

    setCountries(changedDisplayModeList);
  }


  // Requests the weather data of a particular location
  const handleWeatherData = (capital) => {
    const baseURL = process.env.REACT_APP_WEATHERSTACK_API_BASE_URL;
    const API_KEY = process.env.REACT_APP_WEATHERSTACK_API_KEY;
    const query = capital;
    const URL = `${baseURL}?access_key=${API_KEY}&query=${query}`;

    axios.get(URL).then(response => {
      (response.data.success === true)
        ? setWeather(response.data)
        : setWeather(null)
    });
  }


  // Effect hook
  const effectHook = () => {
    axios.get("https://restcountries.eu/rest/v2/all")
      .then(countryDetails => {
        const countryDetailsArray = countryDetails.data.map(countryData => {
          countryData["displayMode"] = "tiled";

          return countryData;
        });
        setCountries(countryDetailsArray)
      })
      .catch(error => setCountries(404));
  }
  useEffect(effectHook, []);


  return (
    <div>
      {
        (() => {
          // Wait for the countries API to return a response before displaying
          if (!countries) { return; }
          if (countries === 404) { return "Unable to fetch data!" } // API error

          return (
            <>
              <label>
                find countries
              <input onChange={handleFilterChange} value={countryFilter} />
              </label>

              < Display
                countryFilter={countryFilter}
                countriesToDisplay={countriesToDisplay}
                toggleDisplayMode={toggleDisplayMode}
                weather={weather}
              />
            </>
          );
        })()
      }
    </div>
  );
};

export default App;
