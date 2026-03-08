"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = require("node:readline/promises");
const node_process_1 = require("node:process");
const name_to_id_1 = require("./name_to_id");
const main_1 = require("./main");
const id_to_movie_name_1 = require("./id_to_movie_name");
/**
 * Function that, once called upon, initiates a terminal interface where a user submits five movies and
 * recieves movies based on the movies submitted.
 */
function main_interface(movies_path, ratings_path) {
    return __awaiter(this, void 0, void 0, function* () {
        const rl = readline.createInterface({ input: node_process_1.stdin, output: node_process_1.stdout });
        console.log("Welcome, select 5 movies");
        const movies = [];
        let x = 0;
        while (x < 5) {
            const answer = yield rl.question("Search movie: ");
            const movie_list = yield (0, name_to_id_1.name_to_id)(answer, movies_path);
            if (movie_list !== undefined && movie_list.length > 0) {
                for (let i = 0; i < movie_list.length; i = i + 1) {
                    console.log(movie_list[i]);
                    console.log(i + 1);
                }
                const selected_movie = yield rl.question(`Which is the right movie? (1-5/n) `);
                if (['1', '2', '3', '4', '5'].includes(selected_movie)) {
                    x = x + 1;
                    movies.push(movie_list[parseInt(selected_movie) - 1].movie_id);
                    continue;
                }
            }
            else {
                console.log("Movie not found, try harder");
                continue;
            }
        }
        console.log("Please wait, calculating...");
        const recommended_movies = yield (0, main_1.main)(movies, ratings_path, 3);
        let i = 0;
        while (recommended_movies.length > i) {
            const final_movie = yield (0, id_to_movie_name_1.id_to_name)(recommended_movies[i][0], movies_path);
            const answer = yield rl.question(`Wadduya say about ${final_movie === null || final_movie === void 0 ? void 0 : final_movie.movie_title},  (y/n) `);
            if (answer === "y") {
                break;
            }
            else {
                i = i + 1;
                continue;
            }
        }
        rl.close();
    });
}
main_interface("../ml-latest/movies.csv", "../ml-latest/ratings.csv");
//# sourceMappingURL=interface.js.map