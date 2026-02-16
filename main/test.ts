
//blablablablablablalblablablablblablablablablablalbalb

export type Movie = {
  id: number
  title: string
  poster_path: string | null
}
export type user = account_user | guest_user;

export type account_user = {
    id : number,
    movie_picks : [Movie, Movie, Movie],
    name : string,
    password : string
}

export type guest_user = {
    movie_picks : [Movie, Movie, Movie]
}

//skbidi