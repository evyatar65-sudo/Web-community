-- ============================================================
-- Sayeret Nachal Veterans Association — Supabase Schema
-- ============================================================

-- 1. Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  personal_id TEXT,
  service_years TEXT,
  role_in_unit TEXT,
  phone TEXT,
  current_city TEXT,
  profession TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  show_in_directory BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Events
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  location TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RSVPs
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- 4. Forum Posts
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Forum Replies
CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Archive Items
CREATE TABLE IF NOT EXISTS archive_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  year INT,
  type TEXT CHECK (type IN ('photo', 'document', 'video')),
  file_url TEXT,
  is_approved BOOLEAN DEFAULT false,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Fallen (memorial)
CREATE TABLE IF NOT EXISTS fallen (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  year INT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Benefits
CREATE TABLE IF NOT EXISTS benefits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  description TEXT,
  discount_details TEXT,
  link TEXT,
  is_active BOOLEAN DEFAULT true
);

-- 9. Donations (pledge tracking)
CREATE TABLE IF NOT EXISTS donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  amount INT NOT NULL CHECK (amount > 0),
  is_recurring BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);



ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE fallen ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Public profiles are viewable by approved members"
  ON profiles FOR SELECT
  USING (
    status = 'approved' AND show_in_directory = true
    AND EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.status = 'approved'
    )
  );

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Allow insert on registration"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- EVENTS policies
CREATE POLICY "Public events are viewable by everyone"
  ON events FOR SELECT
  USING (is_public = true);

CREATE POLICY "Private events viewable by approved members"
  ON events FOR SELECT
  USING (
    is_public = false
    AND EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.status = 'approved'
    )
  );

CREATE POLICY "Admins can manage events"
  ON events FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- RSVPs policies
CREATE POLICY "Approved members can view RSVPs"
  ON rsvps FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.status = 'approved')
  );

CREATE POLICY "Approved members can create RSVPs"
  ON rsvps FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.status = 'approved')
  );

CREATE POLICY "Users can delete their own RSVPs"
  ON rsvps FOR DELETE
  USING (auth.uid() = user_id);

-- FORUM policies
CREATE POLICY "Approved members can view forum"
  ON forum_posts FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.status = 'approved')
  );

CREATE POLICY "Approved members can create posts"
  ON forum_posts FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.status = 'approved')
  );

CREATE POLICY "Authors can delete their own posts"
  ON forum_posts FOR DELETE
  USING (auth.uid() = author_id);

CREATE POLICY "Admins can delete any post"
  ON forum_posts FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Approved members can view replies"
  ON forum_replies FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.status = 'approved')
  );

CREATE POLICY "Approved members can create replies"
  ON forum_replies FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.status = 'approved')
  );

CREATE POLICY "Authors can delete their own replies"
  ON forum_replies FOR DELETE
  USING (auth.uid() = author_id);

-- ARCHIVE policies
CREATE POLICY "Approved members can view approved archive items"
  ON archive_items FOR SELECT
  USING (
    is_approved = true
    AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.status = 'approved')
  );

CREATE POLICY "Approved members can upload archive items"
  ON archive_items FOR INSERT
  WITH CHECK (
    auth.uid() = uploaded_by
    AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.status = 'approved')
  );

CREATE POLICY "Admins can manage archive"
  ON archive_items FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- FALLEN policies
CREATE POLICY "Fallen are publicly viewable"
  ON fallen FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage fallen"
  ON fallen FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- BENEFITS policies
CREATE POLICY "Approved members can view benefits"
  ON benefits FOR SELECT
  USING (
    is_active = true
    AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.status = 'approved')
  );

CREATE POLICY "Admins can manage benefits"
  ON benefits FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ============================================================
-- Indexes (performance)
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_rsvps_event ON rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_author ON forum_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category);
CREATE INDEX IF NOT EXISTS idx_forum_replies_post ON forum_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_archive_approved ON archive_items(is_approved);
CREATE INDEX IF NOT EXISTS idx_fallen_year ON fallen(year);
CREATE INDEX IF NOT EXISTS idx_donations_user ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(is_read);

-- DONATIONS policies
CREATE POLICY "Users can create their own donations"
  ON donations FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own donations"
  ON donations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage donations"
  ON donations FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- CONTACT MESSAGES policies
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage contact messages"
  ON contact_messages FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ============================================================
-- Storage Buckets
-- ============================================================
-- Run this in the Supabase SQL editor to create the storage bucket:
--
-- INSERT INTO storage.buckets (id, name, public)
--   VALUES ('uploads', 'uploads', true)
--   ON CONFLICT (id) DO NOTHING;
--
-- Storage objects:
--   uploads/avatars/<user_id>.<ext>   — profile photos
--   uploads/archive/<timestamp>.<ext> — archive items

-- Storage RLS
CREATE POLICY "Approved members can upload files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'uploads'
    AND EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.status = 'approved'
    )
  );

CREATE POLICY "Approved members can view uploads"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'uploads'
    AND EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.status = 'approved'
    )
  );

CREATE POLICY "Users can update their own uploads"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- Approval notification trigger (optional — requires pg_net or Supabase Edge Functions)
-- ============================================================
-- When a member is approved, trigger a notification email via Supabase Edge Functions.
-- See: https://supabase.com/docs/guides/functions/triggers
--
-- CREATE OR REPLACE FUNCTION notify_member_approved()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
--     PERFORM net.http_post(
--       url := 'https://<project>.supabase.co/functions/v1/send-approval-email',
--       body := json_build_object('user_id', NEW.id, 'email', NEW.full_name)::text
--     );
--   END IF;
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
--
-- CREATE TRIGGER on_member_approved
--   AFTER UPDATE ON profiles
--   FOR EACH ROW EXECUTE FUNCTION notify_member_approved();
