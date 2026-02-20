"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var list = require("../../lib/list");
var hash = require("../../lib/hashtables");
var fs = require("fs");
var csv = require("csv-parser");
function similarityScore(main_user, other_user) { return 1; }
// Returns how much a specific users "vote" counts.
function assign_weight(similarity, rating) { return 1; }
// init hashtable for relevant users
var userMovieTable = hash.ph_empty(610, hash.hash_id);
/// init hashtable for movie and score
var movieScoreTable = hash.ph_empty(100, hash.hash_id);
var inputMovies = [1, 4, 7, 12, 54];
hash.ph_insert(userMovieTable, 1, [{ movie: 2, rating: 3 }]);
///////////////////////////////////////////////////7
function getRelevantUsers(movies, func) {
    // set boolean to keep track of relevant users
    var hasSeen = false;
    // keep track of current user, this assumes the file is sorted with regards to users
    var currentUser = -1;
    var currentUserArray = [];
    fs.createReadStream("../ml-latest-small/ratings.csv")
        .pipe(csv())
        .on("data", function (row) {
        var user = Number(row.userId);
        var movie = Number(row.movieId);
        var rating = Number(row.rating);
        // when coming across new user, check if last user is relevant or not
        if (user !== currentUser && user !== -1) {
            if (hasSeen) {
                hash.ph_insert(userMovieTable, currentUser, currentUserArray);
            }
            hasSeen = false;
            currentUserArray = [];
        }
        // sets currentuser and pushes movies to temp array
        currentUser = user;
        currentUserArray.push({ movie: movie, rating: rating });
        // sets true if user has seen one of the input movies
        if (movies.includes(movie)) {
            hasSeen = true;
        }
    })
        .on("end", function () {
        // adds the last user
        if (hasSeen) {
            hash.ph_insert(userMovieTable, currentUser, currentUserArray);
        }
        func();
    });
}
getRelevantUsers(inputMovies, function () {
    var lst = hash.ph_keys(userMovieTable);
    list.for_each((function (key) { return console.log(hash.ph_lookup(userMovieTable, key)); }), lst);
});
// console.log(userMovieTable);
console.log("hej");
