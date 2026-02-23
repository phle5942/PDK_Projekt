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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var promises_1 = require("node:readline/promises");
var node_process_1 = require("node:process");
var name_to_id_ts_1 = require("./name_to_id.ts");
var main_ts_1 = require("./main.ts");
var rl = promises_1.default.createInterface({ input: node_process_1.stdin, output: node_process_1.stdout });
function main_interface() {
    return __awaiter(this, void 0, void 0, function () {
        var movies, x, answer, movie, yesorno, recommended_movies, i, r2, answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Welcome, select 5 movies");
                    movies = [];
                    x = 0;
                    _a.label = 1;
                case 1:
                    if (!(x < 5)) return [3 /*break*/, 7];
                    return [4 /*yield*/, rl.question("Select : ")];
                case 2:
                    answer = _a.sent();
                    return [4 /*yield*/, (0, name_to_id_ts_1.name_to_id)(answer)];
                case 3:
                    movie = _a.sent();
                    if (!(movie !== undefined)) return [3 /*break*/, 5];
                    console.log(movie);
                    return [4 /*yield*/, rl.question("Is this the right movie? (y/n)")];
                case 4:
                    yesorno = _a.sent();
                    if (yesorno === "y") {
                        x = x + 1;
                        movies.push(movie.movie_id);
                        return [3 /*break*/, 1];
                    }
                    return [3 /*break*/, 6];
                case 5:
                    console.log("Movie not found, try harder");
                    return [3 /*break*/, 1];
                case 6: return [3 /*break*/, 1];
                case 7:
                    console.log("You selected:", movies);
                    rl.close();
                    return [4 /*yield*/, (0, main_ts_1.main)(movies)];
                case 8:
                    recommended_movies = _a.sent();
                    i = 0;
                    r2 = promises_1.default.createInterface({ input: node_process_1.stdin, output: node_process_1.stdout });
                    _a.label = 9;
                case 9:
                    if (!(recommended_movies.length > 0)) return [3 /*break*/, 11];
                    return [4 /*yield*/, r2.question("Wadduya say about ".concat(recommended_movies[i][0], ",  (y/n)"))];
                case 10:
                    answer = _a.sent();
                    if (answer === "y") {
                        console.log(recommended_movies[i][0]);
                        r2.close();
                        return [3 /*break*/, 11];
                    }
                    else {
                        i = i + 1;
                        return [3 /*break*/, 9];
                    }
                    return [3 /*break*/, 9];
                case 11: return [2 /*return*/];
            }
        });
    });
}
main_interface();
