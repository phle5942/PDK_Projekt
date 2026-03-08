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
exports.id_to_name = id_to_name;
const fs = require("node:fs");
const csv_parser_1 = require("csv-parser");
/**
 * When given a movie id, returns either a record of a movie_title and movie_genres correlating to the id in
 *  the csv file, or undefined if the id does not match a movie.
 * @param {number} movie_id - the id of the movie searched for
 * @preconditions movie_id >= 0
 * @returns {Promise<Return_Result | undefined>} - returns either a record of a movie_title and movie_genres correlating to the id in
 *  the csv file, or undefined if the id does not match a movie.
 */
function id_to_name(movie_id, path) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            const stream = fs.createReadStream(path)
                .pipe((0, csv_parser_1.default)())
                .on("data", (row) => {
                const id = Number(row.movieId);
                if (movie_id === id) {
                    const title = String(row.title);
                    const genres = String(row.genres);
                    const result_movie = { movie_title: title, movie_genres: genres };
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
    });
}
//# sourceMappingURL=id_to_movie_name.js.map