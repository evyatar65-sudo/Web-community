export type UserStatus = "pending" | "approved" | "rejected";
export type UserRole = "member" | "admin";
export type ArchiveItemType = "photo" | "document" | "video";

export interface Profile {
  id: string;
  full_name: string;
  personal_id?: string;
  service_years?: string;
  role_in_unit?: string;
  phone?: string;
  current_city?: string;
  profession?: string;
  avatar_url?: string;
  status: UserStatus;
  role: UserRole;
  show_in_directory: boolean;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  is_public: boolean;
  created_at: string;
}

export interface RSVP {
  id: string;
  event_id: string;
  user_id: string;
  created_at: string;
}

export interface ForumPost {
  id: string;
  author_id: string;
  category: string;
  title: string;
  content: string;
  created_at: string;
  author?: Profile;
  replies_count?: number;
}

export interface ForumReply {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: Profile;
}

export interface ArchiveItem {
  id: string;
  title: string;
  description?: string;
  year?: number;
  type: ArchiveItemType;
  file_url?: string;
  is_approved: boolean;
  uploaded_by?: string;
  created_at: string;
}

export interface Benefit {
  id: string;
  company: string;
  description?: string;
  discount_details?: string;
  link?: string;
  is_active: boolean;
}

export interface Donation {
  id: string;
  user_id?: string;
  amount: number;
  is_recurring: boolean;
  status: "pending" | "completed" | "failed";
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Fallen {
  id: string;
  name: string;
  role?: string;
  year: number;
  bio?: string;
  photo_url?: string;
  created_at: string;
}
