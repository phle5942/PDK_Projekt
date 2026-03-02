<<<<<<< HEAD
import * as hash from "../../lib/hashtables";
import * as lst from "../../lib/list";

type Movie = number;
// type Rating = number;
type UserID = number;


type User = {
  id: number,
  movie_list: Array<Movie>
}

function compare(user1: User, user2: User): Array<Movie> {
  const u2_lst = user2.movie_list;
  const u1_lst = user1.movie_list;

  const return_array = Array<Movie>();

  for (let i = 0; i < u2_lst.length; i++) {
    let same = false;
    for (let j = 0; j < u1_lst.length; j++) {
      if (u2_lst[i] === u1_lst[j]) {
        same = true;
      }
    }
    if (!same) {
      return_array.push(u2_lst[i]);
    }
  }

  return return_array;
}


//alsmdakslnds


function get_movie_arr(user1: User, user_arr: Array<User>): Array<[Movie, number]> {

  const hash_table = hash.ph_empty<Movie, number>(100, hash.hash_id)

  // adds a list of movies to a hashtale where the value is the amount of times it has been added.
  function add_to_hash(movie_lst: Array<Movie>): void {
    for (let i = 0; i < movie_lst.length; i++) {
      const amount = hash.ph_lookup(hash_table, movie_lst[i]);
       amount == undefined ? hash.ph_insert(hash_table, movie_lst[i], 1)
        : hash.ph_insert(hash_table, movie_lst[i], amount + 1);
    }
  }

  return [[10, 10]];
}

// function get_movie_arr(user1: User, user_arr: Array<User>): Array<[Movie, number]> {
//   const return_array = Array<[Movie, number]>();
//
//
//   for (let i = 0; i < user_arr.length; i++) {
//     const comp = compare(user1, user_arr[i]);
//     if (comp.length > 0 && comp.length < 5) {
//       for (let j = 0; j < comp.length; j++) {
//         if(comp[j] ) {
//     }
//   }
// }
=======
import * as list from "../../lib/list.js"
import * as hash from "../../lib/hashtables.js"
import fs from "fs"
import csv from "csv-parser"


export type MovieArray = Array<{
  movie: Movie;
  rating: Rating;
}>

export type Movie = number;
export type Rating = number;

export type User = number;

function similarityScore(input: Array<Movie>, movieArr: MovieArray | undefined): number { 
  if ( movieArr == undefined ) { return 0; }
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
const movieScoreTable = hash.ph_empty<Movie, number>(1000, hash.hash_id);
// init hashtable for keeping trrack of users similarity score
const simTable = hash.ph_empty<User, number>(610, hash.hash_id);
// init hashtable for keeping track of how many times a movie was rated to handle not recomending always popular mopvies
const movieCount = hash.ph_empty<Movie, number>(1000, hash.hash_id);


///////////////////////////////////////////////////7
function getRelevantUsers(movies: Array<Movie>): Promise<void> {
  return new Promise((resolve, reject) => {
    // set boolean to keep track of relevant users
    let hasSeen = false;

    // keep track of current user, this assumes the file is sorted with regards to users
    let currentUser: User = -1;
    let currentUserArray: MovieArray = [];

    fs.createReadStream(".gitignore/ml-latest-small/ratings.csv")
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


  list.for_each((key) => {
    const simScore = hash.ph_lookup(simTable, key);
    const movie_arr = hash.ph_lookup(userMovieTable, key);

    for (let i = 0; i < movie_arr!.length; i = i + 1) {
      const currentMovie = movie_arr![i].movie;
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
    result_array.push([key, score! / count!]);
  }, m_keys)

  result_array.sort((a, b) => b[1] - a[1]);
  return result_array;
}
//main();

//console.log("hej");
>>>>>>> fb901d4fd71efda0addea355154e56c252097edc
