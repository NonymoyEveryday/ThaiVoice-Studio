export interface TagItem {
  tag: string;
  score: number;
}

export interface SummarizeResponse {
  success: boolean;
  summary?: string;
  error?: string;
  details?: string;
}

export interface TagSuggestResponse {
  success: boolean;
  tags?: TagItem[];
  error?: string;
  details?: string;
}

export interface VajaSpeaker {
  id: string;
  name: string;
  category: string;
  gender: 'female' | 'male';
}

export interface VoiceResponse {
  success: boolean;
  audioUrl?: string; // proxied endpoint or direct stream
  error?: string;
  details?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}
