export interface Post {
  id: string;
  slug: string;
  body: string;
  collection: string;
  data: {
    title: string;
    image?: string;
    meta_title?: string;
    description?: string;
    date?: any;
    authors?: string[];
    categories?: string[];
    tags?: string[];
  };
  render: () => Promise<{ Content: any }>;
}

export interface Authors {
  id: string;
  slug: string;
  body: string;
  collection: string;
  data: {
    title: string;
    image?: string;
    meta_title?: string;
    description?: string;
    draft?: boolean;
  };
  render: () => Promise<{ Content: any }>;
}

export interface PostData {
  title: string;
  image?: string;
  authors: string[];
  categories: string[];
  description?: string;
  date: string;
  tags: string[];
  type: string;
}
