var weatherService = angular.module('WeatherService', []);

    weatherService.service('WeatherService', [function () {
        //'use strict';

        this.defaultZip = "14623";
        this.userCurrentZip = null;

        this.getCurrentZipCode = function () {
            if (this.userCurrentZip != null) {
                return this.userCurrentZip;
            } else {
                var temp = Cookies.get("userWeatherZip");
                if (temp != null && temp != "" && !isNaN(parseInt(temp, 10))) {
                    this.userCurrentZip = temp.toString();
                    return this.userCurrentZip;
                }
            }


            return this.defaultZip;
        };

        this.setUserDefaultZipCode = function (zip) {
            Cookies.set("userWeatherZip", zip.toString(), { expires: 200 });
            this.userCurrentZip = zip;
        };

        // http://openweathermap.org/current
        this.apiID = "fb9769e8739b7889d90188cbb3052c24";
        this.baseApiURL = "http://api.openweathermap.org/data/2.5/";

        this.getWeather = function (zip, callback) {
            if (zip == null) {
                zip == this.getCurrentZipCode();
            }

            var dayData = null;
            var forecastData = null;

            // try and read daily data from the cookie as a cache
            var tmp = Cookies.get("dailyData_" + zip);
            if (tmp != null && tmp != "") {
                dayData = JSON.parse(tmp);
            } else {
                if (useMockedBackEnd) {
                    setTimeout(function () {
                        dayData = { "coord": { "lon": -77.62, "lat": 43.15 }, "weather": [{ "id": 500, "main": "Rain", "description": "light rain", "icon": "10d" }, { "id": 701, "main": "Mist", "description": "mist", "icon": "50d" }], "base": "cmc stations", "main": { "temp": 277.08, "pressure": 1000, "humidity": 93, "temp_min": 276.95, "temp_max": 277.15 }, "wind": { "speed": 12.3, "deg": 280, "gust": 15.9 }, "rain": { "1h": 0.2 }, "clouds": { "all": 90 }, "dt": 1459200842, "sys": { "type": 1, "id": 2130, "message": 0.0093, "country": "US", "sunrise": 1459162620, "sunset": 1459208031 }, "id": 5134086, "name": "Rochester", "cod": 200 };
                        if (forecastData != null) {
                            weatherCallbackHelper(zip, dayData, forecastData, callback);
                        }
                    });
                } else {
                    $.ajax({
                        url: this.baseApiURL + "weather?zip=" + zip + ",us&appid=" + this.apiID,
                        cache: false,
                        crossDomain: true,
                        dataType: 'json',
                        method: 'GET',
                        success: function (result) {
                            dayData = result;

                            // Save the data in a cookie for 10 minutes to cache it
                            // expires in 10 minutes (1 day / 24 hours per day / 60 minutes per hour * 10 = 10 minutes
                            Cookies.set("dailyData_" + zip, dayData, { expires: (((1 / 24) / 60) * 10) });

                            if (forecastData != null) {
                                weatherCallbackHelper(zip, dayData, forecastData, callback);
                            }
                        },
                        error: function () {
                            dayData = { errorLoading: true };

                            if (forecastData != null) {
                                weatherCallbackHelper(zip, dayData, forecastData, callback);
                            }
                        }
                    });
                }
            }

            // try and read hourly data from the cookie as a cache
            tmp = null;
            tmp = Cookies.get("hourlyData_" + zip);
            if (tmp != null && tmp != "") {
                forecastData = JSON.parse(tmp);
            } else {
                if (useMockedBackEnd) {
                    setTimeout(function () {
                        forecastData = { "city": { "id": 5134086, "name": "Rochester", "coord": { "lon": -77.615562, "lat": 43.154781 }, "country": "US", "population": 0, "sys": { "population": 0 } }, "cod": "200", "message": 0.0091, "cnt": 12, "list": [{ "dt": 1459209600, "main": { "temp": 271.6, "temp_min": 271.6, "temp_max": 276.369, "pressure": 1000.86, "sea_level": 1017.32, "grnd_level": 1000.86, "humidity": 95, "temp_kf": -4.77 }, "weather": [{ "id": 500, "main": "Rain", "description": "light rain", "icon": "10n" }], "clouds": { "all": 92 }, "wind": { "speed": 11.11, "deg": 287.001 }, "rain": { "3h": 1.97 }, "sys": { "pod": "n" }, "dt_txt": "2016-03-29 00:00:00" }, { "dt": 1459220400, "main": { "temp": 271.12, "temp_min": 271.12, "temp_max": 275.617, "pressure": 1006.06, "sea_level": 1022.78, "grnd_level": 1006.06, "humidity": 95, "temp_kf": -4.5 }, "weather": [{ "id": 500, "main": "Rain", "description": "light rain", "icon": "10n" }], "clouds": { "all": 92 }, "wind": { "speed": 9.31, "deg": 299.006 }, "rain": { "3h": 2.43 }, "sys": { "pod": "n" }, "dt_txt": "2016-03-29 03:00:00" }, { "dt": 1459231200, "main": { "temp": 271.29, "temp_min": 271.29, "temp_max": 275.525, "pressure": 1009.2, "sea_level": 1026.01, "grnd_level": 1009.2, "humidity": 71, "temp_kf": -4.24 }, "weather": [{ "id": 500, "main": "Rain", "description": "light rain", "icon": "10n" }], "clouds": { "all": 64 }, "wind": { "speed": 7.5, "deg": 302.505 }, "rain": { "3h": 0.53 }, "sys": { "pod": "n" }, "dt_txt": "2016-03-29 06:00:00" }, { "dt": 1459242000, "main": { "temp": 269.86, "temp_min": 269.86, "temp_max": 273.827, "pressure": 1011.36, "sea_level": 1028.35, "grnd_level": 1011.36, "humidity": 66, "temp_kf": -3.97 }, "weather": [{ "id": 800, "main": "Clear", "description": "clear sky", "icon": "01n" }], "clouds": { "all": 0 }, "wind": { "speed": 6.96, "deg": 303.007 }, "rain": {}, "sys": { "pod": "n" }, "dt_txt": "2016-03-29 09:00:00" }, { "dt": 1459252800, "main": { "temp": 268.61, "temp_min": 268.61, "temp_max": 272.318, "pressure": 1014.64, "sea_level": 1031.67, "grnd_level": 1014.64, "humidity": 65, "temp_kf": -3.71 }, "weather": [{ "id": 800, "main": "Clear", "description": "clear sky", "icon": "01d" }], "clouds": { "all": 0 }, "wind": { "speed": 6.76, "deg": 311.501 }, "rain": {}, "sys": { "pod": "d" }, "dt_txt": "2016-03-29 12:00:00" }, { "dt": 1459263600, "main": { "temp": 269.82, "temp_min": 269.82, "temp_max": 273.262, "pressure": 1017.52, "sea_level": 1034.53, "grnd_level": 1017.52, "humidity": 56, "temp_kf": -3.44 }, "weather": [{ "id": 800, "main": "Clear", "description": "clear sky", "icon": "01d" }], "clouds": { "all": 0 }, "wind": { "speed": 6.57, "deg": 313.504 }, "rain": {}, "sys": { "pod": "d" }, "dt_txt": "2016-03-29 15:00:00" }, { "dt": 1459274400, "main": { "temp": 272.19, "temp_min": 272.19, "temp_max": 275.362, "pressure": 1018.44, "sea_level": 1035.4, "grnd_level": 1018.44, "humidity": 46, "temp_kf": -3.18 }, "weather": [{ "id": 800, "main": "Clear", "description": "clear sky", "icon": "01d" }], "clouds": { "all": 0 }, "wind": { "speed": 6.21, "deg": 308.501 }, "rain": {}, "sys": { "pod": "d" }, "dt_txt": "2016-03-29 18:00:00" }, { "dt": 1459285200, "main": { "temp": 274.21, "temp_min": 274.21, "temp_max": 277.119, "pressure": 1018.86, "sea_level": 1035.74, "grnd_level": 1018.86, "humidity": 40, "temp_kf": -2.91 }, "weather": [{ "id": 800, "main": "Clear", "description": "clear sky", "icon": "01d" }], "clouds": { "all": 0 }, "wind": { "speed": 5.66, "deg": 302.004 }, "rain": {}, "sys": { "pod": "d" }, "dt_txt": "2016-03-29 21:00:00" }, { "dt": 1459296000, "main": { "temp": 273.57, "temp_min": 273.57, "temp_max": 276.219, "pressure": 1020.22, "sea_level": 1037.14, "grnd_level": 1020.22, "humidity": 45, "temp_kf": -2.65 }, "weather": [{ "id": 800, "main": "Clear", "description": "clear sky", "icon": "01n" }], "clouds": { "all": 0 }, "wind": { "speed": 4.81, "deg": 290.502 }, "rain": {}, "sys": { "pod": "n" }, "dt_txt": "2016-03-30 00:00:00" }, { "dt": 1459306800, "main": { "temp": 272.57, "temp_min": 272.57, "temp_max": 274.949, "pressure": 1021.26, "sea_level": 1038.3, "grnd_level": 1021.26, "humidity": 54, "temp_kf": -2.38 }, "weather": [{ "id": 800, "main": "Clear", "description": "clear sky", "icon": "01n" }], "clouds": { "all": 0 }, "wind": { "speed": 3.82, "deg": 290 }, "rain": {}, "sys": { "pod": "n" }, "dt_txt": "2016-03-30 03:00:00" }, { "dt": 1459317600, "main": { "temp": 271, "temp_min": 271, "temp_max": 273.113, "pressure": 1022, "sea_level": 1039.18, "grnd_level": 1022, "humidity": 64, "temp_kf": -2.12 }, "weather": [{ "id": 800, "main": "Clear", "description": "clear sky", "icon": "01n" }], "clouds": { "all": 0 }, "wind": { "speed": 2.91, "deg": 287.502 }, "rain": {}, "sys": { "pod": "n" }, "dt_txt": "2016-03-30 06:00:00" }, { "dt": 1459328400, "main": { "temp": 269.69, "temp_min": 269.69, "temp_max": 271.542, "pressure": 1022.45, "sea_level": 1039.61, "grnd_level": 1022.45, "humidity": 72, "temp_kf": -1.85 }, "weather": [{ "id": 800, "main": "Clear", "description": "clear sky", "icon": "02n" }], "clouds": { "all": 8 }, "wind": { "speed": 2.87, "deg": 248.504 }, "rain": {}, "sys": { "pod": "n" }, "dt_txt": "2016-03-30 09:00:00" }] };
                        if (dayData != null) {
                            weatherCallbackHelper(zip, dayData, forecastData, callback);
                        }
                    }, 0);
                } else {
                    $.ajax({
                        url: this.baseApiURL + "forecast?zip=" + zip + ",us&appid=" + this.apiID + "&cnt=12", // count 12 because it's in 3 hour increments, so 36 hours
                        cache: false,
                        crossDomain: true,
                        dataType: 'json',
                        method: 'GET',
                        success: function (result) {
                            forecastData = result;

                            // Save the data in a cookie for 10 minutes to cache it
                            // expires in 10 minutes (1 day / 24 hours per day / 60 minutes per hour * 10 = 10 minutes
                            Cookies.set("hourlyData_" + zip, forecastData, { expires: (((1 / 24) / 60) * 10) });

                            if (dayData != null) {
                                weatherCallbackHelper(zip, dayData, forecastData, callback);
                            }
                        },
                        error: function () {
                            forecastData = { errorLoading: true };

                            if (dayData != null) {
                                weatherCallbackHelper(zip, dayData, forecastData, callback);
                            }
                        }
                    });
                }
            }

            // We found all the data in cookies as the "cache"
            if (dayData != null && forecastData != null) {
                // If we don't do setTimeout, the call becomes synchronous
                // which messes up angular. So, setTimeout to make it asynchronous
                setTimeout(function () {
                    weatherCallbackHelper(zip, dayData, forecastData, callback);
                }, 1);
            }
        };
    }]);

