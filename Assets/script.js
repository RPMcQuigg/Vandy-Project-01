var skyScrapperAPIKey = 'ebacfa63aemsh6e8bd01d24f597bp1431b3jsnc70f88d61448'
    <<<<<<<< < Temporary merge branch 1
var baseSkyScrapperURL = 'https://sky-scrapper.p.rapidapi.com/api/v1/'
var locationInput = document.querySelector('#searchbox')
var searchBtn = document.querySelector('#button')
var lat;
var lon;
=========
var baseSkyScrapperURL = 'https://sky-scrapper.p.rapidapi.com/api/v1'
var locationInput = document.querySelector('#inputBox')
var searchBtn = document.querySelector('#button')
var APIKey = "09a37924adb28c1359f0c44a9ee1ddcb";

// Handles search for the city once clicked
function handleSearchClick() {
    console.log(locationInput)
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
            console.log(data)
            var lat = data[0].lat
            var lon = data[0].lon
            console.log(lat, lon)
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


// Record searches
function recordSearch() {
    const searchInput = document.getElementById("inputBox");
    const recentSearches = JSON.parse(localStorage.getItem("prevSearches")) || [];
    const searchTerm = searchInput.value.trim();

    if (searchTerm !== "") {
        recentSearches.unshift(searchTerm);

        if (recentSearches.length > 5) {
            recentSearches.pop();
        }

        localStorage.setItem("prevSearches", JSON.stringify(recentSearches));

        displayRecentSearches();
    }

    searchInput.value = "";
}

// Display recent searches
function displayRecentSearches() {
    const recentSearches = JSON.parse(localStorage.getItem("prevSearches")) || [];
    const recentSearchesList = document.getElementById("prevSearches");

    recentSearchesList.innerHTML = "";

    for (const search of recentSearches) {
        const listItem = document.createElement("li");
        listItem.textContent = search;
        recentSearchesList.appendChild(listItem);
    }
}

// Calls displayRecentSearches to load any previously made searches from local storage
displayRecentSearches();

// Add an event listener to the search button to trigger the recordSearch function
const searchButton = document.getElementById("button");
searchButton.addEventListener("click", recordSearch);
