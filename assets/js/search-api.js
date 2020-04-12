function fetchWeatherData(event) {
    var cityInput = $("#earch-api").val();
    if (!cityInput) {
        $("#search-label").text("Not found - try again!");
        return;
    }

    $("#section-content").first();
}
