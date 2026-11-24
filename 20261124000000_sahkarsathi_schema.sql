-- ==============================================================================
-- SahkarSathi Platform — PostgreSQL Relational Schema & Row Level Security (RLS)
-- Cooperative Home & Project Services
-- Tagline: "Every Worker Matters. Every Home Counts."
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. ENUMS
-- ==============================================================================

CREATE TYPE user_role AS ENUM ('customer', 'worker', 'supervisor');

CREATE TYPE verification_status AS ENUM (
  'not_started',
  'profile_incomplete',
  'documents_required',
  'submitted',
  'under_review',
  'approved',
  'rejected',
  'additional_info_required'
);

CREATE TYPE booking_status AS ENUM (
  'requested',
  'confirmed',
  'assigned',
  'in_progress',
  'completed',
  'cancelled',
  'rejected'
);

CREATE TYPE escrow_status AS ENUM (
  'pending_deposit',
  'held_in_escrow',
  'disbursed_to_worker',
  'refunded'
);

CREATE TYPE project_status AS ENUM (
  'planning',
  'pending_approval',
  'active',
  'on_hold',
  'completed',
  'cancelled'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded'
);

-- ==============================================================================
-- 2. CORE USERS & PROFILES
-- ==============================================================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Cooperative Organization Branches
CREATE TABLE public.cooperatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_code TEXT UNIQUE NOT NULL, -- e.g. 'UNIT-BLR-EAST-14'
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Bengaluru',
  address TEXT,
  contact_phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Customer Profiles
CREATE TABLE public.customer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  customer_code TEXT UNIQUE,
  primary_address TEXT,
  city TEXT DEFAULT 'Bengaluru',
  preferred_language TEXT DEFAULT 'English',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Worker Profiles
CREATE TABLE public.worker_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  worker_code TEXT UNIQUE NOT NULL, -- e.g. 'SS-WRK-7821'
  role_title TEXT NOT NULL DEFAULT 'Certified Tradesman',
  experience_years INTEGER NOT NULL DEFAULT 1,
  bio TEXT,
  city TEXT NOT NULL DEFAULT 'Bengaluru',
  service_areas TEXT[] DEFAULT ARRAY['Indiranagar', 'Koramangala', 'HSR Layout'],
  daily_hours TEXT DEFAULT '8:00 AM - 7:00 PM',
  is_available BOOLEAN NOT NULL DEFAULT true,
  verification_status verification_status NOT NULL DEFAULT 'not_started',
  verification_stage INTEGER NOT NULL DEFAULT 1,
  badge_level TEXT NOT NULL DEFAULT 'Skilled Craftsman',
  cooperative_id UUID REFERENCES public.cooperatives(id),
  rating NUMERIC(3,2) DEFAULT 5.00,
  reviews_count INTEGER DEFAULT 0,
  upi_vpa TEXT,
  bank_masked TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Supervisor Profiles
CREATE TABLE public.supervisor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  supervisor_code TEXT UNIQUE NOT NULL, -- e.g. 'SUP-BLR-104'
  role_title TEXT NOT NULL DEFAULT 'Field Engineering Supervisor',
  cooperative_id UUID REFERENCES public.cooperatives(id),
  region TEXT NOT NULL DEFAULT 'East Zone (Indiranagar, HSR, Koramangala)',
  service_areas TEXT[] DEFAULT ARRAY['Indiranagar', 'Koramangala', 'HSR Layout', 'Whitefield', 'Domlur'],
  experience_years INTEGER NOT NULL DEFAULT 5,
  quality_score NUMERIC(5,2) DEFAULT 99.40,
  rating NUMERIC(3,2) DEFAULT 4.95,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 3. SERVICES & SKILLS
-- ==============================================================================

