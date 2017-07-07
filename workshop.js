"use strict";
var request = require('request-promise');

// Euclidian distance between two points
function getDistance(pos1, pos2) {
  return Math.sqrt(Math.pow(pos1.lat - pos2.lat, 2) + Math.pow(pos1.lng - pos2.lng, 2));
}

function getIssPosition() {
  return request("http://api.open-notify.org/iss-now.json")
  .then(
    function(response) {
      // Parse as JSON
      var result = JSON.parse(response);
      // Return object with lat and lng
      var issPos = {
        "lat": result.iss_position.latitude,
        "lng": result.iss_position.longitude
      }
      console.log("issPos=", issPos);
      return issPos;
    }
  )
}

getIssPosition();

function getAddressPosition(address) {
  var formattedAddress = address.replace(/ /g,"+");
  return request("https://maps.googleapis.com/maps/api/geocode/json?address="+formattedAddress+"&key=AIzaSyBAvoEOV4XMBZSjzSli-IGgshL9uNeqqjs")
  .then(
    function(response) {
      var result = JSON.parse(response);
      console.log("Query=",formattedAddress);
      //var results = result.results[0];
      //var geometry = results;
      //console.log("Geometry=",geometry);

      var address = {
        "lat" : result.results[0].geometry.location.lat,
        "lng" : result.results[0].geometry.location.lng
      }
      console.log("address=",address);
      return address;
    }
  )
}

getAddressPosition("1907 Maurice-Lebel, Montreal, Quebec");
//getAddressPosition("1600+Amphitheatre+Parkway,+Mountain+View,+CA");

function getCurrentTemperatureAtPosition(position) {

}

function getCurrentTemperature(address) {

}

function getDistanceFromIss(address) {

}