var searchBtn = document.querySelector('#button')
var destinationInput = document.querySelector('#destinationInput')
var weatherAPIKey = "09a37924adb28c1359f0c44a9ee1ddcb";
var scrapper = document.getElementById('scrapper')
var searchBtn2 = document.querySelector('#button2')

function init() {
    // Add an event listener to search button to kick off searches and trigger recordSearch function
    searchBtn.addEventListener("click", function () {
        handleSearchClick();
    });
    searchBtn2.addEventListener("click", function () {
        handleSearchClick();
    });

    //Simulate pushing the search button when the Enter key is pushed inside the destination input box
    $("#destinationInput").keyup(function (event) {
        if (event.keyCode === 13) {
            searchBtn.click();
        }
    });

    //Simulate pushing the search button when the Enter key is pushed inside the keyword input box
    $("#eventsKeywordInput").keyup(function (event) {
        if (event.keyCode === 13) {
            searchBtn2.click();
        }
    });

    checkLocalStorage();
}

// Handles search for the city once clicked
async function handleSearchClick() {
    var destCity = destinationInput.value.trim()
    if (!destCity == "") {
        getCoordinates(destCity);
        getEventsSearch(destCity);
        saveToLocalStorage(destCity);
    }
    else {
        //Give the user a message telling them to enter a destination city.
        informUser("Enter a destination city.");
    }
}

function informUser(msg) {
    // Get the modal
    var modal = document.getElementById("msgModal");
    var span = document.getElementsByClassName("close")[0];
    var msg = $("#informMessage").text(msg);
    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
function showError(error) {
    //add modal to pop message to user saying there is no origin city
    informUser("Enter a starting city.");
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
        return fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${weatherAPIKey}`)
            .then(function (res) {
                return res.json()
            })
            .then(function (data) {
                var lat = data[0].lat
                var lon = data[0].lon
                getForecast(lat, lon)
            })
    }
    catch (err) {
        console.log(err);
    };
}

function getForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherAPIKey}&units=imperial`)
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            displayForecast(data)
        })
}

function displayForecast(data) {
    var displayForecastWeather = document.querySelector('#display-forecast')
    //Clear out any child elements added in previous searches
    deletePreviousElements("display-forecast");

    for (let i = 0; i < 40; i += 8) {
        var dayData = data.list[i];
        var dateFormat = dayjs(dayData.dt_txt).format('MM-DD-YYYY')
        var divEl = document.createElement("div");
        var inner = `
        <div>
        <p>${dateFormat}</p>
        <p>Temp: ${dayData.main.temp} F</p>
        <p>Wind: ${dayData.wind.speed} MPH</p>
        <p>Humidty: ${dayData.main.humidity} %</P> 
        <div>
        `

        divEl.innerHTML = inner

        displayForecastWeather.appendChild(divEl);

    }
}

function deletePreviousElements(eleId) {
    var node = document.getElementById(eleId);
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}


