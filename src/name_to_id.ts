
import fs from "fs"
import csv from "csv-parser"
export type Movie = number;
type MovieResult = {movie_id : Movie, movie_title : string, movie_genres : string};
//gets a movie string and returns the movie from the csv if it exists
export async function name_to_id(movie_name : string) : Promise<MovieResult | undefined>{

  return new Promise((resolve, reject) => {
    
    const stream = fs.createReadStream(".gitignore/ml-latest-small/movies.csv")
      .pipe(csv())
      .on("data", (row) => { 
        const title: string = String(row.title);
        if(title.toLowerCase().replace(/[^a-zA-Z0-9åäö]/gi, "").includes(movie_name.toLowerCase().replace(/[^a-zA-Z0-9åäö]/gi, "")) || 
          movie_name.toLowerCase().replace(/[^a-zA-Z0-9åäö]/gi, "").includes(title.toLowerCase().replace(/[^a-zA-Z0-9åäö]/gi, ""))) { // ev. att vi hämtar en fuzzy-match lib
            
            const id: number = Number(row.movieId);
            const genres: string = String(row.genres);
            const result_movie = {movie_id : id, movie_title : title, movie_genres : genres};
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