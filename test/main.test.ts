import { main, Movie, User, getRelevantUsers, Movie_Array, similarity_score, Movie_Rating} from "../src/main"
import path from 'path';
import * as hash from "../lib/hashtables";
import * as list from "../lib/list";

jest.setTimeout(20000);

const filePath = path.join(__dirname, 'small_set.csv');
const input = [1, 2];
const expectedResult = [[3, 7.07], [4, 7.07]];
test('small dataset', async () => {
  const result = await main(input, filePath, 2);

  expect(result.length).toBe(expectedResult.length);

  for (let i = 0; i < expectedResult.length; i = i + 1) {
    expect(result[i][0]).toBe(expectedResult[i][0]);
    expect(result[i][1]).toBeCloseTo(expectedResult[i][1], 2);

  }
});

test("get_relevant_users works", async () => {
  const h_table : hash.ProbingHashtable<number, Movie_Array> = hash.ph_empty(2, hash.hash_id);
  await getRelevantUsers(input, filePath, 1, h_table);
  const keys = hash.ph_keys(h_table);
  const expected = [2, [1, null]];
  expect(keys).toEqual(expected);
})

test("similarity score works", () => {
  const movie_rating1: Movie_Rating = {movie : 1, rating : 5};
  const movie_rating2: Movie_Rating = {movie : 2, rating : 4};
  const movie_rating3: Movie_Rating = {movie : 3, rating : 3};
  const movie_rating4: Movie_Rating = {movie : 4, rating : 4};

  const movie_rating5: Movie_Rating = {movie : 1, rating : 0};
  const movie_rating6: Movie_Rating = {movie : 2, rating : 2};
  const movie_rating7: Movie_Rating = {movie : 3, rating : 4};

  const movie_arr1 : Movie_Array = [movie_rating1, movie_rating2, movie_rating3, movie_rating4];
  const movie_arr2 : Movie_Array = [movie_rating5, movie_rating6, movie_rating7];
  const sim_score1 = similarity_score(input, movie_arr1);
  const sim_score2 = similarity_score(input, movie_arr2);

  expect(sim_score1).toBeGreaterThan(0);
  expect(sim_score2).toBeLessThan(0);
})