


//Setting up nodes
var containerNode = document.querySelector('.weatherContainer')
var currentButtonNode = document.querySelector('.currentButton')
var hourlyButtonNode = document.querySelector('.hourlyButton')
var dailyButtonNode = document.querySelector('.dailyButton')
var searchNode = document.querySelector('.citySearch')


//Sets initial hashstring
var handleCoords = function(coordsObj) {
	var lat = coordsObj.coords.latitude
	var lng = coordsObj.coords.longitude
	var hashString = lat + '/' + lng + '/current'
	location.hash = hashString 
}
function handleError(err) {
	console.log('You dun goofed, son!', err)
}



//Different pages to be called upon after changes to hash string
var handleCurrent = function(weatherObj) {
	console.log(weatherObj);
	var currentHtml = ''
	currentHtml += '<div class="box">'
	currentHtml += '<h2 class="selectorTitle">Current Weather: </h2>'
	currentHtml += '<p class="time">Time: ' + weatherObj.currently.time + '</p>'
	currentHtml += '<p class="summary">Conditions: ' + weatherObj.currently.summary + '</p>'
	currentHtml += '<p class="rainChance">Chance of rain: ' + weatherObj.currently.precipProbability * 100 + '%</p>'
	currentHtml += '<p class="temp">Temperature: ' + Math.round(weatherObj.currently.temperature) + ' F</p>' 
	currentHtml += '<p class="humidity">Humidity: ' + weatherObj.currently.humidity  * 100 + '%</p>'
	currentHtml += '<p class="wind">Wind speed: ' + Math.round(weatherObj.currently.windSpeed) + ' MPH</p>'
	currentHtml += '</div>'
	containerNode.innerHTML = currentHtml
}

var handleSingleHour = function(hourObj) {
	var oneHourHtml = ''
	oneHourHtml += '<div class="box">'
	oneHourHtml += '<p class="time">Time: ' + hourObj.time + '</p>'
	oneHourHtml += '<p class="summary">Conditions: ' + hourObj.summary + '</p>'
	oneHourHtml += '<p class="rainChance">Chance of rain: ' + hourObj.precipProbability * 100 + '%</p>'
	oneHourHtml += '<p class="temp">Temperature: ' + Math.round(hourObj.temperature) + ' F</p>' 
	oneHourHtml += '<p class="humidity">Humidity: ' + hourObj.humidity  * 100 + '%</p>'
	oneHourHtml += '<p class="wind">Wind speed: ' + Math.round(hourObj.windSpeed) + ' MPH</p>'
	oneHourHtml += '</div>'
	return oneHourHtml
}

var handleHourly = function(weatherObj) {
	var hourlyHtml = ''
	hourlyHtml += '<h2 class="selectorTitle">Hourly Forecast: </h2>'
	for (i = 0; i < weatherObj.hourly.data.length; i++) {
		hourlyHtml += handleSingleHour(weatherObj.hourly.data[i])
	}
	containerNode.innerHTML = hourlyHtml
}

var handleSingleDay = function(dayObj) {
	var oneDayHtml = ''
	oneDayHtml += '<div class="box">'
	oneDayHtml += '<p class="time">Time: ' + dayObj.time + '</p>'
	oneDayHtml += '<p class="summary">Conditions: ' + dayObj.summary + '</p>'
	oneDayHtml += '<p class="rainChance">Chance of rain: ' + dayObj.precipProbability * 100 + '%</p>'
	oneDayHtml += '<p class="temp">Average temperature: ' + Math.round((dayObj.temperatureMin + dayObj.temperatureMax)/2) + ' F</p>' 
	oneDayHtml += '<p class="humidity">Humidity: ' + dayObj.humidity  * 100 + '%</p>'
	oneDayHtml += '<p class="wind">Wind speed: ' + Math.round(dayObj.windSpeed) + ' MPH</p>'
	oneDayHtml += '</div>'
	return oneDayHtml
}

var handleDaily = function(weatherObj) {
	var dailyHtml = ''
	dailyHtml += '<h2 class="selectorTitle">Daily Forecast: </h2>'
	for (i = 0; i < weatherObj.daily.data.length; i++) {
		dailyHtml += handleSingleDay(weatherObj.daily.data[i])
	}
	containerNode.innerHTML = dailyHtml
}

//Sets API url and promise

var weatherUrl = 'https://api.darksky.net/forecast/c996138631cd2470df9cd6aee867f8dc/'


//Router calls up different pages based on hashstring
var pageRouter = Backbone.Router.extend({
	routes: {
		':lat/:lon/current': 'goToCurrent',
		':lat/:lon/hourly': 'goToHourly',
		':lat/:lon/daily': 'goToDaily',
		'/*' : 'getCurrentCoords'
	},
	goToCurrent: function(lat, lon) {
		console.log('getting weather')
		console.log(weatherPromise)
		var weatherPromise = $.getJSON(weatherUrl + lat +','+ lon + '?callback=?')
		weatherPromise.then(handleCurrent)
	},
	goToHourly: function(lat,lon) {
		var weatherPromise = $.getJSON(weatherUrl + lat +','+ lon + '?callback=?')
		weatherPromise.then(handleHourly)
	},
	goToDaily: function(lat,lon) {
		var weatherPromise = $.getJSON(weatherUrl + lat +','+ lon + '?callback=?')
		weatherPromise.then(handleDaily)
	},
	getCurrentCoords : function() {
	console.log('getting current coords');
		navigator.geolocation.getCurrentPosition(handleCoords, handleError)
	}
})

//Change hash string upon clicks. Called upon by event listeners below
var clickCurrent = function() {
	var hashStr = location.hash.substr(1)
    var hashParts = hashStr.split('/')
	location.hash = hashParts[0] + '/' + hashParts[1] + '/' + 'current'
}
var clickHourly = function() {
	var hashStr = location.hash.substr(1)
    var hashParts = hashStr.split('/')
	location.hash = hashParts[0] + '/' + hashParts[1] + '/' + 'hourly'
}
var clickDaily = function() {
	var hashStr = location.hash.substr(1)
    var hashParts = hashStr.split('/')
	location.hash = hashParts[0] + '/' + hashParts[1] + '/' + 'daily'
}
currentButtonNode.addEventListener('click', clickCurrent)
hourlyButtonNode.addEventListener('click', clickHourly)
dailyButtonNode.addEventListener('click', clickDaily)



var rtr = new pageRouter();

//Start listening for hash changes
Backbone.history.start()

