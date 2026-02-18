import * as hash from "../../lib/hashtables";
import * as lst from "../../lib/list";

export type Movie = number;
// type Rating = number;
export type UserID = number;

console.log("Hello, world!");

export type User = {
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



export function get_movie_arr(user1: User, user_arr: Array<User>): Array<[Movie, number]> {

  //  checks if element is already in list
  //  if is member, increments number
  function add_to_arr(movie: Movie, movie_arr: Array<[Movie, number]>): void {
    for (let i = 0; i < movie_arr.length; i++) {
      if(movie === movie_arr[i][0]) {
        movie_arr[i][1] = movie_arr[i][1] + 1;
        return;
      }
    }
    movie_arr.push([movie, 1]);
  }

  const return_array = Array<[Movie, number]>();

  for (let i = 0; i < user_arr.length; i++) {
    const differenbt_movies = compare(user1, user_arr[i]);
    if (differenbt_movies.length > 0 && differenbt_movies.length < 5) {
      for (let j = 0; j < differenbt_movies.length; j++) {
        add_to_arr(differenbt_movies[j], return_array);
      }
    }
  }
  
  return return_array.sort((a, b) => b[1] - a[1]);
}

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
