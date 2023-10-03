var skyScrapperAPIKey = 'ebacfa63aemsh6e8bd01d24f597bp1431b3jsnc70f88d61448'
var baseSkyScrapperURL = 'https://sky-scrapper.p.rapidapi.com/api/v1'
var locationInput = document.querySelector('#inputBox')
var searchBtn = document.querySelector('#button')
var APIKey = "09a37924adb28c1359f0c44a9ee1ddcb";

// Handles search for the city once clicked
function handleSearchClick() {
    var searchCity = locationInput.value
    console.log(searchCity)
    getCoordinates(searchCity);
}

function getCoordinates(city) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIKey}`)
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            var lat = data[0].lat
            var lon = data[0].lon
            getFlights(lat, lon)
        })
}


function getFlights(lat, lon) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': skyScrapperAPIKey,
            'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com'
        }
    };

    var skyScrapperURL = `${baseSkyScrapperURL}/flights/getNearByAirports?lat=${lat}&lng=${lon}`

    fetch(skyScrapperURL, options)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(data);

        });
}



searchBtn.addEventListener("click", handleSearchClick)