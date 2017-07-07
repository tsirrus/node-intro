"use strict";
var request = require('request-promise');
var inquirer = require('inquirer');

function guessTheNumber(tries, answer){
    var hiddenNumber;
    if (answer === undefined) {
        hiddenNumber = Math.ceil(Math.random() * 100); //Numbers from 1 to 100
    }
    else {
        hiddenNumber = answer;
    }
    //console.log(hiddenNumber); //test
    
    if (tries === 0) {
        console.log("Out of tries, too bad!");
        return false;
    }
    
    
    var question = [{
        type: "input",
        name: "number",
        message: "Guess the number between 1 and 100, you have " + tries + " tries left.",
        validate: function(value) {
            if(isFinite(value) && parseInt(value,10)) {
                if (value >= 1 && value <= 100) {
                    return true;
                }
                else {
                    return "Number must be between 1 and 100";
                }
            } else {
                return 'Please enter a valid number between 1 and 100';
            }
        },
        default: 0
    }];
    
    return inquirer.prompt(question)
    .then(function( response ) {
    // Use user feedback for... whatever!!
        var pickedNumber = response.number;
        if (response.number % 1 !== 0) {
            pickedNumber = Math.round(response.number);
            console.log ("Rounding your number to ", pickedNumber);
        }
        else {
            console.log ("You picked ", pickedNumber);
        }
        
        //var test = "Validating: " + pickedNumber + "=" + hiddenNumber + " is " + (hiddenNumber == pickedNumber);  //test
        //console.log(test); //test
        
        if (pickedNumber == hiddenNumber) {
            console.log("You picked correctly!");
            return pickedNumber;
        }
        else if (pickedNumber > hiddenNumber) {
            console.log("Your number is too high");
        }
        else if (pickedNumber < hiddenNumber) {
            console.log("Your number is too low");
        }
        
        return guessTheNumber(tries-1, hiddenNumber);
    });

}

guessTheNumber(5);