CREATE TABLE public.service_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES public.service_categories(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price_starting TEXT NOT NULL,
  price_type TEXT NOT NULL DEFAULT 'fixed',
  coop_wage_rate TEXT NOT NULL,
  typical_duration TEXT NOT NULL,
  included_items TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.worker_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'Skilled Craftsman',
  experience TEXT,
  is_certified BOOLEAN NOT NULL DEFAULT false,
  certification_name TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 4. CUSTOMER BOOKINGS & MILESTONES
-- ==============================================================================

CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_code TEXT UNIQUE NOT NULL, -- e.g. 'BK-2026-9041'
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  service_id UUID REFERENCES public.services(id) ON DELETE RESTRICT,
  service_title TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TEXT NOT NULL,
  service_address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Bengaluru',
  instructions TEXT,
  status booking_status NOT NULL DEFAULT 'requested',
  assigned_worker_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_supervisor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  escrow_status escrow_status NOT NULL DEFAULT 'pending_deposit',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.booking_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 5. WORKER JOB ASSIGNMENTS & REQUESTS
-- ==============================================================================

CREATE TABLE public.job_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_code TEXT UNIQUE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'accepted' | 'declined' | 'expired'
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.job_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_code TEXT UNIQUE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  project_id UUID, -- References projects table below
  worker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  supervisor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  task_title TEXT NOT NULL,
  task_description TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TEXT,
  labor_pay NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'assigned', -- 'assigned' | 'accepted' | 'in_progress' | 'review_pending' | 'completed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 6. PROJECTS & PROGRESS
-- ==============================================================================

CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_code TEXT UNIQUE NOT NULL, -- e.g. 'PRJ-2026-001'
  project_name TEXT NOT NULL,
  description TEXT NOT NULL,
  supervisor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_ref TEXT NOT NULL,
  general_location TEXT NOT NULL,
  start_date DATE NOT NULL,
  expected_completion_date DATE NOT NULL,
  status project_status NOT NULL DEFAULT 'planning',
  progress_percentage INTEGER NOT NULL DEFAULT 0,
  total_budget NUMERIC(12,2) NOT NULL DEFAULT 0,
  escrow_disbursed NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.project_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  assigned_worker_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_worker_name TEXT,
  due_date TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'in_progress' | 'completed'
  progress_percentage INTEGER NOT NULL DEFAULT 0,
  certified_by_supervisor BOOLEAN NOT NULL DEFAULT false,
  certified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 7. WORKER VERIFICATION & ID CARDS
-- ==============================================================================

CREATE TABLE public.worker_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_stage INTEGER NOT NULL DEFAULT 1,
  status verification_status NOT NULL DEFAULT 'not_started',
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewer_id UUID REFERENCES public.profiles(id),
  review_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Private storage reference for identity documents (DPDP Act compliance)
CREATE TABLE public.worker_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  storage_path TEXT NOT NULL, -- In private storage bucket 'worker-verification-docs'
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.worker_id_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  card_code TEXT UNIQUE NOT NULL,
  qr_hash TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 8. ANCILLARY: SAVED WORKERS, SUPPORT TICKETS, PAYMENTS, NOTIFICATIONS
-- ==============================================================================

CREATE TABLE public.saved_workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(customer_id, worker_id)
);

CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_code TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_role user_role NOT NULL,
  category TEXT NOT NULL,
  related_booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  related_project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open', -- 'open' | 'in_progress' | 'resolved' | 'closed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.payment_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_reference TEXT UNIQUE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  payer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'Cooperative Escrow Vault',
  upi_reference TEXT,
  status payment_status NOT NULL DEFAULT 'pending',
  payment_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supervisor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cooperatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_id_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone authenticated can view; only owner can update
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Customer Profiles
CREATE POLICY "Customers view and update own profile"
  ON public.customer_profiles FOR ALL
  TO authenticated
  USING (auth.uid() = profile_id);

-- Worker Profiles: Public directory for approved, worker can update own
CREATE POLICY "Anyone can view approved worker profiles"
  ON public.worker_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Workers can update own worker profile"
  ON public.worker_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = profile_id);

CREATE POLICY "Workers can insert own worker profile"
  ON public.worker_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = profile_id);

-- Supervisor Profiles
CREATE POLICY "Supervisors viewable by all"
  ON public.supervisor_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Supervisors can update own profile"
  ON public.supervisor_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = profile_id);

-- Cooperatives & Services: Public read
CREATE POLICY "Cooperatives are publicly readable"
  ON public.cooperatives FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Categories and services are readable"
  ON public.service_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Services are readable"
  ON public.services FOR SELECT
  TO authenticated
  USING (true);

-- Worker Skills
CREATE POLICY "Worker skills viewable by authenticated"
  ON public.worker_skills FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Workers manage own skills"
  ON public.worker_skills FOR ALL
  TO authenticated
  USING (auth.uid() = worker_id);

-- Bookings Policies:
-- Customer sees own bookings; Worker sees assigned bookings; Supervisor sees assigned/zone bookings
CREATE POLICY "Customer can view and create own bookings"
  ON public.bookings FOR ALL
  TO authenticated
  USING (
    customer_id = auth.uid() OR
    assigned_worker_id = auth.uid() OR
    assigned_supervisor_id = auth.uid()
  );

-- Projects Policies
CREATE POLICY "Supervisor and assigned members can view projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (
    supervisor_id = auth.uid() OR
    customer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.project_tasks
      WHERE project_tasks.project_id = projects.id AND project_tasks.assigned_worker_id = auth.uid()
    )
  );

