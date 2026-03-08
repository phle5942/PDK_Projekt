
import * as fs from "node:fs"
import csv from "csv-parser"
export type Movie = number;
type Return_Result = {movie_title : string, movie_genres : string};
/**
 * When given a movie id, returns either a record of a movie_title and movie_genres correlating to the id in
 *  the csv file, or undefined if the id does not match a movie. 
 * @param {number} movie_id - the id of the movie searched for
 * @preconditions movie_id >= 0
 * @returns {Promise<Return_Result | undefined>} - returns either a record of a movie_title and movie_genres correlating to the id in
 *  the csv file, or undefined if the id does not match a movie.
 */
export async function id_to_name(movie_id : number, path : string) : Promise<Return_Result | undefined>{

  return new Promise((resolve) => {
    
    const stream = fs.createReadStream(path)
      .pipe(csv())
      .on("data", (row : {movieId : string, title : string, genres : string}) => { //camelcas because of csv-file
        const id: number = Number(row.movieId);
        if(movie_id === id) { 
            
            const title: string = String(row.title);
            const genres: string = String(row.genres);
            const result_movie = {movie_title : title, movie_genres : genres};
            stream.destroy();
            resolve(result_movie);
          }
      })
      .on("end", () => {
        resolve(undefined);
      })
      .on("error", () => {
        resolve(undefined);
  });
  });
}