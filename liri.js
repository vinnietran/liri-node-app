require("dotenv").config();
var axios = require("axios");
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var moment = require("moment");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var userOption = process.argv[2];
var input = process.argv[3];

UserInputs(userOption, input);

//---------------------------------------------------------------------------------------------------------------------------------------------------
function UserInputs(userOption, input) {
  switch (userOption) {
    case 'concert-this':
      showConcert(input);
      break;
    case 'spotify-this-song':
      showSongInfo(input);
      break;
    case 'movie-this':
      showMovieInfo(input);
      break;
    case 'do-what-it-says':
      doWhat();
      break;
    default:
      console.log("Please type any of the following options: \nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says")
  }
}

//---------------------------------------------------------------------------------------------------------------------------------------------------
function showConcert(input) {
  axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp")
    .then(function (response) {
      for (var i = 0; i < 5; i++) { //limited results to 5 because there were a lot 
        var showConcertResults = "-----------------------------------------------------" +
          "\nVenue Name: " + response.data[i].venue.name +
          "\nVenue Location: " + response.data[i].venue.city +
          "\nDate of the Event: " + moment(response.data[i].datetime).format("MM/DD/YYYY") +
          "\n--------------------------------------------------------------------";
        console.log(showConcertResults);
        fs.appendFileSync("log.txt", showConcertResults); 
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

//---------------------------------------------------------------------------------------------------------------------------------------------------
function showSongInfo(input) {
  if (input === undefined) {
    input = "The Sign"; //default Song
  }
  spotify.search(
    {
      type: "track",
      query: input
    },
    function (err, data) {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }
      var songs = data.tracks.items;

      for (var i = 0; i < songs.length; i++) {
        var spotifyResult = "------------SONG-----------------------" +
          "\n" + (i) +
          "\nSong name: " + songs[i].name +
          "\nPreview song: " + songs[i].preview_url +
          "\nAlbum: " + songs[i].album.name +
          "\nArtist: " + songs[i].artists[0].name +
          "\n---------------------------------------"
        console.log(spotifyResult);
        fs.appendFileSync("log.txt", spotifyResult); 

      }
    }
  );
};

//---------------------------------------------------------------------------------------------------------------------------------------------------
function showMovieInfo(input) {
  if (input === undefined) {
    input = "Mr. Nobody"
    var mrNob = "-----------------------" +
      "\nIf you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/" +
      "\nIt's on Netflix!"
    console.log(mrNob);
    fs.appendFileSync("log.txt", mrNob); 

  }
  axios.get("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy").then(
    function (response) {
      var movRez = "--------------MOVIE---------------" +
        "\nTitle: " + response.data.Title +
        "\nRelease Year: " + response.data.Year +
        "\nIMDB Rating: " + response.data.imdbRating +
        //console.log("Rotten Tomatoes Rating: " + response.data.Ratings.Value ); couldnt get rotten tomatoes to work for some reason
        "\nCountry of Production: " + response.data.Country +
        "\nLanguage: " + response.data.Language +
        "\nPlot: " + response.data.Plot +
        "\nActors: " + response.data.Actors +
        "\n-----------------------------"
        console.log(movRez);
        fs.appendFileSync("log.txt", movRez); 
    });
}


//---------------------------------------------------------------------------------------------------------------------------------------------------
function doWhat() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }
    var dataRdm = data.split(",");
    showSongInfo(dataRdm[1])
  })
}