var getEventsSearch = async function (city) {
    const eventsAPIKey = "KRxYIgVel9CyKuLI2MUA6RETp7Q3HXxl";
    const eventsAPIBaseUrl = "https://app.ticketmaster.com/discovery/v2/events.json";
    //URL for api cannot have spaces so replace any spaces in the city name with underscores
    var cityMod = city.replace(" ", "_");
    //Sort by date then name ascending. Limit events returned to 60.
    var eventSearchParams = `?apikey=${eventsAPIKey}&size=60&sort=date,name,asc`;
    eventSearchParams = !cityMod == "" ? eventSearchParams + `&city=${cityMod}` : eventSearchParams;
    //append the keyword(s) to the url if they are present
    var evtKeyword = document.getElementById("eventsKeywordInput").value.trim();
    eventSearchParams = !evtKeyword == "" ? eventSearchParams + `&keyword=${evtKeyword}` : eventSearchParams;
    var apiUrl = eventsAPIBaseUrl + eventSearchParams;
    //Clear out any child elements added in previous searches
    deletePreviousElements("eventsList");

    try {
        //Dynamically add events to the list. The function takes: parent div, tag type, image source (if applicable), id, 
        //id suffix, class, and text content.
        //addEventList(parentDiv, tagType, imgSrc, id, idSuffix, classType, contentVal)
        const res = await fetch(apiUrl);
        const data = await res.json();
        //max image size to display
        var imgWidth = 205;
        var imgHeight = 115;
        var tagP = "<p>";
        var newBlockRow;

        if (window.screen.height <= 900) {
            //min image size to display
            imgWidth = 100;
            imgHeight = 56;
        }

        //Skip adding html elements if no event returned
        if (data.page.totalPages >> 0) {
            for (var i = 0; i < data._embedded.events.length; i++) {
                var id = data._embedded.events[i].id;
                newBlockRow = $("<div>")
                //Add so row can be clickable.
                var newLinkRow = $("<a>")
                newLinkRow.attr("id", id);

                newLinkRow.addClass(`grid grid-cols-11 grid-rows-3 grid-flow-col gap-2 border-2 border-solid border-black`);
                //add the event image. multiple images available so loop through to get correct size
                for (var m = 0; m < data._embedded.events[i].images.length; m++) {
                    if (data._embedded.events[i].images[m].width == imgWidth && data._embedded.events[i].images[m].height == imgHeight) {
                        addEventList(newLinkRow, '<div>', data._embedded.events[i].images[m].url, "row-span-3 col-span-1 max-w-full", "backgroundimage", "");
                        break;
                    }
                }

                //add the event name
                addEventList(newLinkRow, tagP, "", "col-span-8", id, "N", data._embedded.events[i].name);

                //add the event date
                var localEventDate = dayjs(data._embedded.events[i].dates.start.localDate).format("MM/DD/YYYY");
                var localEventTime = data._embedded.events[i].dates.start.localTime;
                //if the time isn't passed in the response only display the date
                var eventDate = localEventTime == null ? localEventDate : dayjs(localEventDate + " " + localEventTime).format("MM/DD/YYYY  h:mm a");

                addEventList(newLinkRow, tagP, "", "col-span-8", id, "D", eventDate);

                //add the event venue(s)
                for (v = 0; v < data._embedded.events[i]._embedded.venues.length; v++) {
                    addEventList(newLinkRow, tagP, "", "col-span-8", id, "V", data._embedded.events[i]._embedded.venues[v].name);
                }

                $(newBlockRow).append(newLinkRow);
                $("#eventsList").append(newBlockRow);
                //Adds the url to the clickable row
                document.getElementById(id).href = data._embedded.events[i].url;
                //Opens the link in a new tab
                document.getElementById(id).target = "_blank";
            }
        }
        else {
            newBlockRow = $("<h1>")
            newBlockRow.attr("id", "no-events");
            newBlockRow.text("No events found");
            $("#eventsList").prepend(newBlockRow);
        }
    }
    catch (err) {
        console.log(err);
    };
};

function addEventList(parentDiv, tagType, url, classType, id, idSuffix, contentVal) {
    var newTag = $(tagType);

    if (tagType == "<img>") {
        newTag.attr("id", id);
        newTag.attr("src", url);
        newTag.addClass(classType);
    }
    else {
        newTag.attr("id", id + idSuffix);
        if (!url == "") {
            newTag.attr("style", `background-image: url(\'${url}\')`)
        }
        newTag.addClass(classType);
        newTag.text(contentVal);
    }

    parentDiv.append(newTag)
}

// Function to get data store in local storage 
function checkLocalStorage() {
    //get the data from local storage
    var storedData = localStorage.getItem('prevSearches');
    var dataArray = [];
    if (storedData) {
        //if there is data in local storage, trim the data then parse it into an array
        storedData.trim();
        dataArray = storedData.split(',');

        //for each city in the array create a search link
        for (var i = 0; i < dataArray.length; i++) {
            createRecentSearchLink(dataArray[i]);
        }
    }
}

// Function to Set data in Local storage
function saveToLocalStorage(city) {
    event.preventDefault();
    var data = localStorage.getItem('prevSearches');
    if (data) {
        //If there is data in local storage check if the just searched for city is already
        //included in that data. If not, add the city to the list.
        if (data.indexOf(city) === -1) {
            data = data + ',' + city;
            localStorage.setItem('prevSearches', data);
            createRecentSearchLink(city);
        }
    }
    else {
        //If there is no data in local storage, add it.
        data = city;
        localStorage.setItem('prevSearches', data);
    }
}

function createRecentSearchLink(city) {
    var newLi = $("<li>")
    var newP = $('<p>');
    newP.attr('id', 'pastCity');
    newP.attr("onmouseover", "this.style.textDecoration='underline'")
    newP.attr("onmouseout", "this.style.textDecoration='none'")
    newP.attr("style", "cursor: pointer")
    newP.addClass("listSearches");
    newP.text(city);
    newLi.append(newP)
    $("#prevSearches").prepend(newLi);
    $("#pastCity").on("click", function () {
        var newCity = $(this).text();
        getCoordinates(newCity);
        getEventsSearch(newCity);
    });
}

init();
