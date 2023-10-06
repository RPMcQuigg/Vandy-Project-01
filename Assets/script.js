var skyScrapperAPIKey = 'a4b83d6d95mshe13b75a0f2d76bcp168256jsn0fd961598dd0'
var baseSkyScrapperURL = 'https://sky-scrapper.p.rapidapi.com/api/v1/'
var searchBtn = document.querySelector('#button')
var baseSkyScrapperURL = 'https://sky-scrapper.p.rapidapi.com/api/v1'
var originInput = document.querySelector('#originInput')
var destinationInput = document.querySelector('#destinationInput')
var searchBtn = document.querySelector('#button')
var APIKey = "09a37924adb28c1359f0c44a9ee1ddcb";
var scrapper = document.getElementById('scrapper')
var originInfo
var destInfo

// Handles search for the city once clicked
async function handleSearchClick() {
    // console.log(locationInput)
    var originCity = originInput.value.trim()
    var destCity = destinationInput.value.trim()
    // console.log(originCity, destCity)
    var destCords = await getCoordinates(destCity)
    destInfo = await flightInfo(destCords.lat, destCords.lon)

    if (originCity == '') {
        navigator.geolocation.getCurrentPosition(success, showError)
    }
    else {
        var originCords = await getCoordinates(originCity);
        originInfo = await flightInfo(originCords.lat, originCords.lon)
        flightPrice(originInfo.skyId, destInfo.skyId);

    }
    // console.log(originCords)
    //information about the airport skyId and entityId



    getEventsSearch(destCity);

    // take origin info and destInfo and use them to get the flight data for the two locations
}

function showError(error) {
    var errMessage = "";

}



async function success(pos) {
    const crd = pos.coords;
    //Pass local latitude and longitude to api to get the current weather.
    originInfo = await flightInfo(crd.latitude, crd.longitude)
    flightPrice(originInfo.skyId, destInfo.skyId);

}

// Get lat and lon for input city
function getCoordinates(city) {
    try {
        return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIKey}`)
            .then(function (res) {
                return res.json()
            })
            .then(function (data) {
                // console.log(data)
                var lat = data[0].lat
                var lon = data[0].lon
                return { lat, lon }
                // flightInfo(lat, lon)
            })
    }
    catch (err) {
        console.log(err);
    };
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

    try {
        var FlightInfoURL = `${baseSkyScrapperURL}/flights/getNearByAirports?lat=${lat}&lng=${lon}`

        return fetch(FlightInfoURL, options)
            .then(function (response) {
                return response.json()
            })
            .then(function (data) {
                // console.log(data);
                return { skyId: data.data.current.skyId, entityId: data.data.current.entityId }
            });
    }
    catch (err) {
        console.log(err);
    };
}
// Get flight price information 
async function flightPrice(originSkyId, destSkyId) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': skyScrapperAPIKey,
            'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com'
        }
    };

    try {
        var flightPriceURL = `${baseSkyScrapperURL}/flights/getPriceCalendar?originSkyId=${originSkyId}&destinationSkyId=${destSkyId}&fromDate=2024-02-20`;

        const res = await fetch(flightPriceURL, options);

        const priceCalendarData = await res.json();

        console.log(priceCalendarData);

        displayFlightInfo(priceCalendarData.data.flights.days);

    } catch (err) {
        console.log(err);
    };
};


// Display flight information
function displayFlightInfo(flightCalendarArr) {
    flightCalendarArr.forEach(function (dayObj) {
        console.log(dayObj.price);
    });
}





var getEventsSearch = async function (city) {
    const eventsAPIKey = "KRxYIgVel9CyKuLI2MUA6RETp7Q3HXxl";
    const eventsAPIBaseUrl = "https://app.ticketmaster.com/discovery/v2/";
    const eventsAPISearchURL = "events.json";
    var eventSearchParams = `? apikey = ${eventsAPIKey}& city=${city}& size=20 & sort=date, asc`
    var apiUrl = eventsAPIBaseUrl + eventsAPISearchURL + eventSearchParams;
    console.log(apiUrl);

    try {
        //Dynamically add events to the list. The function takes: tag type, image source (if applicable), id, id suffix, 
        //mouse over action, mouse out action, cursor style, class, and text content.
        //addEventList(tagType, imgSrc, id, idSuffix, mouseOver, mouseOut, cursorStyle, classType, contentVal)
        const res = await fetch(apiUrl);
        const data = await res.json();
        var imgWidth;
        var imgHeight;
        var mouseActionUnderline = "this.style.textDecoration='underline'";
        var mouseActionNone = "this.style.textDecoration='none'";
        var tagP = "<p>";

        if (window.screen.height <= 900) {
            //min image size to display
            imgWidth = 100;
            imgHeight = 56;
        }
        else {
            //max image size to display
            imgWidth = 205;
            imgHeight = 115;
        }

        for (var i = 0; i <= data._embedded.events.length; i++) {
            //add the event venue(s)
            for (v = 0; v < data._embedded.events[i]._embedded.venues.length; v++) {
                addEventList(tagP, "", "events-list", data._embedded.events[i].id, "V", mouseActionUnderline,
                    mouseActionNone, "cursor: pointer", data._embedded.events[i]._embedded.venues[v].name);
            }

            //add the event date
            addEventList(tagP, "", "events-list", data._embedded.events[i].id, "D", mouseActionUnderline,
                mouseActionNone, "cursor: pointer", eventDate);

            //add the event name
            addEventList(tagP, "", "events-list", data._embedded.events[i].id, "N", mouseActionUnderline,
                mouseActionNone, "cursor: pointer", data._embedded.events[i].name);
            var localEventDate = data._embedded.events[i].dates.start.localDate;
            var localEventTime = data._embedded.events[i].dates.start.localTime;
            var eventDate = dayjs(localEventDate + " " + localEventTime).format("MM/DD/YYYY  h:mm a");

            //add the event image. multiple images available so loop through to get correct size
            for (var m = 0; m < data._embedded.events[i].images.length; m++) {
                if (data._embedded.events[i].images[m].width == imgWidth && data._embedded.events[i].images[m].height == imgHeight) {
                    addEventList('<img>', data._embedded.events[i].images[m].url);
                    break;
                }
            }
        }
    }
    catch (err) {
        console.log(err);
    };

};

function addEventList(tagType, imgSrc, classType, id, idSuffix, mouseOver, mouseOut, cursorStyle, contentVal) {
    var newLi = $("<li>")
    var newTag = $(tagType);

    if (tagType == "<img>") {
        newTag.attr("src", imgSrc);
    }
    else {
        console.log("other");
        newTag.attr("id", id + idSuffix);
        newTag.attr("onmouseover", mouseOver)
        newTag.attr("onmouseout", mouseOut)
        newTag.attr("style", cursorStyle)
        newTag.addClass(classType);
        newTag.text(contentVal);
    }

    newLi.append(newTag)
    $("#eventsList").prepend(newLi);
    if (!tagType == "<img>") {
        $("#" + id).on("click", function () {
            console.log("Clicked event" + tagType + " " + id);
        });
    }
}

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