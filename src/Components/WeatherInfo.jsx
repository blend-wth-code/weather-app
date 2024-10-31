import React, { useMemo } from "react";
import moment from 'moment';

function WeatherInfo({ weatherIcon, data, isFahrenheitMode, degreeSymbol }) {
  const { clouds, main, weather } = data.list[0];

  function convertToFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
  }

  const formattedData = useMemo(() => {
    return {
      temp: Math.round(
        isFahrenheitMode ? convertToFahrenheit(main.temp) : main.temp
      ),
      feels_like: Math.round(
        isFahrenheitMode
          ? convertToFahrenheit(main.feels_like)
          : main.feels_like
      ),
      temp_min: Math.round(
        isFahrenheitMode ? convertToFahrenheit(main.temp_max) : main.temp_max
      ),
    };
  }, [
    isFahrenheitMode,
    main.feels_like,
    main.temp,
    main.temp_max,
  ]);

  return (
    <div className="details">
       <p className='time'>
                <span>{moment().format('dddd MMM YYYY')}</span>
                <p className='celsius'>
                {formattedData.temp}
                {degreeSymbol}
            </p>
            </p>
     
            <div className='cloud-icon'>
                {weather[0].main}
                <img src={weatherIcon} className='' alt='' />
            </div>
            <p className='clouds des'>
                <span>{weather[0].description}</span>
            </p>
           
            <div className="more-info">
      <p className="">
        {"Feels Like: "}
        <span>
          {formattedData.feels_like}
          {degreeSymbol}
        </span>
      </p>
      <p className="">
        {"Humidity"}: <span>{main.humidity}%</span>
      </p>
      <p className="">
        {"Cover"}: <span>{clouds.all}%</span>
      </p>
      <p className="">
        {"Min Temp: "}
        <span>
          {formattedData.temp_min}
          {degreeSymbol}
        </span>
      </p>
      <p className="">
        {"Max Temp: "}
        <span>
          {formattedData.temp_max}
          {degreeSymbol}
        </span>
      </p>
    </div>
    </div>
  );
}

export default WeatherInfo;