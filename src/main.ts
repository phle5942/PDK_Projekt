import * as hash from "../../lib/hashtables";
import * as lst from "../../lib/list";

export type Movie = number;
// type Rating = number;
type UserID = number;


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


//alsmdakslnds


export function get_movie_arr(user1: User, user_arr: Array<User>): Array<[Movie, number]> {

  const hash_table = hash.ph_empty<Movie, number>(1000, hash.hash_id)
    //let best_movie_ever = [0, 0];
    let arr : Array<[Movie, number]> = [];

  // adds a list of movies to a hashtale where the value is the amount of times it has been added.
  function add_to_hash_and_arr(movie_lst: Array<Movie>): void {
    for (let i = 0; i < movie_lst.length; i++) {
      const amount = hash.ph_lookup(hash_table, movie_lst[i]);
      if(amount == undefined) {
        hash.ph_insert(hash_table, movie_lst[i], 1);
        arr.push([movie_lst[i], 1]);
      }
      else {
        hash.ph_insert(hash_table, movie_lst[i], amount + 1);
        //best_movie_ever = best_movie_ever[1] < amount + 1 ? [movie_lst[i], amount + 1] : best_movie_ever;
        // delete_duplicate(movie_lst[i], arr);
        // arr.push([movie_lst[i], amount + 1]);
        for(let j = 0; j < arr.length; j = j + 1) {
          if(arr[j][0] === movie_lst[i]) {
            arr[j][1] = amount + 1;
            break;
      }
    }
      }
    }
  }

  // function delete_duplicate(movie: Movie, arr: Array<[Movie, number]>) {
  //   for(let i = 0; i < arr.length; i = i + 1) {
  //     if(arr[i][0] === movie) {
  //       arr.splice(i, 1);
  //       break;
  //     }
  //   }
  // }
  function sort_arr(arr : Array<[Movie, number]>) {

    function swap(A : Array<[Movie, number]>, x : number, y : number) {
        const temp = A[x];
        A[x] = A[y];
        A[y] = temp;
    }
    function selection_sort(A : Array<[Movie, number]>) {
        const len = A.length;
        for (let i = 0; i < len - 1; i = i + 1) {
            let min_pos = find_min_pos(A, i, len - 1);
            swap(A, i, min_pos);
        }
    }
    function find_min_pos(A : Array<[Movie, number]>, low : number, high : number) {
            let min_pos = low;
            for (let j = low + 1; j <= high; j = j + 1) {
                if (A[j][1] > A[min_pos][1]) {
                    min_pos = j;
                } 
            }
    return min_pos;
    }
    selection_sort(arr);
  }

  for (let i = 0; i < user_arr.length; i++) {
    const comp = compare(user1, user_arr[i]);
    if (comp.length > 0 && comp.length < 5) {
      add_to_hash_and_arr(comp);
    }
  }
  sort_arr(arr);
  return arr;
}
