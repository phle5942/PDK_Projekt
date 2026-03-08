import * as list from "../lib/list"
import * as hash from "../lib/hashtables"
import * as fs from "fs"
import csv from "csv-parser"

export type Movie_Array = Array<{
  movie: Movie;
  rating: Rating;
}>

export type Movie = number;
export type Rating = number;

export type User = number;


// simle hash function
export function hash_func(value: string | number): number {
  const string = value.toString();
  let hashed_result = 0;
  for (let i = 0; i < string.length; i = i + 1) {
    hashed_result = (hashed_result << 5) - hashed_result + string.charCodeAt(i);
  }
  return hashed_result;
}

/**
 * Computes the similarity score a dataset user. Based on how many of the main users movies the data set user 
 * has seen and the rating they have given the movies. The score both determines whether the data set user
 * is similar and different in movie taste to the main user. 
 * @param { Array<Movie> } input - the movies the interface user submitted
 * @param { Movie_Array } movie_arr - the movies and ratings from the the dataset user 
 * @returns { number } - the similarity score of the dataset user relative to the interface user
 */
function similarity_score(input: Array<Movie>, movie_arr: Movie_Array | undefined): number { 
  if ( movie_arr == undefined ) { return 0; }
  let relevant_movies_watched = 0;
  let total_rating = 0;

  for (let i = 0; i < movie_arr.length; i = i + 1) {
    if (input.includes(movie_arr[i].movie)) {
      relevant_movies_watched = relevant_movies_watched + 1;
      total_rating = total_rating + (movie_arr[i].rating - 2.5);
    }
  }
  if(relevant_movies_watched === 0) return 0;
  return (total_rating / relevant_movies_watched) * relevant_movies_watched ** 0.5; 
}

// Returns how much a specific users "vote" counts.
function assign_weight(similarity: number, rating: number): number {
  return (rating - 2.5) * similarity;
}

/** 
  * Takes the data from a CSV file of the format userId, movieId, rating
  * and inputs all the users that have watched at least a certain number of the inputed movies
  * and adds them to a hashtable, where key is userId and value is { movie, rating }
  *
  * @param { Array<Movie> } movies - array of input movies
  * @param { string } file_path - path to csv file containg data
  * @param { number } min_number - amount of movies a user has to have watched 
  *   to get added to the hashtable
  *
  * @precondition csv file is sorted by userId
  * @complexity Theta(n), where n is length of CSV file
  */
function getRelevantUsers(movies: Array<Movie>, file_path: string, min_number: number, user_movie_table : hash.ProbingHashtable<number, Movie_Array>): Promise<void> {
  return new Promise((resolve, reject) => {
    // set number to keep track of relevant users
    let counter = 0;

    // keep track of current user, this assumes the file is sorted with regards to users
    let current_user: User = -1;
    let current_user_array: Movie_Array = [];

    fs.createReadStream(file_path)
      .pipe(csv())
      .on("data", (row : {userId : number, movieId : number, rating : number}) => { //camelcase because of csv-file
        const user: User = Number(row.userId);
        const movie: Movie = Number(row.movieId);
        const rating: Rating = Number(row.rating);

        // when coming across new user, check if last user is relevant or not
        if (user !== current_user && user !== -1) {
          if (counter >= min_number) {
            hash.ph_insert(user_movie_table, current_user, current_user_array);
          }
          counter = 0;
          current_user_array = [];
        }

        // sets currentuser and pushes movies to temp array
        current_user = user;
          current_user_array.push({ movie, rating })

        // sets the amount of times the user has seen one of the input movies
        for(let i = 0; i < movies.length; i = i + 1) {
          if(movies[i] === movie) counter = counter + 1;
        }

      })
      .on("end", () => {
        // adds the last user
        if(counter >= min_number) {
          hash.ph_insert(user_movie_table, current_user, current_user_array);
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
 * @param { Array<Movie> } input_movies array of input movies
 * @param { string } file_path path to csv file containg data
 * @param { number } min_number number of movies a dataset user has to have in common to be deemed relevant
 * @precondition 0 <= minNumber <= inputMovies.length
 * @precondition filePath must link to a dataset with rows: userId, movieId, rating
 * @precondition dataset must have descending order considering the userId
 * @returns Promise with an array of pairs of a movie and the rating
 * from the pathed dataset, with descening order according to the rating
 */
export async function main(input_movies: Array<Movie>, file_path: string, min_number: number) : Promise<Array<[Movie, number]>>{
    
  // init hashtable for relevant users
  const user_movie_table = hash.ph_empty<User, Movie_Array>(330975, hash_func);
  /// init hashtable for movie and score
  const movie_score_table = hash.ph_empty<Movie, number>(288983, hash_func);
  // init hashtable for keeping trrack of users similarity score
  const sim_table = hash.ph_empty<User, number>(330975, hash_func);
  // init hashtable for keeping track of how many times a movie was rated to handle not recomending always popular mopvies
  const movie_count = hash.ph_empty<Movie, number>(288983, hash_func);

  await getRelevantUsers(input_movies, file_path, min_number, user_movie_table);
  const keys = hash.ph_keys(user_movie_table);

  // computes and adds similarity scores for each user to simTable
  list.for_each((key) => {
    const m_array: Movie_Array | undefined = hash.ph_lookup(user_movie_table, key);
    const sim_score = similarity_score(input_movies, m_array);
    if(sim_score > 0) hash.ph_insert(sim_table, key, sim_score);
  }, keys);

  //for every user and all their movies, accumulate the score for each movie, depending on how much we trust the users opinion
  list.for_each((key) => {
    const sim_score = hash.ph_lookup(sim_table, key);
    const movie_arr = hash.ph_lookup(user_movie_table, key);

    if(sim_score === undefined) return;

    for (let i = 0; i < movie_arr!.length; i = i + 1) {
      const current_movie = movie_arr![i].movie;
      if(input_movies.includes(current_movie)) continue;
      const rating = movie_arr![i].rating;
      const vote = assign_weight(sim_score!, rating);

      const current_score = hash.ph_lookup(movie_score_table, current_movie);
        hash.ph_insert(movie_score_table, current_movie, (current_score ?? 0) + vote);

      const current_count = hash.ph_lookup(movie_count, current_movie);
        hash.ph_insert(movie_count, current_movie, (current_count ?? 0) + 1);
      }
  }, keys)


  const m_keys = hash.ph_keys(movie_score_table);
  const result_array: Array<[Movie, number]> = [];

  //accumulates the score for each movie
  list.for_each((key) => {
    const score = hash.ph_lookup(movie_score_table, key);
    const count = hash.ph_lookup(movie_count, key);
    result_array.push([key, score! / (count! ** 0.5)]);
  }, m_keys)

  result_array.sort((a, b) => b[1] - a[1]);
  return result_array;
}
