"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_movie_arr = get_movie_arr;
console.log("Hello, world!");
function compare(user1, user2) {
    var u2_lst = user2.movie_list;
    var u1_lst = user1.movie_list;
    var return_array = Array();
    for (var i = 0; i < u2_lst.length; i++) {
        var same = false;
        for (var j = 0; j < u1_lst.length; j++) {
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
function get_movie_arr(user1, user_arr) {
    //  checks if element is already in list
    //  if is member, increments number
    function add_to_arr(movie, movie_arr) {
        for (var i = 0; i < movie_arr.length; i++) {
            if (movie === movie_arr[i][0]) {
                movie_arr[i][1] = movie_arr[i][1] + 1;
                return;
            }
        }
        movie_arr.push([movie, 1]);
    }
    var return_array = Array();
    for (var i = 0; i < user_arr.length; i++) {
        var differenbt_movies = compare(user1, user_arr[i]);
        if (differenbt_movies.length > 0 && differenbt_movies.length < 5) {
            for (var j = 0; j < differenbt_movies.length; j++) {
                add_to_arr(differenbt_movies[j], return_array);
            }
        }
    }
    return return_array.sort(function (a, b) { return b[1] - a[1]; });
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
