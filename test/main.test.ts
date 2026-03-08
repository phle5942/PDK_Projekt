import { main, Movie, User } from "../src/main"




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

// const expectedResult: [Movie, number][] = [
//   [6, 2],
//   [7, 2],
//   [8, 1],
//   [9,
//
//   1],
//   [10, 1],
//   [13, 1],
//   [14, 1],
//   [15, 1]
// ];

// test('', () => {
//   expect().toEqual(expectedResult);
// });
//

const filePath = "./small_set.csv"
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

test("", () => {
  
})