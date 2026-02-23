
import fs from "fs"
import csv from "csv-parser"
export type Movie = number;
type ReturnResult = {movie_title : string, movie_genres : string};
//gets a movie id and returns the movie name from the csv 
export async function id_to_name(movie_id : number) : Promise<ReturnResult | undefined>{

  return new Promise((resolve) => {
    
    const stream = fs.createReadStream("ml-latest-small/movies.csv")
      .pipe(csv())
      .on("data", (row) => { 
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