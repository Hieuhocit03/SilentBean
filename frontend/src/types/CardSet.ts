export interface Card {
  question: string;
  answer: string;
}

export interface Comment {
  user: string;
  text: string;
  createdAt: string;
}

export interface CardSet {
  _id: string;
  title: string;
  description: string;
  cards: Card[];
  stars: number;
  totalRatings: number;
  comments: Comment[];
  learnCount: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
