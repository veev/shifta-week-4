const fs = require('fs');

const text = fs.readFileSync('./data/time-machine.txt', 'utf-8');
//console.log(text.length);

const textArray = text.split("***");

//textArray.forEach( t => console.log(t.length));

const book = textArray[2];

const fileInfo = {};

fileInfo['author'] = "H. G. Wells";
fileInfo.title = 'The Time Machine';
fileInfo.text = book;

fs.writeFileSync('./data/time-machine.json', JSON.stringify(fileInfo), 'utf-8');