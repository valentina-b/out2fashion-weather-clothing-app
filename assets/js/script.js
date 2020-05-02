$(document).ready(function () {

    // EFFECTS

    $(".city-content img, .city-gallery-content img, .clothes-square img").hover(function () {
        $(this).addClass("square-hover");
    }, function () {
        $(this).removeClass("square-hover");
    });

    $(".refresh-square").hover(function () {
        $(this).addClass("shadow-hover");
    }, function () {
        $(this).removeClass("shadow-hover");
    });

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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    $(".scroll-up").click(function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function fetchWeatherData() {
        // 4 change city name in the city content
        $(".city-name-img").click(function () {
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
                            mainWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-sun.svg");
                            secondaryWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-sun.svg");
                        } else if ([3, 4].includes(iconNumber)) {
                            mainWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-sun.svg");
                            secondaryWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-mostly-cloud.svg");
                        } else if ([5, 6].includes(iconNumber)) {
                            mainWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-mostly-cloud.svg");
                            secondaryWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-mostly-cloud.svg");
                        } else if ([7, 8].includes(iconNumber)) {
                            mainWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-cloud.svg");
                            secondaryWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-cloud.svg");
                        } else if (iconNumber === 11) {
                            mainWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-fog.svg");
                            secondaryWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-fog.svg");
                        } else if ([12, 18].includes(iconNumber)) {
                            mainWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-rain.svg");
                            secondaryWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-rain.svg");
                        } else if ([13, 14].includes(iconNumber)) {
                            mainWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-mostly-cloud.svg");
                            secondaryWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-rain.svg");
                        } else if (iconNumber === 15) {
                            mainWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-storm.svg");
                            secondaryWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-storm.svg");
                        } else if ([16, 17].includes(iconNumber)) {
                            mainWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-mostly-cloud.svg");
                            secondaryWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-storm.svg");
                        } else if (iconNumber === 19) {
                            mainWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-sleet.svg");
                            secondaryWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-cloud.svg");
                        } else if ([20, 21].includes(iconNumber)) {
                            mainWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-mostly-cloud.svg");
                            secondaryWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-sleet.svg");
                        } else if (iconNumber === 22) {
                            mainWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-snow.svg");
                            secondaryWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-snow.svg");
                        } else if (iconNumber === 23) {
                            mainWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-mostly-cloud.svg");
                            secondaryWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-snow.svg");
                        } else if ([24, 31].includes(iconNumber)) {
                            mainWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-ice.svg");
                            secondaryWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-ice.svg");
                        } else if ([25, 26, 29].includes(iconNumber)) {
                            mainWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-sleet.svg");
                            secondaryWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-sleet.svg");
                        } else if (iconNumber === 32) {
                            mainWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-wind.svg");
                            secondaryWeatherIcon.attr("src", "assets/images/weather-icons/svg-icon-weather-wind.svg");
                        } else {
                            mainWeatherIcon.attr("src", "assets/images/svg-icon-went-wrong.svg");
                            secondaryWeatherIcon.attr("src", "assets/images/svg-icon-went-wrong.svg");
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

                    // result of a function from before - fetch the original temperature, transform into C, round it and save it into a variable
                    let maxTemperatureResult = Math.round(transformToCelsius(originalFeelMaxTemperature));

                    // link out
                    function linkOut(url) {
                        window.open(url, "_blank");
                    };

                    // create a random number 0-4 to access 1 out of 5 collections of the products object
                    function randomZeroToFour() {
                        return Math.floor(Math.random() * 5);
                    };

                    // take an array and populate recommended-item-box with products
                    function populateProducts(productsArray) {
                        productsArray[0].text(productsArray[1]);
                        productsArray[2].attr("src", `assets/images/clothes-items/${productsArray[4]}/${productsArray[3]}.png`);
                    };

                    let price1 = $("#price1");
                    let price2 = $("#price2");
                    let price3 = $("#price3");
                    let price4 = $("#price4");
                    let price5 = $("#price5");
                    let price6 = $("#price6");
                    let price7 = $("#price7");
                    let price8 = $("#price8");
                    let price9 = $("#price9");
                    let price10 = $("#price10");
                    let price11 = $("#price11");
                    let price12 = $("#price12");
                    let price13 = $("#price13");
                    let price14 = $("#price14");
                    let price15 = $("#price15");
                    let price16 = $("#price16");
                    let price17 = $("#price17");
                    let price18 = $("#price18");
                    let price19 = $("#price19");
                    let price20 = $("#price20");
                    let price21 = $("#price21");

                    let image1 = $("#image1");
                    let image2 = $("#image2");
                    let image3 = $("#image3");
                    let image4 = $("#image4");
                    let image5 = $("#image5");
                    let image6 = $("#image6");
                    let image7 = $("#image7");
                    let image8 = $("#image8");
                    let image9 = $("#image9");
                    let image10 = $("#image10");
                    let image11 = $("#image11");
                    let image12 = $("#image12");
                    let image13 = $("#image13");
                    let image14 = $("#image14");
                    let image15 = $("#image15");
                    let image16 = $("#image16");
                    let image17 = $("#image17");
                    let image18 = $("#image18");
                    let image19 = $("#image19");
                    let image20 = $("#image20");
                    let image21 = $("#image21");

                    // create a random number
                    let randomNumber = randomZeroToFour();

                    // refresh random number for refresh button
                    function refreshRandomNumber() {
                        function newRandomNumber() {
                            return randomNumber + 1;
                        };

                        function checkRandomNumber() {
                            if (randomNumber > 4) {
                                let randomNumber = 0;
                                return randomNumber;
                            } else {
                                return randomNumber;
                            };
                        }
                        randomNumber = newRandomNumber();
                        randomNumber = checkRandomNumber();
                        return randomNumber;
                    };

                    let productName1 = "shirt";
                    let productName2 = "tshirt";
                    let productName3 = "shorts";
                    let productName4 = "pants";
                    let productName5 = "sandals";
                    let productName6 = "shoes";
                    let productName7 = "boots";
                    let productName8 = "jacket";
                    let productName9 = "summerhat";
                    let productName10 = "blazer";
                    let productName11 = "winterhat";
                    let productName12 = "sunglasses";
                    let productName13 = "socks";
                    let productName14 = "umbrella";
                    let productName15 = "bag";
                    let productName16 = "accessories";


                    let productsShirt = products.shirt;
                    let productsTshirt = products.tshirt;
                    let productsShorts = products.shorts;
                    let productsPants = products.pants;
                    let productsSandals = products.sandals;
                    let productsShoes = products.shoes;
                    let productsBoots = products.boots;
                    let productsJacket = products.jacket;
                    let productsSummerhat = products.summerhat;
                    let productsBlazer = products.blazer;
                    let productsWinterhat = products.winterhat;
                    let productsSocks = products.socks;
                    let productsSunglasses = products.sunglasses;
                    let productsUmbrella = products.umbrella;
                    let productsBag = products.bag;
                    let productsAccessories = products.accessories;


                    function changeClothesIcons() {
                        // top = shirt or tshirt
                        function changeClothesIconsTop() {
                            if (maxTemperatureResult <= 20) {
                                clothesIconTop.attr("src", "assets/images/clothes-icons/svg-icon-clothes-shirt.svg");
                                clothesIconTopText.text("Shirt");

                                function populateShirt() {

                                    let fetchPrice1 = productsShirt[randomNumber][0].price;
                                    let fetchPrice2 = productsShirt[randomNumber][1].price;
                                    let fetchPrice3 = productsShirt[randomNumber][2].price;

                                    let fetchImage1 = productsShirt[randomNumber][0].imageTitle;
                                    let fetchImage2 = productsShirt[randomNumber][1].imageTitle;
                                    let fetchImage3 = productsShirt[randomNumber][2].imageTitle;

                                    let productsArray1 = [price1, fetchPrice1, image1, fetchImage1, productName1];
                                    let productsArray2 = [price2, fetchPrice2, image2, fetchImage2, productName1];
                                    let productsArray3 = [price3, fetchPrice3, image3, fetchImage3, productName1];

                                    populateProducts(productsArray1);
                                    populateProducts(productsArray2);
                                    populateProducts(productsArray3);

                                };
                                populateShirt();

                                function addLinks() {

                                    let fetchLink1 = productsShirt[randomNumber][0].link;
                                    let fetchLink2 = productsShirt[randomNumber][1].link;
                                    let fetchLink3 = productsShirt[randomNumber][2].link;

                                    image1.off("click");
                                    image2.off("click");
                                    image3.off("click");

                                    image1.click(function () {
                                        linkOut(fetchLink1);
                                    });
                                    image2.click(function () {
                                        linkOut(fetchLink2);
                                    });
                                    image3.click(function () {
                                        linkOut(fetchLink3);
                                    })
                                }
                                addLinks();

                                $("#refresh-square-1").click(function () {
                                    let randomNumber = refreshRandomNumber();
                                    populateShirt();
                                    addLinks();
                                });

                            } else {
                                clothesIconTop.attr("src", "assets/images/clothes-icons/svg-icon-clothes-tshirt.svg");
                                clothesIconTopText.text("T-shirt");

                                // ************* create products.tshirt variable and then iterate on it 
                                function populateTshirt() {

                                    let fetchPrice1 = productsTshirt[randomNumber][0].price;
                                    let fetchPrice2 = productsTshirt[randomNumber][1].price;
                                    let fetchPrice3 = productsTshirt[randomNumber][2].price;

                                    let fetchImage1 = productsTshirt[randomNumber][0].imageTitle;
                                    let fetchImage2 = productsTshirt[randomNumber][1].imageTitle;
                                    let fetchImage3 = productsTshirt[randomNumber][2].imageTitle;

                                    // ************* iterate through prices and save in a variable? As a string and then transform into an array?
                                    // function iteratePricesAndImages() {
                                    //     for (let i = 0; i < productsTshirt.length; i++) {
                                    //         productsTshirt[randomNumber][i].price;
                                    //         productsTshirt[randomNumber][i].imageTitle;
                                    //     }
                                    //     return productsTshirt[randomNumber][i].price;
                                    //     return productsTshirt[randomNumber][i].imageTitle;
                                    // }
                                    // ***********this one worked
                                    // function iteratePricesAndImages() {
                                    //     for (let i = 0; i < productsTshirt.length; i++) {
                                    //         console.log(productsTshirt[3][i].price)
                                    //         console.log(productsTshirt[3][i].imageTitle)
                                    //     }
                                    // }
                                    let productsArray1 = [price1, fetchPrice1, image1, fetchImage1, productName2];
                                    let productsArray2 = [price2, fetchPrice2, image2, fetchImage2, productName2];
                                    let productsArray3 = [price3, fetchPrice3, image3, fetchImage3, productName2];

                                    populateProducts(productsArray1);
                                    populateProducts(productsArray2);
                                    populateProducts(productsArray3);
                                }
                                populateTshirt();

                                function addLinks() {

                                    let fetchLink1 = productsTshirt[randomNumber][0].link;
                                    let fetchLink2 = productsTshirt[randomNumber][1].link;
                                    let fetchLink3 = productsTshirt[randomNumber][2].link;

                                    image1.off("click");
                                    image2.off("click");
                                    image3.off("click");

                                    image1.click(function () {
                                        linkOut(fetchLink1);
                                    });
                                    image2.click(function () {
                                        linkOut(fetchLink2);
                                    });
                                    image3.click(function () {
                                        linkOut(fetchLink3);
                                    })
                                }
                                addLinks();

                                $("#refresh-square-1").click(function () {
                                    let randomNumber = refreshRandomNumber();
                                    populateTshirt();
                                    addLinks();
                                });
                            }
                        }
                        changeClothesIconsTop();

                        // bottom = pants or shorts
                        function changeClothesIconsBottom() {
                            if (maxTemperatureResult > 24) {
                                clothesIconBottom.attr("src", "assets/images/clothes-icons/svg-icon-clothes-shorts.svg");
                                clothesIconBottomText.text("Shorts");

                                function populateShorts() {

                                    let fetchPrice1 = productsShorts[randomNumber][0].price;
                                    let fetchPrice2 = productsShorts[randomNumber][1].price;
                                    let fetchPrice3 = productsShorts[randomNumber][2].price;

                                    let fetchImage1 = productsShorts[randomNumber][0].imageTitle;
                                    let fetchImage2 = productsShorts[randomNumber][1].imageTitle;
                                    let fetchImage3 = productsShorts[randomNumber][2].imageTitle;

                                    let productsArray1 = [price4, fetchPrice1, image4, fetchImage1, productName3];
                                    let productsArray2 = [price5, fetchPrice2, image5, fetchImage2, productName3];
                                    let productsArray3 = [price6, fetchPrice3, image6, fetchImage3, productName3];

                                    populateProducts(productsArray1);
                                    populateProducts(productsArray2);
                                    populateProducts(productsArray3);
                                };
                                populateShorts();

                                function addLinks() {

                                    let fetchLink1 = productsShorts[randomNumber][0].link;
                                    let fetchLink2 = productsShorts[randomNumber][1].link;
                                    let fetchLink3 = productsShorts[randomNumber][2].link;

                                    image4.off("click");
                                    image5.off("click");
                                    image6.off("click");

                                    image4.click(function () {
                                        linkOut(fetchLink1);
                                    });
                                    image5.click(function () {
                                        linkOut(fetchLink2);
                                    });
                                    image6.click(function () {
                                        linkOut(fetchLink3);
                                    });
                                };
                                addLinks();

                                $("#refresh-square-2").click(function () {
                                    let randomNumber = refreshRandomNumber();
                                    populateShorts();
                                    addLinks();
                                });

                            } else {
                                clothesIconBottom.attr("src", "assets/images/clothes-icons/svg-icon-clothes-pants.svg");
                                clothesIconBottomText.text("Pants");

                                function populatePants() {

                                    let fetchPrice1 = productsPants[randomNumber][0].price;
                                    let fetchPrice2 = productsPants[randomNumber][1].price;
                                    let fetchPrice3 = productsPants[randomNumber][2].price;

                                    let fetchImage1 = productsPants[randomNumber][0].imageTitle;
                                    let fetchImage2 = productsPants[randomNumber][1].imageTitle;
                                    let fetchImage3 = productsPants[randomNumber][2].imageTitle;

                                    let productsArray1 = [price4, fetchPrice1, image4, fetchImage1, productName4];
                                    let productsArray2 = [price5, fetchPrice2, image5, fetchImage2, productName4];
                                    let productsArray3 = [price6, fetchPrice3, image6, fetchImage3, productName4];

                                    populateProducts(productsArray1);
                                    populateProducts(productsArray2);
                                    populateProducts(productsArray3);
                                };
                                populatePants();

                                function addLinks() {

                                    let fetchLink1 = productsPants[randomNumber][0].link;
                                    let fetchLink2 = productsPants[randomNumber][1].link;
                                    let fetchLink3 = productsPants[randomNumber][2].link;

                                    image4.off("click");
                                    image5.off("click");
                                    image6.off("click");

                                    image4.click(function () {
                                        linkOut(fetchLink1);
                                    });
                                    image5.click(function () {
                                        linkOut(fetchLink2);
                                    });
                                    image6.click(function () {
                                        linkOut(fetchLink3);
                                    });
                                };
                                addLinks();

                                $("#refresh-square-2").click(function () {
                                    let randomNumber = refreshRandomNumber();
                                    populatePants();
                                    addLinks();
                                });
                            }
                        }
                        changeClothesIconsBottom();

                        // footwear = shoes or sandals
                        function changeClothesIconsFootwear() {
                            if (maxTemperatureResult > 26) {
                                clothesIconFootwear.attr("src", "assets/images/clothes-icons/svg-icon-clothes-sandal.svg");
                                clothesIconFootwearText.text("Sandals");

                                function populateSandals() {

                                    let fetchPrice1 = productsSandals[randomNumber][0].price;
                                    let fetchPrice2 = productsSandals[randomNumber][1].price;
                                    let fetchPrice3 = productsSandals[randomNumber][2].price;

                                    let fetchImage1 = productsSandals[randomNumber][0].imageTitle;
                                    let fetchImage2 = productsSandals[randomNumber][1].imageTitle;
                                    let fetchImage3 = productsSandals[randomNumber][2].imageTitle;

                                    let productsArray1 = [price7, fetchPrice1, image7, fetchImage1, productName5];
                                    let productsArray2 = [price8, fetchPrice2, image8, fetchImage2, productName5];
                                    let productsArray3 = [price9, fetchPrice3, image9, fetchImage3, productName5];

                                    populateProducts(productsArray1);
                                    populateProducts(productsArray2);
                                    populateProducts(productsArray3);
                                };
                                populateSandals();

                                function addLinks() {

                                    let fetchLink1 = productsSandals[randomNumber][0].link;
                                    let fetchLink2 = productsSandals[randomNumber][1].link;
                                    let fetchLink3 = productsSandals[randomNumber][2].link;

                                    image7.off("click");
                                    image8.off("click");
                                    image9.off("click");

                                    image7.click(function () {
                                        linkOut(fetchLink1);
                                    });
                                    image8.click(function () {
                                        linkOut(fetchLink2);
                                    });
                                    image9.click(function () {
                                        linkOut(fetchLink3);
                                    })
                                };
                                addLinks();

                                $("#refresh-square-3").click(function () {
                                    let randomNumber = refreshRandomNumber();
                                    populateSandals();
                                    addLinks();
                                });

                            } else {
                                clothesIconFootwear.attr("src", "assets/images/clothes-icons/svg-icon-clothes-shoe.svg");
                                clothesIconFootwearText.text("Shoes");

                                function populateShoes() {

                                    let fetchPrice1 = productsShoes[randomNumber][0].price;
                                    let fetchPrice2 = productsShoes[randomNumber][1].price;
                                    let fetchPrice3 = productsShoes[randomNumber][2].price;

                                    let fetchImage1 = productsShoes[randomNumber][0].imageTitle;
                                    let fetchImage2 = productsShoes[randomNumber][1].imageTitle;
                                    let fetchImage3 = productsShoes[randomNumber][2].imageTitle;

                                    let productsArray1 = [price7, fetchPrice1, image7, fetchImage1, productName6];
                                    let productsArray2 = [price8, fetchPrice2, image8, fetchImage2, productName6];
                                    let productsArray3 = [price9, fetchPrice3, image9, fetchImage3, productName6];

                                    populateProducts(productsArray1);
                                    populateProducts(productsArray2);
                                    populateProducts(productsArray3);
                                };
                                populateShoes();

                                function addLinks() {

                                    let fetchLink1 = productsShoes[randomNumber][0].link;
                                    let fetchLink2 = productsShoes[randomNumber][1].link;
                                    let fetchLink3 = productsShoes[randomNumber][2].link;

                                    image7.off("click");
                                    image8.off("click");
                                    image9.off("click");

                                    image7.click(function () {
                                        linkOut(fetchLink1);
                                    });
                                    image8.click(function () {
                                        linkOut(fetchLink2);
                                    });
                                    image9.click(function () {
                                        linkOut(fetchLink3);
                                    });
                                };
                                addLinks();

                                $("#refresh-square-3").click(function () {
                                    let randomNumber = refreshRandomNumber();
                                    populateShoes();
                                    addLinks();
                                });
                            }
                        }
                        changeClothesIconsFootwear();

                        // footwear = boots
                        function changeClothesIconsFootwearBoots() {
                            if ((iconNumber >= 19 && iconNumber <= 26) || (iconNumber === 29)) {
                                clothesIconFootwear.attr("src", "assets/images/clothes-icons/svg-icon-clothes-boot.svg");
                                clothesIconFootwearText.text("Boots");

                                function populateBoots() {

                                    let fetchPrice1 = productsBoots[randomNumber][0].price;
                                    let fetchPrice2 = productsBoots[randomNumber][1].price;
                                    let fetchPrice3 = productsBoots[randomNumber][2].price;

                                    let fetchImage1 = productsBoots[randomNumber][0].imageTitle;
                                    let fetchImage2 = productsBoots[randomNumber][1].imageTitle;
                                    let fetchImage3 = productsBoots[randomNumber][2].imageTitle;

                                    let productsArray1 = [price7, fetchPrice1, image7, fetchImage1, productName7];
                                    let productsArray2 = [price8, fetchPrice2, image8, fetchImage2, productName7];
                                    let productsArray3 = [price9, fetchPrice3, image9, fetchImage3, productName7];

                                    populateProducts(productsArray1);
                                    populateProducts(productsArray2);
                                    populateProducts(productsArray3);
                                };
                                populateBoots();

                                function addLinks() {

                                    let fetchLink1 = productsBoots[randomNumber][0].link;
                                    let fetchLink2 = productsBoots[randomNumber][1].link;
                                    let fetchLink3 = productsBoots[randomNumber][2].link;

                                    image7.off("click");
                                    image8.off("click");
                                    image9.off("click");

                                    image7.click(function () {
                                        linkOut(fetchLink1);
                                    });
                                    image8.click(function () {
                                        linkOut(fetchLink2);
                                    });
                                    image9.click(function () {
                                        linkOut(fetchLink3);
                                    });
                                };
                                addLinks();

                                $("#refresh-square-3").click(function () {
                                    let randomNumber = refreshRandomNumber();
                                    populateBoots();
                                    addLinks();
                                });
                            }
                        }
                        changeClothesIconsFootwearBoots();

                        // outerwear = jacket or blazer; summerhat
                        function changeClothesIconsOuterwear() {
                            if (maxTemperatureResult <= 17) {
                                clothesIconOuterwear.attr("src", "assets/images/clothes-icons/svg-icon-clothes-jacket.svg");
                                clothesIconOuterwearText.text("Jacket");

                                function populateJacket() {

                                    let fetchPrice1 = productsJacket[randomNumber][0].price;
                                    let fetchPrice2 = productsJacket[randomNumber][1].price;
                                    let fetchPrice3 = productsJacket[randomNumber][2].price;

                                    let fetchImage1 = productsJacket[randomNumber][0].imageTitle;
                                    let fetchImage2 = productsJacket[randomNumber][1].imageTitle;
                                    let fetchImage3 = productsJacket[randomNumber][2].imageTitle;

                                    let productsArray1 = [price10, fetchPrice1, image10, fetchImage1, productName8];
                                    let productsArray2 = [price11, fetchPrice2, image11, fetchImage2, productName8];
                                    let productsArray3 = [price12, fetchPrice3, image12, fetchImage3, productName8];

                                    populateProducts(productsArray1);
                                    populateProducts(productsArray2);
                                    populateProducts(productsArray3);
                                };
                                populateJacket();

                                function addLinks() {

                                    let fetchLink1 = productsJacket[randomNumber][0].link;
                                    let fetchLink2 = productsJacket[randomNumber][1].link;
                                    let fetchLink3 = productsJacket[randomNumber][2].link;

                                    image10.off("click");
                                    image11.off("click");
                                    image12.off("click");

                                    image10.click(function () {
                                        linkOut(fetchLink1);
                                    });
                                    image11.click(function () {
                                        linkOut(fetchLink2);
                                    });
                                    image12.click(function () {
                                        linkOut(fetchLink3);
                                    });
                                };
                                addLinks();

                                $("#refresh-square-4").click(function () {
                                    let randomNumber = refreshRandomNumber();
                                    populateJacket();
                                    addLinks();
                                });

                            } else if (maxTemperatureResult > 28) {
                                clothesIconOuterwear.attr("src", "assets/images/clothes-icons/svg-icon-clothes-hat.svg");
                                clothesIconOuterwearText.text("Summer hat");

                                function populateSummerhat() {

                                    let fetchPrice1 = productsSummerhat[randomNumber][0].price;
                                    let fetchPrice2 = productsSummerhat[randomNumber][1].price;
                                    let fetchPrice3 = productsSummerhat[randomNumber][2].price;

                                    let fetchImage1 = productsSummerhat[randomNumber][0].imageTitle;
                                    let fetchImage2 = productsSummerhat[randomNumber][1].imageTitle;
                                    let fetchImage3 = productsSummerhat[randomNumber][2].imageTitle;

                                    let productsArray1 = [price10, fetchPrice1, image10, fetchImage1, productName9];
                                    let productsArray2 = [price11, fetchPrice2, image11, fetchImage2, productName9];
                                    let productsArray3 = [price12, fetchPrice3, image12, fetchImage3, productName9];

                                    populateProducts(productsArray1);
                                    populateProducts(productsArray2);
                                    populateProducts(productsArray3);
                                };
                                populateSummerhat();

                                function addLinks() {

                                    let fetchLink1 = productsSummerhat[randomNumber][0].link;
                                    let fetchLink2 = productsSummerhat[randomNumber][1].link;
                                    let fetchLink3 = productsSummerhat[randomNumber][2].link;

                                    image10.off("click");
                                    image11.off("click");
                                    image12.off("click");

                                    image10.click(function () {
                                        linkOut(fetchLink1);
                                    });
                                    image11.click(function () {
                                        linkOut(fetchLink2);
                                    });
                                    image12.click(function () {
                                        linkOut(fetchLink3);
                                    });
                                };
                                addLinks();

                                $("#refresh-square-4").click(function () {
                                    let randomNumber = refreshRandomNumber();
                                    populateSummerhat();
                                    addLinks();
                                });

                            } else {
                                clothesIconOuterwear.attr("src", "assets/images/clothes-icons/svg-icon-clothes-blazer.svg");
                                clothesIconOuterwearText.text("Blazer");

                                function populateBlazer() {

                                    let fetchPrice1 = productsBlazer[randomNumber][0].price;
                                    let fetchPrice2 = productsBlazer[randomNumber][1].price;
                                    let fetchPrice3 = productsBlazer[randomNumber][2].price;

                                    let fetchImage1 = productsBlazer[randomNumber][0].imageTitle;
                                    let fetchImage2 = productsBlazer[randomNumber][1].imageTitle;
                                    let fetchImage3 = productsBlazer[randomNumber][2].imageTitle;

                                    let productsArray1 = [price10, fetchPrice1, image10, fetchImage1, productName10];
                                    let productsArray2 = [price11, fetchPrice2, image11, fetchImage2, productName10];
                                    let productsArray3 = [price12, fetchPrice3, image12, fetchImage3, productName10];

                                    populateProducts(productsArray1);
                                    populateProducts(productsArray2);
                                    populateProducts(productsArray3);
                                };
                                populateBlazer();

                                function addLinks() {

                                    let fetchLink1 = productsBlazer[randomNumber][0].link;
                                    let fetchLink2 = productsBlazer[randomNumber][1].link;
                                    let fetchLink3 = productsBlazer[randomNumber][2].link;

                                    image10.off("click");
                                    image11.off("click");
                                    image12.off("click");

                                    image10.click(function () {
                                        linkOut(fetchLink1);
                                    });
                                    image11.click(function () {
                                        linkOut(fetchLink2);
                                    });
                                    image12.click(function () {
                                        linkOut(fetchLink3);
                                    });
                                };
                                addLinks();

                                $("#refresh-square-4").click(function () {
                                    let randomNumber = refreshRandomNumber();
                                    populateBlazer();
                                    addLinks();
                                });
                            }
                        }
                        changeClothesIconsOuterwear();

                        // additional = winter hat, sunglasses, socks
                        function changeClothesIconsAdditional() {
                            if (maxTemperatureResult < 15) {
                                clothesIconAdditional.attr("src", "assets/images/clothes-icons/svg-icon-clothes-winter-hat.svg");
                                clothesIconAdditionalText.text("Winter hat");

                                function populateWinterhat() {

                                    let fetchPrice1 = productsWinterhat[randomNumber][0].price;
                                    let fetchPrice2 = productsWinterhat[randomNumber][1].price;
                                    let fetchPrice3 = productsWinterhat[randomNumber][2].price;

                                    let fetchImage1 = productsWinterhat[randomNumber][0].imageTitle;
                                    let fetchImage2 = productsWinterhat[randomNumber][1].imageTitle;
                                    let fetchImage3 = productsWinterhat[randomNumber][2].imageTitle;

                                    let productsArray1 = [price13, fetchPrice1, image13, fetchImage1, productName11];
                                    let productsArray2 = [price14, fetchPrice2, image14, fetchImage2, productName11];
                                    let productsArray3 = [price15, fetchPrice3, image15, fetchImage3, productName11];

                                    populateProducts(productsArray1);
                                    populateProducts(productsArray2);
                                    populateProducts(productsArray3);
                                };
                                populateWinterhat();

                                function addLinks() {

                                    let fetchLink1 = productsWinterhat[randomNumber][0].link;
                                    let fetchLink2 = productsWinterhat[randomNumber][1].link;
                                    let fetchLink3 = productsWinterhat[randomNumber][2].link;

                                    image13.off("click");
                                    image14.off("click");
                                    image15.off("click");

                                    image13.click(function () {
                                        linkOut(fetchLink1);
                                    });
                                    image14.click(function () {
                                        linkOut(fetchLink2);
                                    });
                                    image15.click(function () {
                                        linkOut(fetchLink3);
                                    });
                                };
                                addLinks();

                                $("#refresh-square-5").click(function () {
                                    let randomNumber = refreshRandomNumber();
                                    populateWinterhat();
                                    addLinks();
                                });

                            } else if (maxTemperatureResult > 26) {
                                clothesIconAdditional.attr("src", "assets/images/clothes-icons/svg-icon-clothes-sunglasses.svg");
                                clothesIconAdditionalText.text("Sunglasses");

                                function populateAccessories() {

                                    let fetchPrice1 = productsSunglasses[randomNumber][0].price;
                                    let fetchPrice2 = productsSunglasses[randomNumber][1].price;
                                    let fetchPrice3 = productsSunglasses[randomNumber][2].price;

                                    let fetchImage1 = productsSunglasses[randomNumber][0].imageTitle;
                                    let fetchImage2 = productsSunglasses[randomNumber][1].imageTitle;
                                    let fetchImage3 = productsSunglasses[randomNumber][2].imageTitle;

                                    let productsArray1 = [price13, fetchPrice1, image13, fetchImage1, productName12];
                                    let productsArray2 = [price14, fetchPrice2, image14, fetchImage2, productName12];
                                    let productsArray3 = [price15, fetchPrice3, image15, fetchImage3, productName12];

                                    populateProducts(productsArray1);
                                    populateProducts(productsArray2);
                                    populateProducts(productsArray3);
                                };
                                populateAccessories();

                                function addLinks() {

                                    let fetchLink1 = productsSunglasses[randomNumber][0].link;
                                    let fetchLink2 = productsSunglasses[randomNumber][1].link;
                                    let fetchLink3 = productsSunglasses[randomNumber][2].link;

                                    image13.off("click");
                                    image14.off("click");
                                    image15.off("click");

                                    image13.click(function () {
                                        linkOut(fetchLink1);
                                    });
                                    image14.click(function () {
                                        linkOut(fetchLink2);
                                    });
                                    image15.click(function () {
                                        linkOut(fetchLink3);
                                    });
                                };
                                addLinks();

                                $("#refresh-square-5").click(function () {
                                    let randomNumber = refreshRandomNumber();
                                    populateAccessories();
                                    addLinks();
                                });

                            } else {
                                clothesIconAdditional.attr("src", "assets/images/clothes-icons/svg-icon-clothes-socks.svg");
                                clothesIconAdditionalText.text("Socks");

                                function populateSocks() {

                                    let fetchPrice1 = productsSocks[randomNumber][0].price;
                                    let fetchPrice2 = productsSocks[randomNumber][1].price;
                                    let fetchPrice3 = productsSocks[randomNumber][2].price;

                                    let fetchImage1 = productsSocks[randomNumber][0].imageTitle;
                                    let fetchImage2 = productsSocks[randomNumber][1].imageTitle;
                                    let fetchImage3 = productsSocks[randomNumber][2].imageTitle;

                                    let productsArray1 = [price13, fetchPrice1, image13, fetchImage1, productName13];
                                    let productsArray2 = [price14, fetchPrice2, image14, fetchImage2, productName13];
                                    let productsArray3 = [price15, fetchPrice3, image15, fetchImage3, productName13];

                                    populateProducts(productsArray1);
                                    populateProducts(productsArray2);
                                    populateProducts(productsArray3);
                                };
                                populateSocks();

                                function addLinks() {

                                    let fetchLink1 = productsSocks[randomNumber][0].link;
                                    let fetchLink2 = productsSocks[randomNumber][1].link;
                                    let fetchLink3 = productsSocks[randomNumber][2].link;

                                    image13.off("click");
                                    image14.off("click");
                                    image15.off("click");

                                    image13.click(function () {
                                        linkOut(fetchLink1);
                                    });
                                    image14.click(function () {
                                        linkOut(fetchLink2);
                                    });
                                    image15.click(function () {
                                        linkOut(fetchLink3);
                                    });
                                };
                                addLinks();

                                $("#refresh-square-5").click(function () {
                                    let randomNumber = refreshRandomNumber();
                                    populateSocks();
                                    addLinks();
                                });
                            }
                        }
                        changeClothesIconsAdditional();

                        // additional = umbrella
                        function changeClothesIconsAdditionalUmbrella() {
                            // if 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23 (no 24)
                            // if 25, 26 and 29
                            if ((iconNumber >= 12 && iconNumber <= 23) || [25, 26, 29].includes(iconNumber)) {
                                clothesIconAdditional.attr("src", "assets/images/clothes-icons/svg-icon-clothes-umbrella.svg");
                                clothesIconAdditionalText.text("Umbrella");

                                function populateUmbrella() {

                                    let fetchPrice1 = productsUmbrella[randomNumber][0].price;
                                    let fetchPrice2 = productsUmbrella[randomNumber][1].price;
                                    let fetchPrice3 = productsUmbrella[randomNumber][2].price;

                                    let fetchImage1 = productsUmbrella[randomNumber][0].imageTitle;
                                    let fetchImage2 = productsUmbrella[randomNumber][1].imageTitle;
                                    let fetchImage3 = productsUmbrella[randomNumber][2].imageTitle;

                                    let productsArray1 = [price13, fetchPrice1, image13, fetchImage1, productName14];
                                    let productsArray2 = [price14, fetchPrice2, image14, fetchImage2, productName14];
                                    let productsArray3 = [price15, fetchPrice3, image15, fetchImage3, productName14];

                                    populateProducts(productsArray1);
                                    populateProducts(productsArray2);
                                    populateProducts(productsArray3);
                                };
                                populateUmbrella();

                                function addLinks() {

                                    let fetchLink1 = productsUmbrella[randomNumber][0].link;
                                    let fetchLink2 = productsUmbrella[randomNumber][1].link;
                                    let fetchLink3 = productsUmbrella[randomNumber][2].link;

                                    image13.off("click");
                                    image14.off("click");
                                    image15.off("click");

                                    image13.click(function () {
                                        linkOut(fetchLink1);
                                    });
                                    image14.click(function () {
                                        linkOut(fetchLink2);
                                    });
                                    image15.click(function () {
                                        linkOut(fetchLink3);
                                    });
                                };
                                addLinks();

                                $("#refresh-square-5").click(function () {
                                    let randomNumber = refreshRandomNumber();
                                    populateUmbrella();
                                    addLinks();
                                });
                            }
                        }
                        changeClothesIconsAdditionalUmbrella();
                    }
                    changeClothesIcons();

                    // populate bags
                    function changeBags() {

                        function populateBags() {

                            let fetchPrice1 = productsBag[randomNumber][0].price;
                            let fetchPrice2 = productsBag[randomNumber][1].price;
                            let fetchPrice3 = productsBag[randomNumber][2].price;

                            let fetchImage1 = productsBag[randomNumber][0].imageTitle;
                            let fetchImage2 = productsBag[randomNumber][1].imageTitle;
                            let fetchImage3 = productsBag[randomNumber][2].imageTitle;

                            let productsArray1 = [price16, fetchPrice1, image16, fetchImage1, productName15];
                            let productsArray2 = [price17, fetchPrice2, image17, fetchImage2, productName15];
                            let productsArray3 = [price18, fetchPrice3, image18, fetchImage3, productName15];

                            populateProducts(productsArray1);
                            populateProducts(productsArray2);
                            populateProducts(productsArray3);
                        };
                        populateBags();

                        function addLinks() {

                            let fetchLink1 = productsBag[randomNumber][0].link;
                            let fetchLink2 = productsBag[randomNumber][1].link;
                            let fetchLink3 = productsBag[randomNumber][2].link;

                            image16.off("click");
                            image17.off("click");
                            image18.off("click");

                            image16.click(function () {
                                linkOut(fetchLink1);
                            });
                            image17.click(function () {
                                linkOut(fetchLink2);
                            });
                            image18.click(function () {
                                linkOut(fetchLink3);
                            });
                        };
                        addLinks();

                        $("#refresh-square-6").click(function () {
                            let randomNumber = refreshRandomNumber();
                            populateBags();
                            addLinks();
                        });
                    }
                    changeBags();

                    // populate accessories
                    function changeAccessories() {

                        function populateAccessories() {

                            let fetchPrice1 = productsAccessories[randomNumber][0].price;
                            let fetchPrice2 = productsAccessories[randomNumber][1].price;
                            let fetchPrice3 = productsAccessories[randomNumber][2].price;

                            let fetchImage1 = productsAccessories[randomNumber][0].imageTitle;
                            let fetchImage2 = productsAccessories[randomNumber][1].imageTitle;
                            let fetchImage3 = productsAccessories[randomNumber][2].imageTitle;

                            let productsArray1 = [price19, fetchPrice1, image19, fetchImage1, productName16];
                            let productsArray2 = [price20, fetchPrice2, image20, fetchImage2, productName16];
                            let productsArray3 = [price21, fetchPrice3, image21, fetchImage3, productName16];

                            populateProducts(productsArray1);
                            populateProducts(productsArray2);
                            populateProducts(productsArray3);
                        };
                        populateAccessories();

                        function addLinks() {

                            let fetchLink1 = productsAccessories[randomNumber][0].link;
                            let fetchLink2 = productsAccessories[randomNumber][1].link;
                            let fetchLink3 = productsAccessories[randomNumber][2].link;

                            image19.off("click");
                            image20.off("click");
                            image21.off("click");

                            image19.click(function () {
                                linkOut(fetchLink1);
                            });
                            image20.click(function () {
                                linkOut(fetchLink2);
                            });
                            image21.click(function () {
                                linkOut(fetchLink3);
                            });
                        };
                        addLinks();

                        $("#refresh-square-7").click(function () {
                            let randomNumber = refreshRandomNumber();
                            populateAccessories();
                            addLinks();
                        });
                    }
                    changeAccessories();

                })
                .catch(err => console.log(err));
        });
    }

    fetchWeatherData();

});