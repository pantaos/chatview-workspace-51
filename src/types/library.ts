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

export type LibraryFilterType = 'all' | 'video' | 'image' | 'pdf' | 'word' | 'link' | 'other';
export type LibraryDateFilter = 'newest' | 'oldest' | 'this-week' | 'this-month';
export type LibrarySourceFilter = 'all' | 'workflows' | 'chats';
