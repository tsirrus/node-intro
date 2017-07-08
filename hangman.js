"use strict";
var request = require('request-promise');
var inquirer = require('inquirer');

function requestRandomWord(dictionaryDefFlag,minLength, maxLength){
    var requestURL = "http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef="+dictionaryDefFlag;
    requestURL += "&minLength="+minLength;
    requestURL += "&maxLength="+maxLength;
    requestURL += "&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
    
    //console.log("requestedURL=",requestURL); //Test
    
    request(requestURL)
    .then(function (response){
        var result = JSON.parse(response);
        console.log("Random word is:",result.word); //Test
        return result.word;
    });
}

requestRandomWord(true,5,-1);  //Test

function questionUser(questionArray) {
    return inquirer.prompt(questionArray)
    .then(function( response ) {
        return response;
    })
    .catch(function(error) {
        console.error("Oops, something went wrong in the dictionary-dive, try again!");
    });
}

function runHangman(tries, answer) {
    return runHangman(tries-1,answer); //The recurse!
}

function main(){
    var answer = "test";
    
    runHangman(answer);
}