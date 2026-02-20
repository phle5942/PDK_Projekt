import * as list from "../../lib/list"
import * as hash from "../../lib/hashtables"
import * as fs from "fs"
import * as csv from "csv-parser"

export type MovieArray = Array<{
  movie: Movie;
  rating: Rating;
}>

export type Movie = number;
export type Rating = number;

export type User = number;





function similarityScore(main_user: User, other_user: User): number { return 1; }

// Returns how much a specific users "vote" counts.
function assign_weight(similarity: number, rating: number): number { return 1; }

// init hashtable
const userMovieTable = hash.ph_empty<User, MovieArray>(610, hash.hash_id)

const inputMovies: Array<Movie> = [1, 4, 7, 12, 54];

hash.ph_insert(userMovieTable, 1, [{movie: 2 ,rating: 3}]);

function getRelevantUsers(movies: Array<Movie>, callback: () => void): void {
  // set boolean to keep track of relevant users
  let hasSeen = false;

  // keep track of current user, this assumes the file is sorted with regards to users
  let currentUser: User = -1;
  let currentUserArray: MovieArray = [];

  fs.createReadStream("../ml-latest-small/ratings.csv")
    .pipe(csv())
    .on("data", (row) => {
      const user: User = Number(row.userId);
      const movie: Movie = Number(row.movieId);
      const rating: Rating = Number(row.rating);

      if (user !== currentUser && user !== -1) {
        if (hasSeen) {
          hash.ph_insert(userMovieTable, currentUser, currentUserArray);
          console.log(currentUser);
          console.log(currentUserArray);
        }
        hasSeen = false;
        currentUserArray = [];
      }
      currentUser = user;
      currentUserArray.push({ movie, rating })

      if (movies.includes(movie)) { hasSeen = true; }
       

    })
    .on("end", () => {
      if(hasSeen) {
        hash.ph_insert(userMovieTable, currentUser, currentUserArray);
      }
      callback();
    })
}

getRelevantUsers(inputMovies, () => {
  const lst = hash.ph_keys(userMovieTable);

  list.for_each((key => console.log(hash.ph_lookup(userMovieTable, key))), lst);
});
// console.log(userMovieTable);


