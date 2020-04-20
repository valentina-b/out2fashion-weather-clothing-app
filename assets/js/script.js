$( document ).ready(function() {


function fetchWeatherData() {

    let apiKey = "cUKU5seD8FYw3kzd4humiPZ5JAu8Aep3";
    // Berlin, London, New York, Sydney
    let locationKey = [178087, 328328, 349727, 22889]
    let berlinURL = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey[0]}?apikey=${apiKey}&language=en-us&details=true`;
    let londonURL = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey[1]}?apikey=${apiKey}&language=en-us&details=true`;
    let newyorkURL = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey[2]}?apikey=${apiKey}&language=en-us&details=true`;
    let sydneyURL = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey[3]}?apikey=${apiKey}&language=en-us&details=true`;

    // Recalculate F to C
    // T(°C) = (T(°F) - 32) / 1.8
    // transformToCelsius(68) ---> 20
    function transformToCelsius(tempF) {
        return (tempF - 32) / 1.8
    }



    fetch(berlinURL)
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

            // recalculate and display max temperature of the day
            let maxTemperature = $(".max-temperature");
            function importMaxTemperature() {
                let originalMaxTemperature = data.DailyForecasts[0].Temperature.Maximum.Value;
                transformToCelsius(tempF);
                
            }


            // console.log(data.Headline.Text);

        })
        .catch(err => {
        // Error
    })
}

fetchWeatherData();





});