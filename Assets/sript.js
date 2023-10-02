var skyScrapperAPIKey = 'ebacfa63aemsh6e8bd01d24f597bp1431b3jsnc70f88d61448'
var baseSkyScrapperURL = 'https://sky-scrapper.p.rapidapi.com/api/v1/'
var locationInput = document.querySelector('#searchbox')
var searchBtn = document.querySelector('#button')
var lat;
var lon;

// Handles search for the city once clicked
function handleSearchClick() {
    var searchCity = locationInput.value
    console.log('hit')
    getFlights()
}



function getFlights() {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': skyScrapperAPIKey,
            'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com'
        }
    };

    var skyScrapperURL = `${baseSkyScrapperURL}/findAirport?lat=${lat}&lon=${lon}`

    fetch(skyScrapperURL, options)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(data);
        });
}



searchBtn.addEventListener("click", handleSearchClick)