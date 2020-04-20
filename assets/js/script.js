$( document ).ready(function() {



let apiKey = "cUKU5seD8FYw3kzd4humiPZ5JAu8Aep3";

// Berlin, London, New York, Sydney
let locationKey = [178087, 328328, 349727, 22889]
let berlinURL = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey[0]}?apikey=${apiKey}&language=en-us&details=true`;
let londonURL = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey[1]}?apikey=${apiKey}&language=en-us&details=true`;
let newyorkURL = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey[2]}?apikey=${apiKey}&language=en-us&details=true`;
let sydneyURL = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey[3]}?apikey=${apiKey}&language=en-us&details=true`;




fetch(berlinURL)
  .then(response => {
    return response.json()
  })
  .then(data => {
    // JSON data
    console.log(data.Headline.Text)
  })
//   .catch(err => {
//     // Error
//   })





});