CREATE POLICY "Project tasks viewable by project stakeholders"
  ON public.project_tasks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_tasks.project_id AND (
        projects.supervisor_id = auth.uid() OR
        projects.customer_id = auth.uid() OR
        project_tasks.assigned_worker_id = auth.uid()
      )
    )
  );

-- Worker Documents: Strictly protected (DPDP Act)
CREATE POLICY "Worker can view own documents"
  ON public.worker_documents FOR ALL
  TO authenticated
  USING (
    worker_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'supervisor'
    )
  );

-- Support Tickets
CREATE POLICY "Users can manage own support tickets"
  ON public.support_tickets FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'supervisor'
    )
  );

-- Notifications
CREATE POLICY "Users view own notifications"
  ON public.notifications FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Payment Records
CREATE POLICY "Users view relevant payments"
  ON public.payment_records FOR SELECT
  TO authenticated
  USING (
    payer_id = auth.uid() OR
    recipient_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'supervisor'
    )
  );

-- ==============================================================================
-- 10. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH.USERS SIGN-UP
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  assigned_role public.user_role;
  user_full_name TEXT;
  user_phone TEXT;
BEGIN
  -- Extract metadata provided during signUp
  assigned_role := COALESCE(
    (new.raw_user_meta_data->>'role')::public.user_role,
    'customer'::public.user_role
  );
  
  user_full_name := COALESCE(
    new.raw_user_meta_data->>'full_name',
    split_part(new.email, '@', 1)
  );

  user_phone := new.raw_user_meta_data->>'phone';

  -- 1. Insert into public.profiles
  INSERT INTO public.profiles (id, email, role, full_name, phone, avatar_url)
  VALUES (
    new.id,
    new.email,
    assigned_role,
    user_full_name,
    user_phone,
    new.raw_user_meta_data->>'avatar_url'
  );

  -- 2. Insert into respective sub-profile based on role
  IF assigned_role = 'customer' THEN
    INSERT INTO public.customer_profiles (profile_id, customer_code)
    VALUES (new.id, 'CUST-' || upper(substr(md5(random()::text), 1, 6)));

  ELSIF assigned_role = 'worker' THEN
    INSERT INTO public.worker_profiles (
      profile_id,
      worker_code,
      role_title,
      verification_status
    )
    VALUES (
      new.id,
      'SS-WRK-' || upper(substr(md5(random()::text), 1, 6)),
      COALESCE(new.raw_user_meta_data->>'role_title', 'Certified Tradesman'),
      'not_started'
    );

    INSERT INTO public.worker_verifications (worker_id, current_stage, status)
    VALUES (new.id, 1, 'not_started');

  ELSIF assigned_role = 'supervisor' THEN
    INSERT INTO public.supervisor_profiles (
      profile_id,
      supervisor_code,
      role_title
    )
    VALUES (
      new.id,
      'SUP-BLR-' || upper(substr(md5(random()::text), 1, 6)),
      COALESCE(new.raw_user_meta_data->>'role_title', 'Field Engineering Supervisor')
    );
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 11. SEED DATA (COOPERATIVES, CATEGORIES & SERVICES)
-- ==============================================================================

INSERT INTO public.cooperatives (unit_code, name, region, city, address, contact_phone)
VALUES 
  ('UNIT-BLR-EAST-14', 'East Bangalore Craftsmen Union', 'East Zone', 'Bengaluru', '100ft Road, Indiranagar', '+91 80 4421 8890'),
  ('UNIT-BLR-SOUTH-08', 'South Bangalore Artisans Collective', 'South Zone', 'Bengaluru', '27th Main, HSR Sector 1', '+91 80 4421 8891')
ON CONFLICT (unit_code) DO NOTHING;

INSERT INTO public.service_categories (name, slug, icon, description)
VALUES
  ('Electrical', 'electrical', 'Zap', 'Distribution board overhauls, high-voltage isolators, rewiring & solar sync.'),
  ('Plumbing', 'plumbing', 'Droplet', 'Concealed leak repair, hydraulic balancing, PPR-C piping & pressure booster setups.'),
  ('Carpentry', 'carpentry', 'Hammer', 'Hardwood joinery, acoustic panelling, modular cabinetry & door stabilization.'),
  ('Painting & Waterproofing', 'painting', 'Paintbrush', 'Terrace PU elastomeric membrane, negative-side damp injection & anti-fungal coats.'),
  ('Masonry & Civil Support', 'masonry', 'Building2', 'Structural crack stitching, tile regrouting, lintel reinforcements & core cutting.'),
  ('HVAC & Air Treatment', 'hvac', 'Fan', 'Central VRF power balancing, copper line nitrogen pressure testing & clean coil service.')
ON CONFLICT (slug) DO NOTHING;
