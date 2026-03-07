import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { name_to_id } from "./name_to_id";
import {main} from "./main"
import { id_to_name } from "./id_to_movie_name";

/**
 * Function that, once called upon, initiates a terminal interface where a user submits five movies and 
 * recieves movies based on the movies submitted.
 */
async function main_interface(movies_path : string, ratings_path : string) {
    
const rl = readline.createInterface({ input, output });

  console.log("Welcome, select 5 movies");

  const movies: number[] = [];
    let x = 0;
    while(x < 5) {
        const answer = await rl.question("Select movie, 1 - 5: ");
        const movie_list = await name_to_id(answer, movies_path);
        if(movie_list !== undefined && movie_list.length > 0) {
          for (let i = 0; i < movie_list.length; i = i + 1) {
            console.log(movie_list[i]);
            console.log(i + 1);
        }
            const yesorno = await rl.question(`Is this the right movie? (1-5/n)`);
            if(['1', '2', '3', '4', '5'].includes(yesorno)) {
                x = x + 1;
                movies.push(movie_list[parseInt(yesorno) - 1].movie_id);
                continue;
            }
        }
        else {
            console.log("Movie not found, try harder")
            continue;
        }
    }
    
    console.log("Please wait, calculating...")
    const recommended_movies = await main(movies, ratings_path, 3);
    let i = 0;

    while(recommended_movies.length > i) {
        const final_movie = await id_to_name(recommended_movies[i][0], movies_path);
        const answer = await rl.question(`Wadduya say about ${final_movie?.movie_title},  (y/n)`);
        if(answer === "y") {
            break;
        } else {
            i = i + 1;
            continue;
        }
    }
    rl.close();
}

main_interface("../ml-latest/movies.csv", "../ml-latest/ratings.csv");
