import { useEffect, useMemo, useState } from "react";
import { RiCelsiusFill, RiFahrenheitFill } from "react-icons/ri";
import {
  TbMoon,
  TbSearch,
  TbSun,

} from "react-icons/tb";
import "./App.css";

import WeatherInfo from "./Components/WeatherInfo";
import {gsap} from 'gsap';

function App() {
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
  const [noData, setNoData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  gsap.fromTo('.logo',{opacity:0, x:-30 }, {opacity: 1 , x: 0 , duration: 2 })
  const [weatherIcon, setWeatherIcon] = useState(
    ``
  );
  
  const [loading, setLoading] = useState(false);
  const [isFahrenheitMode, setIsFahrenheitMode] = useState(false);
  const degreeSymbol = useMemo(
    () => (!isFahrenheitMode ? "\u00b0F" : "\u00b0C"),
    [isFahrenheitMode]
  );
  const [active, setActive] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // code logic
  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setIsDark(true);
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        setIsDark(event.matches);
      });
  }, [setIsDark]);

  const toggleDark = () => {
    setIsDark((prev) => !prev);
  };

  const activate = () => {
    setActive(true);
  };

  const toggleFahrenheit = () => {
    setIsFahrenheitMode(!isFahrenheitMode);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    getWeather(searchTerm);
  };

  const getWeather = async (location) => {
    setLoading(true);
    setWeatherData([]);
    let how_to_search =
      typeof location === "string"
        ? `q=${location}`
        : `lat=${location[0]}&lon=${location[1]}`;

    const url = "https://api.openweathermap.org/data/2.5/forecast?";
    try {
      let res = await fetch(
        `${url}${how_to_search}&appid=${API_KEY}&units=metric&cnt=5&exclude=hourly,minutely`
      );
      let data = await res.json();
      if (data.cod !== "200") {
        setNoData(true);
        setTimeout(() => {
          setLoading(false);
        }, 500);
        return;
      }
      setWeatherData(data);
      setTimeout(() => {
        setLoading(false);
      }, 500);
      setWeatherIcon(
        `${
          "https://openweathermap.org/img/wn/" + data.list[0].weather[0]["icon"]
        }@4x.png`
      );
    } catch (error) {
      setLoading(true);
      console.log(error);
    }
  };

  const handleSearchInput = (input) => {
    setSearchTerm(input);
  };

  return (
    <div className="container">
      <div className="content">
        <div className="form-container">
          <div className="name">
          <div className='logo'>Weather App</div>
            <div className="toggle-container">
              <input
                type="checkbox"
                className="checkbox"
                id="checkbox"
                checked={isDark}
                onChange={toggleDark}
              />
              <label htmlFor="checkbox" className="label">
                <TbMoon style={{ color: "#a6ddf0" }} />
                <TbSun style={{ color: "#f5c32c" }} />
                <div className="ball" />
              </label>
            </div>
          </div>

          <div className="search">
            <form className="search-bar" noValidate onSubmit={submitHandler}>
              <input
                onClick={activate}
                placeholder={active ? "" : "Explore cities weather"}
                onChange={(e) => handleSearchInput(e.target.value)}
                required
                className="input_search"
              />

              <button className="s-icon">
                <TbSearch
                  onClick={submitHandler}
                />
              </button>
            </form>
          </div>
        </div>
        <div className="info-container">
          <div className="info-inner-container">
            <div className="toggle-container">
              <input
                type="checkbox"
                className="checkbox"
                id="fahrenheit-checkbox"
                onChange={toggleFahrenheit}
              />
              <label htmlFor="fahrenheit-checkbox" className="label">
                <RiFahrenheitFill />
                <RiCelsiusFill />
                <div className="ball" />
              </label>
            </div>
          </div>
          {loading ? (
            <div className="loader"></div>
          ) : (
            <span>
              {weatherData.length === 0 ? (
                <div className="nodata">
                  {noData ? (
                      <p>Sorry, The searched city is not found.</p>
                  ) : (
                      <p style={{ padding: "20px" }}>
                        Try entering a city name in the search to know the weather.
                      </p>
                  )}
                </div>
              ) : (
                  <WeatherInfo
                  weatherIcon={weatherIcon}
                    data={weatherData}
                    isFahrenheitMode={isFahrenheitMode}
                    degreeSymbol={degreeSymbol}
                  />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
