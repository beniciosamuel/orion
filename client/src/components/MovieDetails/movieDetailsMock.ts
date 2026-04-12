export type MovieTableRecord = {
  id: string;
  resume_title: string;
  title: string;
  description: string;
  user_comment: string | null;
  director: string;
  duration: number;
  genres: string;
  language: string;
  age_rating: string;
  budget: number | null;
  revenue: number | null;
  profit: number | null;
  production_company: string | null;
  trailer_url: string | null;
  release_date: string;
  created_at: string;
  updated_at: string;
};

export const movieDetailsMockList: MovieTableRecord[] = [
  {
    id: "0dbf0aac-53f1-4d62-a2e0-61fdaf4e57e4",
    resume_title: "Bumblebee",
    title: "Bumblebee",
    description:
      "No ano de 1987, Bumblebee encontra refugio em um ferro-velho de uma pequena cidade praiana da California. Ferido e com o mundo a beira de um conflito entre Autobots e Decepticons, ele forma uma improvavel amizade com Charlie.",
    user_comment:
      "Uma boa releitura da franquia, com foco em personagem e ritmo melhor equilibrado.",
    director: "Travis Knight",
    duration: 120,
    genres: "Acao, Aventura, Ficcao Cientifica",
    language: "Portugues",
    age_rating: "12 anos",
    budget: 10000,
    revenue: 50000,
    profit: 40000,
    production_company: "Paramount Pictures",
    trailer_url: "https://www.youtube.com/watch?v=lcwmDAYt22k",
    release_date: "2020-01-01",
    created_at: "2026-04-10T12:30:00.000Z",
    updated_at: "2026-04-10T12:30:00.000Z",
  },
];

export const movieDetailsMock: MovieTableRecord = movieDetailsMockList[0];

export const fetchMovieDetailsById = async (
  id: string,
): Promise<MovieTableRecord | null> => {
  await new Promise((resolve) => setTimeout(resolve, 250));

  const foundMovie = movieDetailsMockList.find((movie) => movie.id === id);
  return foundMovie ?? null;
};
