$( document ).ready(function() {

    // EFFECTS
    $(".city-content img").mouseenter(function(){
        $(this).addClass("square-hover");
    });
    $(".city-content img").mouseleave(function(){
        $(this).removeClass("square-hover");
    })

    $(".refresh-square").mouseenter(function(){
        $(this).addClass("shadow-hover");
    });
    $(".refresh-square").mouseleave(function(){
        $(this).removeClass("shadow-hover");
    })

    // Recalculate F to C --> T(°C) = (T(°F) - 32) / 1.8
    // transformToCelsius(68) ---> 20
    function transformToCelsius(tempF) {
        return (tempF - 32) / 1.8
    }

    // when a user clicks on a city
        // 1 hide main content
        // 2 show city content
    function changeContent() {
        $("#main-content").addClass("d-none");
        $("#city-content").removeClass("d-none");
        // 3 bring the user to the top of the page
        // credits: https://stackoverflow.com/questions/1144805/scroll-to-the-top-of-the-page-using-javascript
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    function fetchWeatherData() {
        // 4 change city name in the city content
        $(".city-name-img").click(function() {
            changeContent();
            let cityAttributeText = $(this).attr("alt");
            $("#city-name-populated").text(cityAttributeText);
            
        // 5 fetch city data
            let locationKey = [
            {
                city: "Berlin",
                cityKey: 178087
            },
            {
                city: "London",
                cityKey: 328328
            },
            {
                city: "Paris",
                cityKey: 623
            },
            {
                city: "New York",
                cityKey: 349727
            },
            {
                city: "Sydney",
                cityKey: 22889
            },
            {
                city: "Hong Kong",
                cityKey: 1123655
            },
            {
                city: "Seoul",
                cityKey: 226081
            },
            {
                city: "Auckland",
                cityKey: 252066
            }
        ];

            function findAPIurl() {
                for (let i = 0; i < locationKey.length; i++) {
                    if (locationKey[i].city === cityAttributeText) {
                        return locationKey[i].cityKey;
                    }
                }
            }

            let cityLocationID = findAPIurl();
            let apiKey = "cUKU5seD8FYw3kzd4humiPZ5JAu8Aep3";
            let apiURL = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${cityLocationID}?apikey=${apiKey}&language=en-us&details=true`;

            fetch(apiURL)
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
                        longPhrase.text(data.DailyForecasts[0].Day.LongPhrase)
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
                        if ([1, 2, 30].includes(iconNumber)) {
                            mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-sun.svg");
                            secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-sun.svg");
                        } else if ([3, 4].includes(iconNumber)) {
                            mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-sun.svg");
                            secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-mostly-cloud.svg");
                        } else if ([5, 6].includes(iconNumber)) {
                            mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-mostly-cloud.svg");
                            secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-mostly-cloud.svg");
                        } else if ([7, 8].includes(iconNumber)) {
                            mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-cloud.svg");
                            secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-cloud.svg");
                        } else if (iconNumber === 11) {
                            mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-fog.svg");
                            secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-fog.svg");
                        } else if ([12, 18].includes(iconNumber)) {
                            mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-rain.svg");
                            secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-rain.svg");
                        } else if ([13, 14].includes(iconNumber)) {
                            mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-mostly-cloud.svg");
                            secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-rain.svg");
                        } else if (iconNumber === 15) {
                            mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-storm.svg");
                            secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-storm.svg");
                        } else if ([16, 17].includes(iconNumber)) {
                            mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-mostly-cloud.svg");
                            secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-storm.svg");
                        } else if (iconNumber === 19) {
                            mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-sleet.svg");
                            secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-cloud.svg");
                        } else if ([20, 21].includes(iconNumber)) {
                            mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-mostly-cloud.svg");
                            secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-sleet.svg");
                        } else if (iconNumber === 22) {
                            mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-snow.svg");
                            secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-snow.svg");
                        } else if (iconNumber === 23) {
                            mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-mostly-cloud.svg");
                            secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-snow.svg");
                        } else if ([24, 31].includes(iconNumber)) {
                            mainWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-ice.svg");
                            secondaryWeatherIcon.attr("src","assets/images/weather-icons/svg-icon-weather-ice.svg");
                        } else if ([25, 26, 29].includes(iconNumber)) {
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

                    // change clothing items icons and text
                    let clothesIconTop = $("#clothes-top");
                    let clothesIconBottom = $("#clothes-bottom");
                    let clothesIconFootwear = $("#clothes-footwear");
                    let clothesIconOuterwear = $("#clothes-outerwear");
                    let clothesIconAdditional = $("#clothes-additional");
                    let clothesIconBag = $("#clothes-bag");
                    let clothesIconAccessories = $("#clothes-accessories");

                    let clothesIconTopText = $("#item-name-top");
                    let clothesIconBottomText = $("#item-name-bottom");
                    let clothesIconFootwearText = $("#item-name-footwear");
                    let clothesIconOuterwearText = $("#item-name-outerwear");
                    let clothesIconAdditionalText = $("#item-name-additional");
                    let clothesIconBagText = $("#item-name-bag");
                    let clothesIconAccessoriesText = $("#item-name-accessories");

                    // result of a function from before - fetch the original tempereature, transform into C, round it and save it into a variable
                    let maxTemperatureResult = Math.round(transformToCelsius(originalFeelMaxTemperature));
                    
                    function randomZeroToFour() {
                        return Math.floor(Math.random() * 5); 
                    };
                    // let recommendationProductBox1price1 = $("#recommendation-1 .price-tag:nth-child(1)");

                    // function populateProducts () {
                    //     let randomNumber = randomZeroToFour();
                    //     for (let i = 0; i < array.length; i++) {
                    //         recommendationProductBox1price1.text(products.shirt[randomNumber][i].price);
                            
                    //     }
                        
                    // }
                    // populateProducts();

                    function changeClothesIcons() {
                        // top = shirt or tshirt
                        function changeClothesIconsTop() {
                            if (maxTemperatureResult <= 20) {
                                clothesIconTop.attr("src","assets/images/clothes-icons/svg-icon-clothes-shirt.svg");
                                clothesIconTopText.text("Shirt");
                                let price1 = $("#price1");
                                let price2 = $("#price2");
                                let price3 = $("#price3");
                                
                                let randomNumber = randomZeroToFour();

                                let fetchPrice1 = products.shirt[randomNumber][0].price;
                                // let fetchPrice1 = products.shirt[randomNumber][1].price;
                                // let fetchPrice1 = products.shirt[randomNumber][2].price;

                                function populateProducts() {
                                    price1.text(fetchPrice1)
                                };
                                populateProducts();
                                // populateProducts(price2, fetchPrice2);
                                // populateProducts(price3, fetchPrice3);
                            } else {
                                clothesIconTop.attr("src","assets/images/clothes-icons/svg-icon-clothes-tshirt.svg");
                                clothesIconTopText.text("T-shirt");
                            }
                        }
                        changeClothesIconsTop();

                        // bottom = pants or shorts
                        function changeClothesIconsBottom() {
                            if (maxTemperatureResult > 24) {
                                clothesIconBottom.attr("src","assets/images/clothes-icons/svg-icon-clothes-shorts.svg");
                                clothesIconBottomText.text("Shorts");
                            } else {
                                clothesIconBottom.attr("src","assets/images/clothes-icons/svg-icon-clothes-pants.svg");
                                clothesIconBottomText.text("Pants");
                            }
                        }
                        changeClothesIconsBottom();

                        // footwear = shoes or sandals
                        function changeClothesIconsFootwear() {
                            if (maxTemperatureResult > 26) {
                                clothesIconFootwear.attr("src","assets/images/clothes-icons/svg-icon-clothes-sandal.svg");
                                clothesIconFootwearText.text("Sandals");
                            } else {
                                clothesIconFootwear.attr("src","assets/images/clothes-icons/svg-icon-clothes-shoe.svg");
                                clothesIconFootwearText.text("Shoes");
                            }
                        }
                        changeClothesIconsFootwear();

                        // footwear = boots
                        function changeClothesIconsFootwearBoots() {
                            if ((iconNumber >= 19 && iconNumber <= 26) || (iconNumber === 29)) {
                                clothesIconFootwear.attr("src","assets/images/clothes-icons/svg-icon-clothes-boot.svg");
                                clothesIconFootwearText.text("Boots");
                            }
                        }
                        changeClothesIconsFootwearBoots();

                        // outerwear = jacket or blazer
                        function changeClothesIconsOuterwear() {
                            if (maxTemperatureResult <= 17) {
                                clothesIconOuterwear.attr("src","assets/images/clothes-icons/svg-icon-clothes-jacket.svg");
                                clothesIconOuterwearText.text("Jacket");
                            } 
                            else if (maxTemperatureResult > 28) {
                                clothesIconOuterwear.attr("src","assets/images/clothes-icons/svg-icon-clothes-hat.svg");
                                clothesIconOuterwearText.text("Summer hat");
                            } 
                            else {
                                clothesIconOuterwear.attr("src","assets/images/clothes-icons/svg-icon-clothes-blazer.svg");
                                clothesIconOuterwearText.text("Blazer");
                            }
                        }
                        changeClothesIconsOuterwear();

                        // additional = winter hat, sunglasses, socks
                        function changeClothesIconsAdditional() {
                            if (maxTemperatureResult < 15) {
                                clothesIconAdditional.attr("src","assets/images/clothes-icons/svg-icon-clothes-winter-hat.svg");
                                clothesIconAdditionalText.text("Winter hat");
                            } else if (maxTemperatureResult > 26) {
                                clothesIconAdditional.attr("src","assets/images/clothes-icons/svg-icon-clothes-sunglasses.svg");
                                clothesIconAdditionalText.text("Sunglasses");
                            } else {
                                clothesIconAdditional.attr("src","assets/images/clothes-icons/svg-icon-clothes-socks.svg");
                                clothesIconAdditionalText.text("Socks");
                            }
                        }
                        changeClothesIconsAdditional();

                        // additional = umbrella
                        function changeClothesIconsAdditionalUmbrella() {
                            // if 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23 (no 24)
                            // if 25, 26 and 29
                            if ((iconNumber >= 12 && iconNumber <= 23) || [25, 26, 29].includes(iconNumber)) {
                                clothesIconAdditional.attr("src","assets/images/clothes-icons/svg-icon-clothes-umbrella.svg");
                                clothesIconAdditionalText.text("Umbrella");
                            }
                        }
                        changeClothesIconsAdditionalUmbrella();
                    }
                    changeClothesIcons();

                    // populate products based on the clothes icons
                    // let clothesIconTopText = $("#item-name-top");
                    // let clothesIconBottomText = $("#item-name-bottom");
                    // let clothesIconFootwearText = $("#item-name-footwear");
                    // let clothesIconOuterwearText = $("#item-name-outerwear");
                    // let clothesIconAdditionalText = $("#item-name-additional");
                    // let clothesIconBagText = $("#item-name-bag");
                    // let clothesIconAccessoriesText = $("#item-name-accessories");

                    // create a random number from 0 to 4 for the products arrays
                    // https://www.w3schools.com/js/js_random.asp
                    // function randomZeroToFour() {
                    //     return Math.floor(Math.random() * 5); 
                    // };



                    // let itemText = $(".item-name").text();
                    // function populateProducts(itemText) {

                    // }

                    // let item
                    // function populateProducts(itemText) {
                    //     for (let i = 0; i < products.length; i++) {
                    //         if (products[i] == itemText) {
                                
                    //         }
                            
                    //     }
                    // }

                })
                .catch(err => {
                // Error
                });
            });
        }

    fetchWeatherData();

});