kelvinToFarenheit = function(temp) {
    return parseFloat((((temp * 9) / 5) - 459.67).toFixed(2));
};

weatherCallbackHelper = function (zip, daily, forecast, callback) {
    var weather = parseWeatherData(daily);
    weather.zip = zip;
    weather.hourly = [];

    if (forecast.errorLoading) {
        weather.errorLoadingHourly = true;
    } else {
        for (var i in forecast.list) {
            var hourlyData = forecast.list[i];
            var formatted = parseWeatherData(hourlyData);
            formatted.time = new Date(hourlyData.dt_txt + " UTC");
            weather.hourly.push(formatted);
        }
    }

    if (callback != null) {
        callback(weather)
    }
};

parseWeatherData = function (data) {
    var weather = {};
    if (data.errorLoading) {
        weather.errorLoading = true;
    } else {
        weather.farenheitTemperature = kelvinToFarenheit(data.main.temp);
        weather.maxFarenheitTemperature = kelvinToFarenheit(data.main.temp_max);
        weather.minFarenheitTemperature = kelvinToFarenheit(data.main.temp_min);
        weather.humidity = data.main.humidity;
        // TODO: add more detail

        if (data.weather != null && data.weather[0] != null && data.weather[0].description != null) {
            weather.description = data.weather[0].description;
        }
    }

    return weather;
};