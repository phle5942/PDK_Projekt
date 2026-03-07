import * as list from "../lib/list"
import * as hash from "../lib/hashtables"
import * as fs from "fs"
import csv from "csv-parser"

/////TODO
//Funktionsspec, testcases, hashfunktion, rapport, diary

export type MovieArray = Array<{
  movie: Movie;
  rating: Rating;
}>

export type Movie = number;
export type Rating = number;

export type User = number;

/**
 * Computes the similarity score a dataset user. Based on how many of the main users movies the data set user 
 * has seen and the rating they have given the movies. The score both determines whether the data set user
 * is similar and different in movie taste to the main user. 
 * @param { Array<Movie> } input - the movies the interface user submitted
 * @param { MovieArray } movieArr - the movies and ratings from the the dataset user 
 * @returns { number } - the similarity score of the dataset user relative to the interface user
 */
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
  if(relevantMoviesWatched === 0) return 0;
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

/** 
  * Takes the data from a CSV file of the format userId, movieId, rating
  * and inputs all the users that have watched at least a certain number of the inputed movies
  * and adds them to a hashtable, where key is userId and value is { movie, rating }
  *
  * @param { Array<Movie> } movies - array of input movies
  * @param { string } filePath - path to csv file containg data
  * @param { number } minNumber - amount of movies a user has to have watched 
  *   to get added to the hashtable
  *
  * @precondition csv file is sorted by userId
  * @complexity Theta(n), where n is length of CSV file
  */
function getRelevantUsers(movies: Array<Movie>, filePath: string, minNumber: number): Promise<void> {
  return new Promise((resolve, reject) => {
    // set number to keep track of relevant users
    let counter = 0;

    // keep track of current user, this assumes the file is sorted with regards to users
    let currentUser: User = -1;
    let currentUserArray: MovieArray = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row : {userId : number, movieId : number, rating : number}) => {
        const user: User = Number(row.userId);
        const movie: Movie = Number(row.movieId);
        const rating: Rating = Number(row.rating);

        // when coming across new user, check if last user is relevant or not
        if (user !== currentUser && user !== -1) {
          if (counter >= minNumber) {
            hash.ph_insert(userMovieTable, currentUser, currentUserArray);
          }
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
  
/**
 * Takes as input an array of movies, a filepath to a dataset and the minimum number of movies 
 * that an dataset user has to have in common. It returns a Promise with an array of a pair of 
 * a movie and the score from the pathed-to dataset, with descending order according to the rating. 
 * 
 * The score of a movie is determined through examining the movies of the relevant users and,
 * based on the similarity between the user and the dataset user and the data set user's personal 
 * movie rating, calculating a relative score.
 * 
 * @param { Array<Movie> } inputMovies array of input movies
 * @param { string } filePath path to csv file containg data
 * @param { number } minNumber number of movies a dataset user has to have in common to be deemed relevant
 * @precondition 0 <= minNumber <= inputMovies.length
 * @precondition filePath must link to a dataset with rows: userId, movieId, rating
 * @precondition dataset must have descending order considering the userId
 * @returns Promise with an array of pairs of a movie and the rating
 * from the pathed dataset, with descening order according to the rating
 */
export async function main(inputMovies: Array<Movie>, filePath: string, minNumber: number) : Promise<Array<[Movie, number]>>{
  await getRelevantUsers(inputMovies, filePath, minNumber);
  const keys = hash.ph_keys(userMovieTable);

  // computes and adds similarity scores for each user to simTable
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

  //accumulates the score for each movie
  list.for_each((key) => {
    const score = hash.ph_lookup(movieScoreTable, key);
    const count = hash.ph_lookup(movieCount, key);
    result_array.push([key, score! / (count! ** 0.5)]);
  }, m_keys)

  result_array.sort((a, b) => b[1] - a[1]);
  return result_array;
}
