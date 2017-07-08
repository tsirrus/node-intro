'use strict';
var request = require('request-promise');
var inquirer = require('inquirer');

function requestRandomWord(dictionaryDefFlag,minLength, maxLength){
    var requestURL = 'http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef='+dictionaryDefFlag;
    requestURL += '&minLength='+minLength;
    requestURL += '&maxLength='+maxLength;
    requestURL += '&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
    
    //console.log("requestedURL=",requestURL); //Test
    
    return request(requestURL)
    .then(function (response){
        var result = JSON.parse(response);
        //console.log('Random word is:',result.word); //Test
        return result.word;
    })
    .catch(function(error) {
        console.error('Oops, something went wrong in the dictionary-dive, try again!');
    });
}

//requestRandomWord(true,5,-1);  //Test

function queryChoice(tries) {
    var questionChoice = [{
        type: 'list',
        name: 'choice',
        message: 'You have ' + tries + ' tries left. Pick a letter or guess the word?',
        choices: ['Letter', 'Word']
    }];
    
    return inquirer.prompt(questionChoice)
    .then(function (answer) {
        return answer.choice;
    });
}

function queryLetter(pickedArray) {
    var questionLetter = [{
        type: 'input',
        name: 'letter',
        message: 'What is your letter?',
        validate: function (value) {
            //console.log('value=',value); //Test
            var lettersPicked = value.match(/[a-zA-Z]+/);
            console.log('lettersPicked=',lettersPicked); //Test
            var letterPicked = lettersPicked[0][0].toLowerCase();
            console.log('letterpicked=',letterPicked);
            if(letterPicked.length > 0) {
                for (var i in pickedArray) {
                    if (letterPicked === pickedArray[i]) {
                        return 'You already picked ' + letterPicked + ', pick another letter';
                    }
                }
                console.log('You picked',letterPicked);
                return true;
            }
            else {
                return 'Please pick a valid letter';
            }
        }
    }];
    
    return inquirer.prompt(questionLetter)
    .then(function (answer) {
        //console.log('Letter-pickedLetter=', pickedLetter); //Test
        //var theLetter = pickedLetter.letter;
        return answer.letter;
    });
}

function queryWord (pickedArray) {
    var questionWord = [{
        type: 'input',
        name: 'word',
        message: 'What is your word?',
        validate: function (value) {
            //console.log('value=',value); //Test
            var wordPicked = value.match(/[a-zA-Z]+/);
            console.log('wordPicked=',wordPicked);
            if(wordPicked[0].length > 0) {
                var lowerCasedWordPicked = wordPicked[0].toLowerCase();
                console.log('You guessed the word', lowerCasedWordPicked);
                return true;
            }
            else {
                return 'Guess a valid word';
            }
        }
    }];
    
    return inquirer.prompt(questionWord)
    .then(function (answer) {
        return answer.word;
    });
}

function runHangman(tries, answer, pickedArray) {
    //console.log('tries=',tries); //Test
    console.log('answer=',answer); //Test
    console.log('pickedArray=',pickedArray); //Test
    
    var triesLeft = tries;

    var questionWord = [{
        type: 'input',
        name: 'word',
        message: 'What is your word?',
        validate: function (value) {
            //console.log('value=',value); //Test
            var wordPicked = value.match(/[a-zA-Z]+/);
            console.log('wordPicked=',wordPicked);
            if(wordPicked[0].length > 0) {
                var lowerCasedWordPicked = wordPicked[0].toLowerCase();
                console.log('You guessed the word', lowerCasedWordPicked);
                return true;
            }
            else {
                return 'Guess a valid word';
            }
        }
    }];
    
    return queryChoice(tries)
    .then(function (pickedChoice) {
        console.log('pickedChoice=',pickedChoice);
        if (pickedChoice === 'Letter') {
            return queryLetter(pickedArray)
            .then(function (pickedLetter) {
                //console.log('Letter-pickedLetter=', pickedLetter); //Test
                if (answer.match(pickedLetter)) {
                    console.log('The word does contain the letter', pickedLetter);
                }
                else {
                    console.log('The word does NOT contain the letter', pickedLetter);
                    triesLeft --;
                }
                pickedArray.push(pickedLetter);
                return runHangman(triesLeft, answer, pickedArray); //The recurse!
            });
        }
        else {
            return queryWord(pickedArray)
            .then(function (pickedWord) {
                if (answer === pickedWord) {
                    console.log('Congrats! you correctly guessed the word', pickedWord);
                    return true;
                }
                else {
                    console.log('Sorry, the word is not', pickedWord);
                    triesLeft --;
                }
                pickedArray.push(pickedWord);
                return runHangman(triesLeft, answer, pickedArray); //The recurse!
            });
        }
    });
}

function main(){
    var pickedArray = [];

    return requestRandomWord(true,5,-1)
    .then (function (answer) {
        return runHangman(8, answer, pickedArray);
    });
}

main();