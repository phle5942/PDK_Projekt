import * as list from "../../lib/list"
import * as hash from "../../lib/hashtables"
import * as fs from "fs"
import * as csv from "csv-parser"

export type MovieArray = Array<{
  movie: Movie;
  rating: Rating;
}>

export type Movie = number;
export type Rating = number;

export type User = number;





function similarityScore(input: Array<Movie>, movieArr: MovieArray): number { 
  let relevantMoviesWatched = 0;
  let totalRating = 0;

  for (let i = 0; i < movieArr.length; i = i + 1) {
    if (input.includes(movieArr[i].movie)) {
      relevantMoviesWatched = relevantMoviesWatched + 1;
      totalRating = totalRating + movieArr[i].rating;
    }
  }

  return totalRating / relevantMoviesWatched; 
}

// Returns how much a specific users "vote" counts.
function assign_weight(similarity: number, rating: number): number {
  return (rating - 2.5) * similarity;
}

// init hashtable for relevant users
const userMovieTable = hash.ph_empty<User, MovieArray>(610, hash.hash_id);

/// init hashtable for movie and score
const movieScoreTable = hash.ph_empty<Movie, number>(100, hash.hash_id);

// temproray inout movies for testing
const inputMovies: Array<Movie> = [1, 4, 7, 12, 54];


///////////////////////////////////////////////////7
function getRelevantUsers(movies: Array<Movie>, func: () => void): void {
  // set boolean to keep track of relevant users
  let hasSeen = false;

  // keep track of current user, this assumes the file is sorted with regards to users
  let currentUser: User = -1;
  let currentUserArray: MovieArray = [];

  fs.createReadStream("../ml-latest-small/ratings.csv")
    .pipe(csv())
    .on("data", (row) => {
      const user: User = Number(row.userId);
      const movie: Movie = Number(row.movieId);
      const rating: Rating = Number(row.rating);

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
      currentUserArray.push({ movie, rating })

      // sets true if user has seen one of the input movies
      if (movies.includes(movie)) { hasSeen = true; }
       

    })
    .on("end", () => {
      // adds the last user
      if(hasSeen) {
        hash.ph_insert(userMovieTable, currentUser, currentUserArray);
      }
      func();
    })
}

getRelevantUsers(inputMovies, () => {
  const lst = hash.ph_keys(userMovieTable);

  list.for_each((key => console.log(hash.ph_lookup(userMovieTable, key))), lst);
});
// console.log(userMovieTable);

console.log("hej");
