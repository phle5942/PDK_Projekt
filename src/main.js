"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var list = require("../../lib/list");
var hash = require("../../lib/hashtables");
var fs = require("fs");
var csv = require("csv-parser");
function similarityScore(input, movieArr) {
    if (movieArr == undefined) {
        return 0;
    }
    var relevantMoviesWatched = 0;
    var totalRating = 0;
    for (var i = 0; i < movieArr.length; i = i + 1) {
        if (input.includes(movieArr[i].movie)) {
            relevantMoviesWatched = relevantMoviesWatched + 1;
            totalRating = totalRating + movieArr[i].rating;
        }
    }
    return totalRating / relevantMoviesWatched;
}
// Returns how much a specific users "vote" counts.
function assign_weight(similarity, rating) {
    return (rating - 2.5) * similarity;
}
// init hashtable for relevant users
var userMovieTable = hash.ph_empty(610, hash.hash_id);
/// init hashtable for movie and score
var movieScoreTable = hash.ph_empty(1000, hash.hash_id);
// init hashtable for keeping trrack of users similarity score
var simTable = hash.ph_empty(610, hash.hash_id);
// temproray inout movies for testing
var inputMovies = [1, 4, 7, 12, 54];
///////////////////////////////////////////////////7
function getRelevantUsers(movies) {
    return new Promise(function (resolve, reject) {
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
            resolve();
        })
            .on("error", reject);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var keys, m_keys, result_array;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getRelevantUsers(inputMovies)];
                case 1:
                    _a.sent();
                    console.log(userMovieTable);
                    keys = hash.ph_keys(userMovieTable);
                    // computes and adds imilarity scores for each user to simTable
                    list.for_each(function (key) {
                        var m_array = hash.ph_lookup(userMovieTable, key);
                        hash.ph_insert(simTable, key, similarityScore(inputMovies, m_array));
                    }, keys);
                    // console.log(list.length(hash.ph_keys(simTable)) === list.length(hash.ph_keys(userMovieTable)));
                    list.for_each(function (key) {
                        var simScore = hash.ph_lookup(simTable, key);
                        var movie_arr = hash.ph_lookup(userMovieTable, key);
                        for (var i = 0; i < movie_arr.length; i = i + 1) {
                            var currentMovie = movie_arr[i].movie;
                            var rating = movie_arr[i].rating;
                            var vote = assign_weight(simScore, rating);
                            var prevScore = hash.ph_lookup(movieScoreTable, currentMovie);
                            if (prevScore !== undefined) {
                                hash.ph_insert(movieScoreTable, currentMovie, prevScore + vote);
                            }
                            else {
                                hash.ph_insert(movieScoreTable, currentMovie, vote);
                            }
                        }
                    }, keys);
                    m_keys = hash.ph_keys(movieScoreTable);
                    result_array = [];
                    list.for_each(function (key) {
                        result_array.push([key, hash.ph_lookup(movieScoreTable, key)]);
                    }, m_keys);
                    result_array.sort(function (a, b) { return b[1] - a[1]; });
                    console.log(result_array);
                    return [2 /*return*/];
            }
        });
    });
}
main();
console.log("hej");
