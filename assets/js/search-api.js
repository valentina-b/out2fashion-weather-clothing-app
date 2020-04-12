function fetchWeatherData(event) {
    var cityInput = $("#earch-api").val()
    if (!cityInput) {
        $("#search-label").text("Not found - try again!");
        $("#loader").removeClass("line").html(`<img src="assets/images/svg-loader.svg" alt="Loader image">`)
        return;
    }

    $("#section-content").first();
}
