export interface LibraryItem {
  id: string;
  name: string;
  type: 'video' | 'image' | 'pdf' | 'word' | 'link' | 'other';
  source: {
    type: 'workflow' | 'chat';
    name: string;
    id: string;
  };
  thumbnail?: string;
  url: string;
  createdAt: Date;
  size?: number;
  mimeType?: string;
}

export type LibraryFilterType = 'video' | 'image' | 'pdf' | 'word' | 'link' | 'other';
export type LibrarySortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc';
export type LibrarySourceFilter = 'all' | 'workflows' | 'chats';
