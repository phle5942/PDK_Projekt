import * as hash from "../../lib/hashtables";
import * as lst from "../../lib/list";

type Movie = number;
// type Rating = number;
type UserID = number;

console.log("Hello, world!");

type User = {
  id: number,
  movie_list: Array<Movie>
}

function compare(user1: User, user2: User): Array<Movie> {
  const u2_lst = user2.movie_list;
  const u1_lst = user1.movie_list;

  const return_array = Array<Movie>();

  for (let i = 0; i < u2_lst.length; i++) {
    let same = false;
    for (let j = 0; j < u1_lst.length; j++) {
      if (u2_lst[i] === u1_lst[j]) {
        same = true;
      }
    }
    if (!same) {
      return_array.push(u2_lst[i]);
    }
  }

  return return_array;
}



function get_movie_arr(user1: User, user_arr: Array<User>): Array<[Movie, number]> {

  const hash_table = hash.ph_empty<Movie, number>(100, hash.hash_id)

  // adds a list of movies to a hashtale where the value is the amount of times it has been added.
  function add_to_hash(movie_lst: Array<Movie>): void {
    for (let i = 0; i < movie_lst.length; i++) {
      const amount = hash.ph_lookup(hash_table, movie_lst[i]);
       amount == undefined ? hash.ph_insert(hash_table, movie_lst[i], 1)
        : hash.ph_insert(hash_table, movie_lst[i], amount + 1);
    }
  }

  return [[10, 10]];
}

// function get_movie_arr(user1: User, user_arr: Array<User>): Array<[Movie, number]> {
//   const return_array = Array<[Movie, number]>();
//
//
//   for (let i = 0; i < user_arr.length; i++) {
//     const comp = compare(user1, user_arr[i]);
//     if (comp.length > 0 && comp.length < 5) {
//       for (let j = 0; j < comp.length; j++) {
//         if(comp[j] ) {
//     }
//   }
// }
