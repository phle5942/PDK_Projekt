import { get_movie_arr, Movie, User } from "../src/main"

const mainUser: User = {
  id: 0,
  movie_list: [1, 2, 3, 4, 5]
};

// Other users (all exactly 5 movies)
const userList: User[] = [
  { id: 1, movie_list: [2, 5, 6, 7, 8] },  // shares 2,5 → include [6,7,8] length 3 ✅
  { id: 2, movie_list: [1, 3, 4, 9, 10] }, // shares 1,3,4 → include [9,10] length 2 ✅
  { id: 3, movie_list: [6, 7, 8, 11, 12] },// shares none → ignored
  { id: 4, movie_list: [2, 3, 5, 13, 14] },// shares 2,3,5 → include [13,14] length 2 ✅
  { id: 5, movie_list: [1, 5, 6, 7, 15] }  // shares 1,5 → include [6,7,15] length 3 ✅
];

// Expected output reasoning:
// Count occurrences of movies from users who share at least 1 movie
// Only include movies not in mainUser ([1,2,3,4,5])
//
// User 1: [6,7,8] → counts: 6:1, 7:1, 8:1
// User 2: [9,10] → counts: 9:1, 10:1
// User 4: [13,14] → counts: 13:1, 14:1
// User 5: [6,7,15] → counts updated: 6:2, 7:2, 15:1
//
// Final counts: 6:2, 7:2, 8:1, 9:1, 10:1, 13:1, 14:1, 15:1
// Sort descending by count

const expectedResult: [Movie, number][] = [
  [6, 2],
  [7, 2],
  [8, 1],
  [9, 1],
  [10, 1],
  [13, 1],
  [14, 1],
  [15, 1]
];

test('get_movie_arr returns correct movie recommendations', () => {
  expect(get_movie_arr(mainUser, userList)).toEqual(expectedResult);
});
