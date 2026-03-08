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
exports.name_to_id = name_to_id;
const fs = require("node:fs");
const csv_parser_1 = require("csv-parser");
/**
 * When given a movie name, returns either a record of a movie_id, movie_title and movie_genres or undefined.
 * The returned record is determined through an interpretation of the given movie name, matching the
 * interpretation with the first match in the csv file. If there is no match in the file, the function
 * returns undefined.
 * @param {string} movie_name - the name of a movie or a string with characters in the sought after movies name
 * @returns {Promise<Movie_Result | undefined>} - a Promise, either a Movie_Result (record with a Movie and two
 * string. The Movie is the movies id and the strings are the title and the genres) or undefined.
 */
function name_to_id(movie_name, path) {
    return __awaiter(this, void 0, void 0, function* () {
        //Checks if the given title is similar to the movie_name, or other way around.
        function fuzzy_search(title, movie_name) {
            return title.toLowerCase().replace(/[^a-zA-Z0-9åäö]/gi, "").includes(movie_name.toLowerCase().replace(/[^a-zA-Z0-9åäö]/gi, "")) ||
                movie_name.toLowerCase().replace(/[^a-zA-Z0-9åäö]/gi, "").includes(title.toLowerCase().replace(/[^a-zA-Z0-9åäö]/gi, ""));
        }
        return new Promise((resolve) => {
            const result_array = [];
            const stream = fs.createReadStream(path)
                .pipe((0, csv_parser_1.default)())
                .on("data", (row) => {
                const title = String(row.title);
                if (fuzzy_search(title, movie_name)) {
                    const id = Number(row.movieId);
                    const genres = String(row.genres);
                    const result_movie = { movie_id: id, movie_title: title, movie_genres: genres };
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
    });
}
//# sourceMappingURL=name_to_id.js.map