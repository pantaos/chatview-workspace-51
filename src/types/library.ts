export interface LibraryItem {
  id: string;
  name: string;
  type: 'video' | 'image' | 'pdf' | 'word' | 'link' | 'other';
  category: 'uploaded' | 'generated';
  source: {
    type: 'workflow' | 'chat' | 'upload';
    name: string;
    id: string;
  };
  thumbnail?: string;
  url: string;
  createdAt: Date;
  size?: number;
  mimeType?: string;
  projectId?: string;
}

export type LibraryFilterType = 'video' | 'image' | 'pdf' | 'word' | 'link' | 'other';
export type LibrarySortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc';
export type LibrarySourceFilter = 'all' | 'workflows' | 'chats';
export type LibraryCategoryFilter = 'uploaded' | 'generated';

export interface MockProject {
  id: string;
  name: string;
}
