export interface Photo {
  name: string;
  url: string;
}

export interface Like {
  count: number;
  users: {
    userId: string;
    name: string;
  }[];
}

export interface Comment {
  userName: string;
  text: string;
  mentionedName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileFeed {
  id: number;
  feeling: string;
  photos: Photo[];
  checkIn: string;
  description: string;
  likes: Like;
  comments: Comment[];
  privacyId: number;
  createdAt: string;
  updatedAt: string;
  isExpanded: boolean;
}
