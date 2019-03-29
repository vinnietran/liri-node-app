require("dotenv").config();
var axios = require("axios");
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var moment = require("moment");
let fs = require("fs");
var spotify = new Spotify(keys.spotify);
var userOption = process.argv[2];
var inputParameter = process.argv[3];

UserInputs(userOption, inputParameter);

//---------------------------------------------------------------------------------------------------------------------------------------------------
function UserInputs(userOption, inputParameter) {
  switch (userOption) {
    case 'concert-this':
      showConcert(inputParameter);
      break;
    case 'spotify-this-song':
      showSongInfo(inputParameter);
      break;
    case 'movie-this':
      showMovieInfo(inputParameter);
      break;
    case 'do-what-it-says':
      doWhatItSay();
      break;
    default:
      console.log("Invalid Option. Please type any of the following options: \nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says")
  }
}

//---------------------------------------------------------------------------------------------------------------------------------------------------
function showConcert(inputParameter) {
  axios.get("https://rest.bandsintown.com/artists/" + inputParameter + "/events?app_id=codingbootcamp")
    .then(function (response) {
      for (var i = 0; i < 5; i++) {
        var concertResults = "-----------------------------------------------------" +
          "\nVenue Name: " + response.data[i].venue.name +
          "\nVenue Location: " + response.data[i].venue.city +
          "\nDate of the Event: " + moment(response.data[i].datetime).format("MM/DD/YYYY") +
          "\n--------------------------------------------------------------------";
        console.log(concertResults);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

//---------------------------------------------------------------------------------------------------------------------------------------------------
function showSongInfo(inputParameter) {
  if (inputParameter === undefined) {
    inputParameter = "The Sign"; //default Song
  }
  spotify.search(
    {
      type: "track",
      query: inputParameter
    },
    function (err, data) {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }
      var songs = data.tracks.items;

      for (var i = 0; i < songs.length; i++) {
        console.log("**********SONG INFO*********");
        console.log(i);
        console.log("Song name: " + songs[i].name);
        console.log("Preview song: " + songs[i].preview_url);
        console.log("Album: " + songs[i].album.name);
        console.log("Artist(s): " + songs[i].artists[0].name);
        console.log("*****************************");
      }
    }
  );
};

//---------------------------------------------------------------------------------------------------------------------------------------------------
function showMovieInfo(inputParameter) {
  if (inputParameter === undefined) {
    inputParameter = "Mr. Nobody"
    console.log("-----------------------");
    console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
    console.log("It's on Netflix!");
  }
  axios.get("http://www.omdbapi.com/?t=" + inputParameter + "&y=&plot=short&apikey=trilogy").then(
    function (response) {
      console.log("**********MOVIE INFO*********");
      console.log("Title: " + response.data.Title);
      console.log("Release Year: " + response.data.Year);
      console.log("IMDB Rating: " + response.data.imdbRating);
      //console.log("Rotten Tomatoes Rating: " + getRottenTomatoesRatingValue(movies));
      console.log("Country of Production: " + response.data.Country);
      console.log("Language: " + response.data.Language);
      console.log("Plot: " + response.data.Plot);
      console.log("Actors: " + response.data.Actors);
      console.log("*****************************");
    });
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
function doWhatItSay() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }
    var dataRdm = data.split(",");
    showSongInfo(dataRdm[1])
  })
}