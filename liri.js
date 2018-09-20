//require our keys js
//&
//require 3rd party packages.
require("dotenv").config();
const fs = require('fs');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var request = require("request");
var moment = require("moment");

function getLiri(n,name) {
    var fn;
    var func = {
        'concert-this': function () {
            //do something with url and utilize var name.
            //"https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
            //use moment.js to format date for event date.
            term = encodeURIComponent(name.trim());
            var qurl = "https://rest.bandsintown.com/artists/" + term + "/events?app_id=codingbootcamp";
            console.log(qurl);
            request(qurl, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    //console.log(body)
                    var data = JSON.parse(body);
                    //formating for venue data and such.
                    console.log("==========Results==========" + "\n")
                    for (i = 0; i < 4; i++) {
                        console.log("Venue: " + data[i].venue.name + "\n" + "Location: " + data[i].venue.city + "," + data[i].venue.region + "," + data[i].venue.country + "\n" + "Date: " + moment(data[i].datetime).format('MM-DD-YYYY') + "\n");
                    }
                }
                else {
                    console.log("Failure on bandsintown API.")
                }
            });
        },
        'spotify-this-song': function () {
            //do something with url and utilize var name
            if (name) {
                spotify.search({ type: 'track', query: name }, function (err, data) {
                    if (err) {
                        return console.log('Error occurred: ' + err);
                    }
                    //formating for this area as well.
                    var index = data.tracks.items;
                    console.log("==========Results==========" + "\n")
                    for (var i = 0; i < 4; i++) {
                        console.log("Artist: " + index[i].artists[0].name + "\n" + "Title: " + index[i].name + "\n" + "Album: " + index[i].album.name + "\n" + "Preview Url: " + index[i].preview_url + "\n");
                    }
                })
            }
            else {
                console.log()
            }

        },
        'movie-this': function () {
            if (name) {
                var qurl = "http://omdbapi.com/?apikey=a2dd86fb" + "&t=" + name;
                request(qurl, function (error, response, body) {
                    var data = JSON.parse(body);
                    console.log("==========Results==========" + "\n")
                    console.log("Title: " + data.Title + "\n" + "Year: " + data.Year + "\n" + "IMDB Rating: " + data.imdbRating + "\n" + "Rotten Tomatoes: " + data.Ratings[1].Value + "\n" + "Country: " + data.Country + "\n" + "Lang: " + data.Language + "\n" + "Plot: " + data.Plot + "\n" + "Actors: " + data.Actors + "\n")
                    //format this data as well
                })
            }
            else {
                console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947" + "\n" + "It is on NETFLIX!");
                //print details for mr. nobody movie
            }

        },
        'do-what-it-says': function () {
            fs.readFile("./random.txt", "utf8", function (error, data) {
                if (error) {
                    return console.log(error)
                }

                var dataSplit = data.split(",");
                var arg = dataSplit[0];
                console.log(arg)
                var name = dataSplit[1];
                console.log(name)

                //make the right call to the appropriate function
                switch (arg) {
                    case "concert-this":
                        getLiri(arg,name);
                        break;

                    case "spotify-this-song":
                        getLiri(arg);
                        break;

                    case "movie-this":
                        getLiri(arg);
                        break;

                }
            });
        }
    }
    if (func[n]) {
        fn = func[n];
    }
    else {
        console.log("Invalid option")
    }
    return fn();
}

//arguments
var arg = process.argv[2];
var name = process.argv[3];

getLiri(arg,name);