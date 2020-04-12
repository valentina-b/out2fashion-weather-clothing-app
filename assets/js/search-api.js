function fetchWeatherData(event) {
    var cityInput = $("#earch-api").val();
    if (!cityInput) {
        $("#search-label").text("Not found - try again!");
        $("#loader").removeClass("line").addClass("loader");
        return;
    }
}


function changeContent() {
    
    $("#section-content").first();
}