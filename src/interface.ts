import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { name_to_id } from "./name_to_id";
import {main} from "./main"
import { id_to_name } from "./id_to_movie_name";
async function main_interface() {
    
const rl = readline.createInterface({ input, output });

  console.log("Welcome, select 5 movies");

  const movies: number[] = [];
    let x = 0;
    while(x < 5) {
        const answer = await rl.question("Select : ");
        const movie = await name_to_id(answer);
        if(movie !== undefined) {
            console.log(movie);
            const yesorno = await rl.question(`Is this the right movie? (y/n)`);
            if(yesorno === "y") {
                x = x + 1;
                movies.push(movie.movie_id);
                continue;
            }
        }
        else {
            console.log("Movie not found, try harder")
            continue;
        }
    }
    
    console.log("Please wait, calculating...")
    const recommended_movies = await main(movies, "../ml-latest/ratings.csv", 3);
    let i = 0;

    //const r2 = readline.createInterface({ input, output });
    while(recommended_movies.length > i) {
        const final_movie = await id_to_name(recommended_movies[i][0]);
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

main_interface();
