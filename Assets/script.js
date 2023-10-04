var skyScrapperAPIKey = 'ebacfa63aemsh6e8bd01d24f597bp1431b3jsnc70f88d61448'
var baseSkyScrapperURL = 'https://sky-scrapper.p.rapidapi.com/api/v1/'
var searchBtn = document.querySelector('#button')
var baseSkyScrapperURL = 'https://sky-scrapper.p.rapidapi.com/api/v1'
var originInput = document.querySelector('#originInput')
var destinationInput = document.querySelector('#destinationInput')
var searchBtn = document.querySelector('#button')
var APIKey = "09a37924adb28c1359f0c44a9ee1ddcb";
var scrapper = document.getElementById('scrapper')


// Handles search for the city once clicked
async function handleSearchClick() {
    // console.log(locationInput)
    var originCity = originInput.value.trim()
    var destCity = destinationInput.value.trim()
    console.log(originCity, destCity)

    var originCords = await getCoordinates(originCity);
    var destCords = await getCoordinates(destCity)
    console.log(originCords)
    //information about the airport skyId and entityId
    var originInfo = await flightInfo(originCords.lat, originCords.lon)
    var destInfo = await flightInfo(destCords.lat, destCords.lon)

    // take origin info and destInfo and use them to get the flight data for the two locations
}
// Get lat and lon for input city
function getCoordinates(city) {
    return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIKey}`)
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            console.log(data)
            var lat = data[0].lat
            var lon = data[0].lon
            console.log(lat, lon)
            return { lat, lon }
            // flightInfo(lat, lon)
        })
}

// Get flight parameters
function flightInfo(lat, lon) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': skyScrapperAPIKey,
            'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com'
        }
    };


    var FlightInfoURL = `${baseSkyScrapperURL}/flights/getNearByAirports?lat=${lat}&lng=${lon}`

    return fetch(FlightInfoURL, options)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(data);
            return { skyId: data.data.current.skyId, entityId: data.data.current.entityId }
        });
}

//Display flight information
function displayFlightInfo(obj) {
    scrapper.textContent = obj.data.current.skyId
    console.log(obj.data.current.skyId)

}
// function flightPrice() {

//     const options = {
//         method: 'GET',
//         params: {
//             originSkyId: '',
//             destinationSkyId: '',
//             fromDate: '2024-02-20'
//         },
//         headers: {
//             'X-RapidAPI-Key': skyScrapperAPIKey
//             'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com'
//         }
//     };

//     var skyScrapperPriceURL = `${baseSkyScrapperURL} flights/getPriceCalendar'

// }



searchBtn.addEventListener("click", handleSearchClick)


// Record searches
function recordSearch() {
    const searchInput = document.getElementById("originInput");
    const recentSearches = JSON.parse(localStorage.getItem("prevSearches")) || [];
    const searchTerm = originInput.value.trim();

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
