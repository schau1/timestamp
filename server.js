// Apply static middleware to serve index.html file without any routes
var express = require("express");
var path = require("path");
var app = express();
var json = {unix: 0, natural: 0};

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res){
    var timestamp = decodeURI(req.url.substr(1));    // grab the url of the request https://api-schau1.c9users.io/1450137600 would return /1450137600

    if (isUnixFormat(timestamp)){
        json.natural = ConvertUnixTimeToNatural(timestamp);
        json.unix = parseInt(timestamp);
    }
    else {
        var natural = isValidTimestamp(timestamp);
        
        if (natural == null){
            json.unix = null;
            json.natural = null;               
        }
        else{
            json.unix = natural.getTime()/1000;
            json.natural = MonthNumToString(natural.getMonth()) + ' ' + natural.getDate() + ', ' + natural.getFullYear();
        }
    }

    res.end(JSON.stringify(json));
});


console.log("Timestamp API service starting...")
app.listen(process.env.PORT || 8080) 
//app.listen(8080);    // always use 8080 for c9


function MonthNumToString(month){
    switch(month){
        case 11:
            return 'December';
        case 10:
            return 'November';
        case 9:
            return 'October';
        case 8:
            return 'September';
        case 7:
            return 'August';
        case 6:
            return 'July';
        case 5:
            return 'June';
        case 4:
            return 'May';
        case 3:
            return 'April';
        case 2:
            return 'March';
        case 1:
            return 'February';
        case 0:
            return 'January';
        default:
            return 'Invalid';
    }
}
function ConvertUnixTimeToNatural(timestamp){
    var date = new Date(timestamp*1000);
    var data = MonthNumToString(date.getMonth());
    data += ' ' + date.getDate() + ', ' + date.getFullYear();

    return data;
}

function isValidTimestamp(timestamp){
    var array = timestamp.split(',');

    if (array.length != 2){
        return null;
    }
    
    var year = array[1].trim();
    
    if (year.length == 2){
        year = '20' + year;
    }
    else if (array[1].trim().length == 1){
        year = '200' + year;
    }
    
    var token = array[0].search(/\d/gi);
    
    var day = array[0].slice(token).trim();

    var month = monthToIntMonth(array[0].slice(0, token).trim().toLocaleLowerCase());

    if (month == null) {
        // invalid month
        return null;
    }

    var date = new Date(year, month, day, 0, 0, 0, 0);

    return date;
}

function monthToIntMonth(month){
    switch(month){
    case 'december':
    case 'dec':
        return 11;
    case 'november':
    case 'nov':
        return 10;
    case 'october':
    case 'oct':
        return 9;
    case 'september':
    case 'sept':        
        return 8;
    case 'august':
    case 'aug':        
        return 7;
    case 'july':
        return 6;
    case 'june':
        return 5;
    case 'may':
        return 4;
    case 'april':
    case 'apr':        
        return 3;
    case 'march':
    case 'mar':        
        return 2;
    case 'february':
    case 'feb':        
        return 1;        
    case 'january':
    case 'jan':        
        return 0;
    default:
        return null;
    }
}

function isUnixFormat(timestamp){
    var reg = /^\d/gi;  // match any char except digit
    
    for (var i = 0; i < timestamp.length; i++){
        if (!timestamp[i].match(reg)){
            return false;
        }
    }
    
    return true;
}

