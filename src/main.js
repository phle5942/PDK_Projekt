"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var list = require("../../lib/list");
var hash = require("../../lib/hashtables");
var fs = require("fs");
var csv = require("csv-parser");
function similarityScore(main_user, other_user) { return 1; }
// Returns how much a specific users "vote" counts.
function assign_weight(similarity, rating) { return 1; }
// init hashtable
var userMovieTable = hash.ph_empty(610, hash.hash_id);
var inputMovies = [1, 4, 7, 12, 54];
hash.ph_insert(userMovieTable, 1, [{ movie: 2, rating: 3 }]);
function getRelevantUsers(movies, callback) {
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
        if (user !== currentUser && user !== -1) {
            if (hasSeen) {
                hash.ph_insert(userMovieTable, currentUser, currentUserArray);
                console.log(currentUser);
                console.log(currentUserArray);
            }
            hasSeen = false;
            currentUserArray = [];
        }
        currentUser = user;
        currentUserArray.push({ movie: movie, rating: rating });
        if (movies.includes(movie)) {
            hasSeen = true;
        }
    })
        .on("end", function () {
        if (hasSeen) {
            hash.ph_insert(userMovieTable, currentUser, currentUserArray);
        }
        callback();
    });
}
getRelevantUsers(inputMovies, function () {
    var lst = hash.ph_keys(userMovieTable);
    list.for_each((function (key) { return console.log(hash.ph_lookup(userMovieTable, key)); }), lst);
});
// console.log(userMovieTable);
