type Movie = number;
type Rating = number;
type UserID = number;

console.log("Hello, world!");

type User = {
  id: number,
  movie_list: Array<{ movie: number, rating: number }>
}
