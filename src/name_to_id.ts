
import * as fs from "node:fs"
import csv from "csv-parser"
export type Movie = number;
type Movie_Result = {movie_id : Movie, movie_title : string, movie_genres : string};
/**
 * When given a movie name, returns either a record of a movie_id, movie_title and movie_genres or undefined.
 * The returned record is determined through an interpretation of the given movie name, matching the 
 * interpretation with the first match in the csv file. If there is no match in the file, the function
 * returns undefined.
 * @param {string} movie_name - the name of a movie or a string with characters in the sought after movies name
 * @returns {Promise<Movie_Result | undefined>} - a Promise, either a Movie_Result (record with a Movie and two 
 * string. The Movie is the movies id and the strings are the title and the genres) or undefined.
 */
export async function name_to_id(movie_name : string, path : string) : Promise<Array<Movie_Result> | undefined> {
  
  //Checks if the given title is similar to the movie_name, or other way around.
  function fuzzy_search(title : string, movie_name : string) : boolean {
    return title.toLowerCase().replace(/[^a-zA-Z0-9åäö]/gi, "").includes(movie_name.toLowerCase().replace(/[^a-zA-Z0-9åäö]/gi, "")) || 
          movie_name.toLowerCase().replace(/[^a-zA-Z0-9åäö]/gi, "").includes(title.toLowerCase().replace(/[^a-zA-Z0-9åäö]/gi, ""))
  }
  return new Promise((resolve) => {
    
    const result_array: Array<Movie_Result> = [];
    const stream = fs.createReadStream(path)
      .pipe(csv())
      .on("data", (row : {movieId : string, title : string, genres : string}) => { //camelcase because of csv-file
        const title: string = String(row.title);
          if(fuzzy_search(title, movie_name)) { 
            
            const id: number = Number(row.movieId);
            const genres: string = String(row.genres);
            const result_movie = {movie_id : id, movie_title : title, movie_genres : genres};
            result_array.push(result_movie);
            if (result_array.length >= 5) {
          stream.destroy();
        }
          }

      })
        
      .on("end", () => {
        resolve(result_array);
      })
      .on("close", () => {
        resolve(result_array);
    })
      .on("error", () => {
        resolve(undefined);
  });

  });
}
