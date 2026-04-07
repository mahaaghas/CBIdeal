create extension if not exists pgcrypto;

create table if not exists public.consultation_submissions (
  id uuid primary key default gen_random_uuid(),
  reference_id text not null unique,
  full_name text not null,
  email text not null,
  phone_whatsapp text not null,
  country_of_residence text not null,
  nationality text not null,
  interested_in text not null,
  budget_range text not null,
  preferred_contact_method text not null,
  family_application text,
  timeline text,
  current_residency_status text,
  message text not null,
  language text not null,
  source_page text not null,
  source_category text,
  source_url text not null,
  campaign text,
  user_agent text,
  submitted_at timestamptz not null default now(),
  submission_status text not null default 'received',
  email_status text not null default 'pending',
  email_message_id text,
  email_recipients text[] not null default '{}',
  email_error text,
  crm_sync_status text not null default 'pending',
  crm_record_id text,
  crm_error text,
  thank_you_status text not null default 'not_confirmed',
  thank_you_confirmed_at timestamptz,
  conversion_status text not null default 'not_triggered',
  conversion_event_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists consultation_submissions_submitted_at_idx
  on public.consultation_submissions (submitted_at desc);

create index if not exists consultation_submissions_source_page_idx
  on public.consultation_submissions (source_page);

create or replace function public.set_consultation_submissions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists consultation_submissions_set_updated_at on public.consultation_submissions;

create trigger consultation_submissions_set_updated_at
before update on public.consultation_submissions
for each row
execute function public.set_consultation_submissions_updated_at();
