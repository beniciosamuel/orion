export interface MovieRatingCreateDTO {
  movieId: string;
  userId: string;
  rating: number;
}

export interface MovieRatingSummaryDTO {
  movieId: string;
  rating: number;
  userRating: number | null;
  hasUserVoted: boolean;
}
