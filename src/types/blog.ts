export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  article: string;
  excerpt: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  expand: {
    author: {
      name: string;
      avatar: string;
    };
  };
  tags: string[];
  created: string;
  updated: string;
}

export interface BlogListResponse {
  items: BlogPost[];
  totalItems: number;
  page: number;
  perPage: number;
  totalPages: number;
}
