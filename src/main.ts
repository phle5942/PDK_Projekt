import * as list from "../../lib/list.js"
import * as hash from "../../lib/hashtables.js"
import fs from "fs"
import csv from "csv-parser"

/////TODO
//Funktionsspec, testcases, hashfunktion, rapport, diary, 

export type MovieArray = Array<{
  movie: Movie;
  rating: Rating;
}>

export type Movie = number;
export type Rating = number;

export type User = number;


//
function similarityScore(input: Array<Movie>, movieArr: MovieArray | undefined): number { 
  if ( movieArr == undefined ) { return 0; }
  let relevantMoviesWatched = 0;
  let totalRating = 0;

  for (let i = 0; i < movieArr.length; i = i + 1) {
    if (input.includes(movieArr[i].movie)) {
      relevantMoviesWatched = relevantMoviesWatched + 1;
      totalRating = totalRating + (movieArr[i].rating - 2.5);
    }
  }

  return (totalRating / relevantMoviesWatched) * relevantMoviesWatched ** 0.5; 
}

// Returns how much a specific users "vote" counts.
function assign_weight(similarity: number, rating: number): number {
  return similarity < 0 ? (rating - 2.5) * (-similarity) : (rating - 2.5) * similarity;
}

// init hashtable for relevant users
const userMovieTable = hash.ph_empty<User, MovieArray>(330975, hash.hash_id);

/// init hashtable for movie and score
const movieScoreTable = hash.ph_empty<Movie, number>(288983, hash.hash_id);
// init hashtable for keeping trrack of users similarity score
const simTable = hash.ph_empty<User, number>(330975, hash.hash_id);
// init hashtable for keeping track of how many times a movie was rated to handle not recomending always popular mopvies
const movieCount = hash.ph_empty<Movie, number>(288983, hash.hash_id);


///////////////////////////////////////////////////7
function getRelevantUsers(movies: Array<Movie>): Promise<void> {
  return new Promise((resolve, reject) => {
    // set boolean to keep track of relevant users
    let hasSeen = false;
    let counter = 0;

    // keep track of current user, this assumes the file is sorted with regards to users
    let currentUser: User = -1;
    let currentUserArray: MovieArray = [];

    fs.createReadStream("../ml-latest/ratings.csv")
      .pipe(csv())
      .on("data", (row) => {
        const user: User = Number(row.userId);
        const movie: Movie = Number(row.movieId);
        const rating: Rating = Number(row.rating);

        // when coming across new user, check if last user is relevant or not
        if (user !== currentUser && user !== -1) {
          if (counter >= 3) {
            hash.ph_insert(userMovieTable, currentUser, currentUserArray);
          }
          //hasSeen = false;
          counter = 0;
          currentUserArray = [];
        }

        // sets currentuser and pushes movies to temp array
        currentUser = user;
          currentUserArray.push({ movie, rating })

        // sets the amount of times the user has seen one of the input movies
        for(let i = 0; i < movies.length; i = i + 1) {
          if(movies[i] === movie) counter = counter + 1;
        }
        //if (movies.includes(movie)) { hasSeen = true; }

      })
      .on("end", () => {
        // adds the last user
        if(counter >= 3) {
          hash.ph_insert(userMovieTable, currentUser, currentUserArray);
        }
        resolve();
      })
      .on("error", reject);
  });
}
  

export async function main(inputMovies: Array<Movie>) : Promise<Array<[Movie, number]>>{
  await getRelevantUsers(inputMovies);
  const keys = hash.ph_keys(userMovieTable);

  // computes and adds imilarity scores for each user to simTable
  list.for_each((key) => {
    const m_array: MovieArray | undefined = hash.ph_lookup(userMovieTable, key);
    hash.ph_insert(simTable, key, similarityScore(inputMovies, m_array));
  }, keys);

  //for every user and all their movies, accumulate the score for each movie, depending on how much we trust the users opinion
  list.for_each((key) => {
    const simScore = hash.ph_lookup(simTable, key);
    const movie_arr = hash.ph_lookup(userMovieTable, key);

    for (let i = 0; i < movie_arr!.length; i = i + 1) {
      const currentMovie = movie_arr![i].movie;
      if(inputMovies.includes(currentMovie)) continue;
      const rating = movie_arr![i].rating;
      const vote = assign_weight(simScore!, rating);

      const prevScore = hash.ph_lookup(movieScoreTable, currentMovie);
        hash.ph_insert(movieScoreTable, currentMovie, (prevScore ?? 0) + vote);

      const prevCount = hash.ph_lookup(movieCount, currentMovie);
        hash.ph_insert(movieCount, currentMovie, (prevCount ?? 0) + 1);
      
      }
  }, keys)


  const m_keys = hash.ph_keys(movieScoreTable);
  const result_array: Array<[Movie, number]> = []

  list.for_each((key) => {
    const score = hash.ph_lookup(movieScoreTable, key);
    const count = hash.ph_lookup(movieCount, key);
    result_array.push([key, score! / (count! ** 0.5)]);
  }, m_keys)

  result_array.sort((a, b) => b[1] - a[1]);
  console.log(result_array);
  return result_array;
}
