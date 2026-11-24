-- ==============================================================================
-- SAHKARSATHI COOPERATIVE PLATFORM - PHASE 13 MIGRATION
-- Reviews, Star Ratings, Category Feedback, Worker Responses, and Moderation
-- ==============================================================================

-- 1. Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Ratings (1 to 5 stars)
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  category_ratings JSONB DEFAULT '{"service_quality": 5, "professionalism": 5, "punctuality": 5, "communication": 5, "overall_experience": 5}'::jsonb,
  
  -- Review content
  review_text TEXT NOT NULL,
  
  -- Status: 'published' | 'hidden' | 'flagged' | 'under_moderation'
  status TEXT NOT NULL DEFAULT 'published',
  
  -- Edit tracking
  is_edited BOOLEAN NOT NULL DEFAULT FALSE,
  edit_history JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

  -- Strict rule: One review per customer per worker per booking
  CONSTRAINT unique_customer_worker_booking_review UNIQUE (booking_id, customer_id, worker_id),
  -- Rule: Customer cannot review themselves
  CONSTRAINT check_different_customer_worker CHECK (customer_id <> worker_id)
);

-- 2. Worker Responses table
CREATE TABLE IF NOT EXISTS public.review_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  response_text TEXT NOT NULL,
  is_edited BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

  -- One response per review
  CONSTRAINT unique_review_response UNIQUE (review_id)
);

-- 3. Review Reports (Moderation & Grievance flagging)
CREATE TABLE IF NOT EXISTS public.review_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Report reason: 'spam' | 'abusive_language' | 'personal_information' | 'irrelevant_content' | 'fake_misleading' | 'conflict_of_interest' | 'policy_violation'
  reason TEXT NOT NULL,
  description TEXT,
  
  -- Status: 'pending' | 'resolved_hidden' | 'resolved_dismissed'
  status TEXT NOT NULL DEFAULT 'pending',
  moderation_notes TEXT,
  moderated_by UUID REFERENCES public.profiles(id),
  moderated_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  
  -- Prevent multiple spam reports on same review by same user
  CONSTRAINT unique_user_review_report UNIQUE (review_id, reporter_id)
);

-- 4. Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_reports ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies: Reviews
-- Anyone authenticated can read published reviews
CREATE POLICY "Public read published reviews"
  ON public.reviews FOR SELECT
  USING (
    status = 'published' 
    OR auth.uid() = customer_id 
    OR auth.uid() = worker_id 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor'))
  );

-- Only booking customer can insert review
CREATE POLICY "Customer can create review for own completed booking"
  ON public.reviews FOR INSERT
  WITH CHECK (
    auth.uid() = customer_id
    AND EXISTS (
      SELECT 1 FROM public.bookings
      WHERE id = booking_id
        AND customer_id = auth.uid()
        AND status = 'completed'
    )
  );

-- Customer can edit own review
CREATE POLICY "Customer can update own review"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = customer_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.uid() = customer_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 6. RLS Policies: Worker Responses
CREATE POLICY "Public read responses of published reviews"
  ON public.review_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.reviews 
      WHERE reviews.id = review_responses.review_id 
        AND (reviews.status = 'published' OR reviews.worker_id = auth.uid() OR reviews.customer_id = auth.uid())
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor'))
  );

CREATE POLICY "Worker can respond to own review"
  ON public.review_responses FOR INSERT
  WITH CHECK (
    auth.uid() = worker_id
    AND EXISTS (
      SELECT 1 FROM public.reviews
      WHERE id = review_id AND worker_id = auth.uid()
    )
  );

CREATE POLICY "Worker can edit own response"
  ON public.review_responses FOR UPDATE
  USING (auth.uid() = worker_id)
  WITH CHECK (auth.uid() = worker_id);

-- 7. RLS Policies: Review Reports
-- Only reporter or admins/supervisors can read reports
CREATE POLICY "Users can read own reports or admin oversight"
  ON public.review_reports FOR SELECT
  USING (
    auth.uid() = reporter_id
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor'))
  );

CREATE POLICY "Authenticated users can submit reports"
  ON public.review_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can update reports"
  ON public.review_reports FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 8. Indexes for lightning fast lookups & aggregation
CREATE INDEX IF NOT EXISTS idx_reviews_worker_id ON public.reviews(worker_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON public.reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON public.reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);
CREATE INDEX IF NOT EXISTS idx_review_responses_review_id ON public.review_responses(review_id);
CREATE INDEX IF NOT EXISTS idx_review_reports_status ON public.review_reports(status);

-- 9. Realtime Publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.review_responses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.review_reports;
