# SahkarSathi — Backend, Database & Authentication Architecture Setup Guide

> **Tagline:** Every Worker Matters. Every Home Counts.  
> **Mission:** Cooperative Home & Project Services Platform

---

## Overview

SahkarSathi utilizes **Supabase** (PostgreSQL + Supabase Auth + Supabase Storage + Row Level Security) as its unified backend architecture to seamlessly coordinate three primary user roles:
- **Customers**: Browse trades, book services, track active milestones, and inspect digital escrow receipts.
- **Workers**: Manage skills, accept job dispatches, update field progress, submit verification credentials, and inspect zero-commission payouts.
- **Supervisors**: Oversee workforce rosters, dispatch job assignments, manage multi-trade infrastructure projects, and certify completion milestones.

---

## 1. Creating the Supabase Backend Project

1. Navigate to [Supabase Console](https://supabase.com/dashboard) and sign in.
2. Click **New Project** and select your organization (e.g., `vm4942800-dot's Org`).
3. Set the project parameters:
   - **Name:** `SahkarSathi-Production` (or `SahkarSathi-Dev`)
   - **Database Password:** Generate and securely store a strong password.
   - **Region:** Select `ap-south-1` (Mumbai) or nearest to your target user base.
   - **Pricing Plan:** Free tier or Pro.
4. Allow 2–3 minutes for Supabase to provision the PostgreSQL engine and authentication services.

---

## 2. Authentication Provider Configuration

SahkarSathi supports three authentication methods:

### A. Email & Password (Primary)
- Enabled by default in Supabase.
- In your Supabase Dashboard, navigate to **Authentication → Providers → Email**.
- Ensure **Enable Email provider** is turned **ON**.
- For production, turn **Confirm email** ON. For local development testing, you may leave it OFF to immediately activate accounts upon sign-up.

### B. Google OAuth
1. Go to **Google Cloud Console → APIs & Services → Credentials**.
2. Create an **OAuth 2.0 Client ID** with Application Type: **Web application**.
3. Under **Authorized redirect URIs**, add your Supabase callback URL:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
4. Copy the **Client ID** and **Client Secret**.
5. In Supabase Dashboard, go to **Authentication → Providers → Google**, enable the toggle, and paste your Client ID and Client Secret.

### C. Phone OTP (Optional SMS Gateway)
1. In Supabase Dashboard, navigate to **Authentication → Providers → Phone**.
2. Enable Phone provider and select your SMS provider (Twilio, MessageBird, or Textlocal).
3. Fill in the Account SID, Auth Token, and Sender ID.

---

## 3. Database Schema & Migration Execution

All relational tables, enums, foreign keys, triggers, and Row Level Security (RLS) policies are version-controlled under `supabase/migrations/20261124000000_sahkarsathi_schema.sql`.

### Option A: Using the Supabase Web SQL Editor (Fastest)
1. Open the [Supabase Dashboard](https://supabase.com/dashboard) and navigate to **SQL Editor**.
2. Click **New query**.
3. Copy the contents of `supabase/migrations/20261124000000_sahkarsathi_schema.sql` from this repository.
4. Paste into the query window and click **Run**.
5. Verify in **Table Editor** that all 16 tables are created with green RLS shields.

### Option B: Using the Supabase CLI
```bash
# Link local repository to your remote Supabase project
npx supabase link --project-ref <your-project-ref>

# Push the migration
npx supabase db push
```

---

## 4. Configuring Private Storage for Worker Documents

To comply with the **Digital Personal Data Protection (DPDP) Act 2023**, worker government IDs and police clearance documents must be placed in a **Private Storage Bucket**.

1. In Supabase Dashboard, navigate to **Storage → Buckets**.
2. Click **New Bucket**.
3. Set **Name:** `worker-verification-docs`.
4. Ensure **Public bucket** is toggled **OFF** (Private).
5. Click **Save bucket**.
6. Under **Policies**, add storage policies:
   - **Allow Workers to upload:** `(bucket_id = 'worker-verification-docs' AND auth.uid()::text = (storage.foldername(name))[1])`
   - **Allow Workers and Supervisors to read:** `(bucket_id = 'worker-verification-docs' AND (auth.uid()::text = (storage.foldername(name))[1] OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'supervisor')))`

---

## 5. Adding Environment Variables

1. Copy `.env.example` to create `.env` in the project root:
   ```bash
   cp .env.example .env
   ```
2. Retrieve your Supabase keys from **Project Settings → API**:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`
3. Edit `.env`:
   ```ini
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Verify that `.env` is listed in `.gitignore` so secrets are never pushed to git.

---

## 6. Running the Application Locally

```bash
# Install dependencies
npm.cmd install

# Start Vite local development server
npm.cmd run dev
```

The application will be accessible at `http://localhost:5173`.

---

## 7. Role-Based Access Control (RBAC) Architecture

- When a user signs up on `/register`, their chosen role (`customer`, `worker`, or `supervisor`) is passed in `user_metadata`.
- The PostgreSQL trigger `public.handle_new_user()` executes with `SECURITY DEFINER` on `auth.users` insertion:
  1. Inserts a row in `public.profiles` with the validated role enum.
  2. Creates the corresponding sub-profile row in `customer_profiles`, `worker_profiles`, or `supervisor_profiles`.
- PostgreSQL **Row Level Security (RLS)** ensures:
  - Customers can only select and mutate their own bookings.
  - Workers can only view assigned dispatches and edit their own skills.
  - Supervisors can only certify milestones and view workers registered to their cooperative zone.
- Changing browser URLs or localStorage keys will **never** grant unauthorized database read/write access.

---

## 8. Troubleshooting Common Errors

### "Invalid API Key" or 401 Unauthorized
- Ensure `VITE_SUPABASE_URL` begins with `https://` and has no trailing slash.
- Ensure you used the `anon public` key, not the `service_role` secret key.
- Restart the Vite dev server (`npm run dev`) after editing `.env` to reload environment variables.

### "duplicate key value violates unique constraint profiles_email_key"
- An account already exists with that email address. Direct the user to the Sign In screen (`/login`).

### "new row violates row-level security policy"
- The authenticated user is attempting to perform an action prohibited by database RLS rules (for example, a customer trying to certify a worker milestone, or a user writing to another user's profile). Verify the active session role.

### "Bucket not found: worker-verification-docs"
- Ensure you created the private bucket `worker-verification-docs` in Supabase Storage with exact naming.

---

## 9. Real-Time Notifications & Messaging Architecture (Phase 8)

SahkarSathi features live, bidirectional real-time notifications and an escrow-protected direct communication center.

### A. Real-Time Replication Setup
1. In the Supabase Dashboard, navigate to **Database → Publications**.
2. Select `supabase_realtime` and ensure the following tables are toggled **ON**:
   - `public.notifications`
   - `public.messages`
   - `public.conversations`
   - `public.conversation_participants`
3. If running SQL directly, execute `supabase/migrations/20261124000001_realtime_notifications_messages.sql`.

### B. Communication Center Permissions & Privacy
- **Access Isolation**: Users can only read conversations and messages where they are an active, registered participant in `conversation_participants`.
- **Escrow Linkage**: Every conversation is tied to an active booking (`booking_id`) or infrastructure project (`project_id`). Arbitrary unauthorized messaging between unlinked accounts is blocked at both RLS and frontend service layers.
- **Real-Time Streaming**: The frontend subscribes via `supabase.channel('realtime-chat-<conversation_id>')` with instant delivery without polling. Unsubscribes automatically when changing conversations or leaving the dashboard.

---

## 10. Transactional Email Setup (Optional)

SahkarSathi includes a structured transactional email service (`src/services/emailService.js`) designed for booking confirmations, worker assignments, and verification updates.

### Setting Up Resend (Recommended)
1. Sign up at [Resend](https://resend.com) and create an API Key.
2. In your `.env` file, add:
   ```env
   VITE_RESEND_API_KEY="re_123456789..."
   ```
3. Set your verified domain sender in `emailService.js` (e.g., `notifications@sahkarsathi.coop`).
4. In production without frontend API exposure, dispatch transactional emails through Supabase Database Webhooks calling a Supabase Edge Function (`supabase functions new send-email`).

---

## 11. Complete Booking Lifecycle, Scheduling & Conflict Prevention (Phase 9)

SahkarSathi synchronizes booking lifecycles across Customer, Worker, and Supervisor dashboards from a unified PostgreSQL database with automated conflict checks.

### A. Booking Lifecycle Transitions
- Validated lifecycle states: `requested` → `accepted` → `confirmed` → `worker_assigned` → `scheduled` → `in_progress` → `completed`.
- Controlled branch states: `reschedule_requested`, `cancelled`, and `rejected`.
- Transitions are validated against `VALID_STATUS_TRANSITIONS` in `src/services/bookingService.js` and audited in `public.booking_timeline_events`.

### B. Scheduling Conflict Prevention
- PostgreSQL trigger `trg_check_worker_overlap` prevents assigning or confirming two non-completed/non-cancelled bookings for the same artisan on the same date and overlapping time slot.
- The frontend performs pre-flight conflict validation in `bookingService.checkWorkerAvailability(...)` before supervisor dispatch.

### C. Rescheduling Architecture
- Rescheduling requests are preserved in `public.booking_reschedule_requests` with original and requested slots.
- Original booking times are never overwritten silently; only upon supervisor/artisan approval does the booking record update its final schedule.
- Reschedule approvals check for worker time slot conflicts before ratification.

### D. Real-Time Timeline & Subscriptions
- Execute `supabase/migrations/20261124000002_booking_lifecycle_scheduling.sql` to apply the timeline and reschedule tables.
- In Supabase Dashboard under **Database → Publications → `supabase_realtime`**, ensure `public.bookings`, `public.booking_timeline_events`, and `public.booking_reschedule_requests` are enabled.

---

## 12. Direct PhonePe, Paytm, Google Pay UPI QR Payments & Verification (Phase 10)

SahkarSathi implements a cooperative-first, zero-commission direct payment settlement architecture supporting **PhonePe**, **Paytm**, and **Google Pay**.

### A. Cooperative Direct Settlement Model
- **Zero Middleman Markup:** The platform does not collect, hold, or escrow customer payments in this phase.
- **Direct Payout:** Homeowners transfer service fees directly to the assigned trade artisan or supervisor's bank account via standard UPI rails.
- **Multi-App Support:** Artisans configure and activate their genuine UPI Virtual Payment Addresses (VPAs) for PhonePe (`@ybl`, `@ibl`), Paytm (`@paytm`), and Google Pay (`@okhdfcbank`, `@okaxis`, `@oksbi`, `@okicici`).

### B. Genuine NPCI UPI QR Matrix & Deep-Link Spec
- Dynamic scannable QR matrices are generated client-side following ISO/IEC 18004 standards and National Payments Corporation of India (NPCI) UPI specification:
  ```
  upi://pay?pa=<payee_vpa>&pn=<payee_name>&am=<amount>&cu=INR&tn=<booking_code>
  ```
- Instant deep-link app launch triggers on mobile devices:
  - PhonePe: `phonepe://pay?pa=...`
  - Paytm: `paytmmp://pay?pa=...`
  - Google Pay: `tez://upi/pay?pa=...`

### C. Database Migration & Tables
Run migration `supabase/migrations/20261124000003_upi_qr_payments.sql` in the Supabase SQL Editor:
1. `public.user_payment_settings`:
   - Stores worker and supervisor UPI addresses for `phonepe`, `paytm`, and `gpay`.
   - Tracks `is_enabled`, `is_preferred`, and validation checks.
2. `public.payment_records`:
   - Enhanced schema capturing `app_name`, `recipient_upi_id`, `utr_reference` (12-digit bank reference), `payment_status` (`unpaid`, `payment_initiated`, `pending_verification`, `paid`, `rejected`, `refund_requested`, `refunded`), `verified_by_user_id`, and `verified_at`.

### D. Independent Two-Party Verification Workflow
1. **Customer Submission:** Upon completing payment in PhonePe, Paytm, or Google Pay, the customer inputs their 12-digit banking UTR / Transaction ID (validated via `^\d{12}$`).
2. **Pending State:** Status transitions to `pending_verification`. The customer is clearly informed that their reference is under verification by the artisan.
3. **Recipient Statement Check:** The assigned worker or supervisor opens their Payment Settings / Ledger, checks their bank app or SMS notification for the matching 12-digit UTR, and confirms or rejects with a documented reason.
4. **Audit Trail:** Every verification or rejection event records the verifier's identity, timestamp, and audit notes. Client-side fake approvals or instant automated validations are strictly prohibited.

### E. Real-Time Payment Replication
In your Supabase Dashboard under **Database → Publications → `supabase_realtime`**, ensure both:
- `public.user_payment_settings`
- `public.payment_records`
are enabled for instant status synchronization across Customer, Worker, and Supervisor screens.

---

## 13. Admin Panel, Role-Based Access Control & Audit Logging Architecture (Phase 11)

SahkarSathi features an executive administration terminal for platform governance, artisan accreditation, dispute resolution, rate card management, and immutable compliance auditing.

### A. Four-Tier Role Segregation
SahkarSathi strictly segregates authentication into four roles:
1. `customer`: Verified homeowners booking services, approving milestones, and paying directly via UPI.
2. `worker`: Accredited trade craftsmen accepting dispatches and managing direct earnings.
3. `supervisor`: Field engineering leads coordinating multi-trade projects and certifying on-site quality.
4. `admin`: Central executive compliance officers, registrars, and mediators.

**Security Mandate:** Public registration (`/register`) is strictly restricted to `customer`, `worker`, and `supervisor`. Administrative privileges can **never** be obtained by self-selection during registration; they must be provisioned through secure backend insertion into `public.admin_users`.

### B. Provisioning an Admin User
To authorize a new administrator in Supabase:
1. Create or identify the user account in Supabase Auth (e.g. `arvind.swaminathan@sahkarsathi.coop`).
2. In the Supabase SQL Editor, execute:
   ```sql
   INSERT INTO public.admin_users (user_id, admin_code, full_name, role_title, department, permissions)
   VALUES (
     '<auth-user-uuid>',
     'ADM-COOP-01',
     'Arvind Swaminathan',
     'Chief Cooperative Registrar & Compliance Officer',
     'Central Executive Oversight & Dispute Mediation',
     '["all"]'::jsonb
   );

   -- Update user profile role
   UPDATE public.profiles
   SET role = 'admin'
   WHERE id = '<auth-user-uuid>';
   ```

### C. Database Migration & Schema
Run migration `supabase/migrations/20261124000004_admin_platform_management.sql`:
1. `public.admin_users`: Secure table holding verified administrator credentials and department metadata.
2. `public.admin_audit_logs`: Immutable audit log table recording every administrative decision (action type, admin ID, affected entity, timestamp, and mandatory written justification).
3. `public.support_tickets`: Grievance and support ticketing system connecting customers, workers, and supervisors.
4. `public.platform_settings`: Central operational parameters, operating cities, cancellation grace windows, and emergency maintenance toggle.
5. `public.services_catalog`: Dynamic trade service catalog with real-time synchronization to the Customer Dashboard.

### D. Administrative Security & Immutable Audit Logging
- **Protected Routes:** All `/admin/*` routes are guarded by `AdminRouteGuard`, verifying active session tokens and blocking unauthorized access.
- **Mandatory Justification:** Every status change (suspending a user, rejecting a worker application, overriding a booking schedule, or editing rate cards) requires a written legal justification that is saved into `public.admin_audit_logs`.
- **Private Document Vault:** Artisan identity documents and NSQF trade certificates remain in private storage (`worker-verification-docs`). Redacted previews prevent unnecessary exposure of sensitive identity data.

### E. Real-Time Publications
Ensure the following tables are enabled in Supabase Realtime (`Database → Publications → supabase_realtime`):
- `public.admin_audit_logs`
- `public.support_tickets`
- `public.services_catalog`

---

## 14. Advanced Search, Multi-Factor Worker Discovery & Saved Craftsmen (Phase 12)

SahkarSathi delivers an open, privacy-compliant discovery and multi-factor matching engine allowing homeowners to search for services and verified artisans without algorithmic lock-in or surge pricing.

### A. Global Multi-Entity Search Architecture
- **Unified Search Bar (`src/components/common/GlobalSearchBar.jsx`):** Supports debounced, case-insensitive keyword matching across service titles, trade categories, artisan names, and certified skills.
- **Autocomplete Suggestions:** Categorized suggestions distinguishing between services and accredited craftsmen.
- **Recent Searches:** Automatically tracks client search history in local storage with clear-all controls.

### B. Transparent Worker Matching & Availability Scoring
The discovery engine (`src/services/discoveryService.js`) ranks available workers using an objective scoring model:
- **Trade Category Match:** +25 points
- **Service Area Coverage:** +20 points
- **Verified Standing (NSQF Level 4/5):** +15 points
- **High Quality Rating (★ 4.8+):** +10 points
- **Slot Availability:** +15 points
- **"Recommended" Label:** Applied strictly when a worker achieves a score $\ge$ 85%.

### C. Live Booking Availability Integration
- Worker discovery integrates directly with `bookingService.checkWorkerAvailability`.
- Selecting a preferred date and time slot cross-checks the worker's confirmed schedule against existing non-cancelled bookings.
- Overlapping bookings are blocked by the database trigger `trg_check_worker_overlap`.

### D. Privacy-Safe Public Profiles
- Public profiles (`WorkerProfileModal.jsx`) restrict displayed information strictly to public-approved fields: display name, profile photo, verified skills, experience years, chapter unit, reviews, and completed jobs.
- Sensitive identity documents, Aadhaar details, personal bank VPAs, and personal phone numbers remain cryptographically isolated and hidden from public search APIs.

### E. Database Migration & Saved Workers Table
Run migration `supabase/migrations/20261124000005_search_discovery_saved_workers.sql`:
1. `public.saved_workers`:
   - Stores personal customer bookmarks with foreign key to `auth.users(id)`.
   - Protected by Row Level Security (RLS) so customers can only view, insert, and delete their own saved craftsmen.
2. Full-Text Search GIN Index:
   - Implemented via `to_tsvector('english', title || ' ' || coalesce(short_desc, '') || ' ' || category)` on `public.services_catalog`.
3. Enable `public.saved_workers` in `supabase_realtime` publication.

---

## 15. Reviews, Ratings, and Customer Feedback (Phase 13)

SahkarSathi delivers a fully integrated review, rating, and feedback engine strictly coupled to genuine completed services.

### A. Review Eligibility & Anti-Fraud Governance
To prevent fake reviews, review brigading, and rating manipulation, the backend implements strict validation rules:
- **Completion Check:** A review can only be submitted for a booking with status `completed`.
- **Identity Matching:** The review author must match `booking.customer_id`, and the target artisan must match the assigned worker.
- **Self-Review Prevention:** Database constraint `check_different_customer_worker` prevents users from reviewing themselves.
- **Uniqueness Constraint:** Database constraint `unique_customer_worker_booking_review` limits customers to exactly one review per artisan per completed booking.
- **Honest Feedback Encouraged:** Positive or critical reviews are welcomed. Reviews cannot be deleted simply for containing constructive criticism.

### B. Rating Scale & Multi-Factor Craft Breakdown
- **Overall Score:** 1 to 5 stars.
- **Optional Detailed Categories:**
  - `service_quality` (Technical craft standards and finish)
  - `professionalism` (Respect, conduct, and site care)
  - `punctuality` (Adherence to schedule)
  - `communication` (Clarity on scope and pricing)
  - `overall_experience` (Cooperative satisfaction)
- **Aggregation:** Ratings are computed directly from published review records (`reviewService.getWorkerRatingSummary`). No hardcoded or fabricated scores exist.

### C. Artisan Response & Two-Way Dialogue
- Workers can view reviews submitted for their completed dispatches.
- Workers can submit **one professional response** per review (`public.review_responses`).
- Customers receive real-time notifications when an artisan responds.
- Workers cannot alter star ratings or customer feedback text.

### D. Customer Review Management & Review Guidelines
- **Customer Dashboard ("My Reviews"):** Located at `/customer/reviews`. Customers can inspect past reviews, view artisan responses, edit reviews with version history tracking, or launch reviews for newly completed jobs.
- **Community Policy (`/review-guidelines`):** Explains standards for authentic reviews, prohibition of profanity or private details (DPDP Act compliance), and the neutral grievance process.

### E. Admin Moderation & Audit Logging
- **Admin Review Moderation (`/admin/reviews`):**
  - Allows platform moderators to inspect reported or flagged reviews.
  - Reviews violating platform policies (e.g. sharing phone numbers or hate speech) can be temporarily hidden.
  - Every moderation decision requires a mandatory written reason and is logged into `public.admin_audit_logs`.
  - Silent rating manipulation is strictly blocked.

### F. Database Migration & Realtime
Run migration `supabase/migrations/20261124000006_reviews_ratings_feedback.sql`:
1. `public.reviews`
2. `public.review_responses`
3. `public.review_reports`
4. Added to `supabase_realtime` publication.




