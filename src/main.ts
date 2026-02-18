import * as fs from "fs"
import * as csv from "csv-parser"

export type User = {
  id: number;
  movie_list: Array<{ movie_id: number; rating: number }>;
  similarity_score?: number;
}

export type Movie = {
  id: number;
  movie_name: string;
  user_list: Array<{ user_id: number; rating: number }>;
}

const similarUsers = new Set<User>();
const move_set = new Set<Movie>();
const mainUserMovies = new Set<Movie>();

function similarityScore(main_user: User, other_user: User): number {
  
}

function assign_weight(similarity: number, rating: number): number { return 1; }

function get_relevant_users(main_user: User): Array<User> {
 return [];
}
