$( document ).ready(function() {


function fetchWeatherData() {

    let apiKey = "cUKU5seD8FYw3kzd4humiPZ5JAu8Aep3";
    // Berlin, London, New York, Sydney
    let locationKey = [178087, 328328, 349727, 22889]
    let berlinURL = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey[0]}?apikey=${apiKey}&language=en-us&details=true`;
    let londonURL = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey[1]}?apikey=${apiKey}&language=en-us&details=true`;
    let newyorkURL = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey[2]}?apikey=${apiKey}&language=en-us&details=true`;
    let sydneyURL = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey[3]}?apikey=${apiKey}&language=en-us&details=true`;

    let testLocationKey = 113768
    let testURL = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${testLocationKey}?apikey=${apiKey}&language=en-us&details=true`

    // Recalculate F to C --> T(°C) = (T(°F) - 32) / 1.8
    // transformToCelsius(68) ---> 20
    function transformToCelsius(tempF) {
        return (tempF - 32) / 1.8
    }



    fetch(testURL)
        .then(response => {
        return response.json()
        })
        .then(data => {
            // import short phrase
            let shortPhrase = $(".short-phrase");
            function importShortPhrase() {
                shortPhrase.text(data.DailyForecasts[0].Day.ShortPhrase)
            }
            importShortPhrase();

            // import long phrase
            let longPhrase = $(".long-phrase");
            function importLongPhrase() {
                longPhrase.text(data.Headline.Text)
            }
            importLongPhrase();

            // recalculate and display max temperatures of the day
            let maxTemperature = $(".max-temperature");
            let feelMaxTemperature = $(".feel-max-temperature");
            let originalFeelMaxTemperature = data.DailyForecasts[0].RealFeelTemperature.Maximum.Value;
            let originalMaxTemperature = data.DailyForecasts[0].Temperature.Maximum.Value;
            function importMaxTemperatures() {
                maxTemperature.text(Math.round(transformToCelsius(originalMaxTemperature)));
                feelMaxTemperature.text(Math.round(transformToCelsius(originalFeelMaxTemperature)));
            }
            importMaxTemperatures();

            // recalculate and display min temperatures of the day
            let minTemperature = $(".min-temperature");
            let feelMinTemperature = $(".feel-min-temperature");
            let originalMinTemperature = data.DailyForecasts[0].Temperature.Minimum.Value;
            let originalFeelMinTemperature = data.DailyForecasts[0].RealFeelTemperature.Minimum.Value;
            function importMinTemperatures() {
                minTemperature.text(Math.round(transformToCelsius(originalMinTemperature)));
                feelMinTemperature.text(Math.round(transformToCelsius(originalFeelMinTemperature)));
            }
            importMinTemperatures();

            // change main and secondary weather icons
            let mainWeatherIcon = $("#main-weather-icon");
            let secondaryWeatherIcon = $("#secondary-weather-icon");
            let iconNumber = data.DailyForecasts[0].Day.Icon;

            function changeWeatherIcons() {
                if (iconNumber === 1 || iconNumber === 2 || iconNumber === 30) {
                    mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-sun.svg");
                    secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-sun.svg");
                } else if (iconNumber === 3 || iconNumber === 4) {
                    mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-sun.svg");
                    secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-mostly-cloud.svg");
                } else if (iconNumber === 5 || iconNumber === 6) {
                    mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-mostly-cloud.svg");
                    secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-mostly-cloud.svg");
                } else if (iconNumber === 7 || iconNumber === 8) {
                    mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-cloud.svg");
                    secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-cloud.svg");
                } else if (iconNumber === 11) {
                    mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-fog.svg");
                    secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-fog.svg");
                } else if (iconNumber === 12 || iconNumber === 18) {
                    mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-rain.svg");
                    secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-rain.svg");
                } else if (iconNumber === 13 || iconMuber === 14) {
                    mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-mostly-cloud.svg");
                    secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-rain.svg");
                } else if (iconNumber === 15) {
                    mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-storm.svg");
                    secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-storm.svg");
                } else if (iconNumber === 16 || iconNumber === 17) {
                    mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-mostly-cloud.svg");
                    secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-storm.svg");
                } else if (iconNumber === 19) {
                    mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-sleet.svg");
                    secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-cloud.svg");
                } else if (iconNumber === 20 || iconNumber === 21) {
                    mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-mostly-cloud.svg");
                    secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-sleet.svg");
                } else if (iconNumber === 22) {
                    mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-snow.svg");
                    secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-snow.svg");
                } else if (iconNumber === 23) {
                    mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-mostly-cloud.svg");
                    secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-snow.svg");
                } else if (iconNumber === 24 || iconNumber === 31) {
                    mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-ice.svg");
                    secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-ice.svg");
                } else if (iconNumber === 25 || iconNumber === 26 || iconNumber === 29) {
                    mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-sleet.svg");
                    secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-sleet.svg");
                } else if (iconNumber === 32) {
                    mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-wind.svg");
                    secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-wind.svg");
                } else {
                    mainWeatherIcon.attr("src","assets/images/svg-icon-went-wrong.svg");
                    secondaryWeatherIcon.attr("src","assets/images/svg-icon-went-wrong.svg");
                }
            }
            changeWeatherIcons();

            // change clothes icons based on temperature and precipitation
            // 


            // console.log(data.Headline.Text);

        })
        .catch(err => {
        // Error
    })
}

fetchWeatherData();





});