create extension if not exists pgcrypto;

create table if not exists public.workspace_signups (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null unique,
  user_id text not null unique,
  company_name text not null,
  company_slug text not null,
  plan_id text not null,
  owner_full_name text not null,
  owner_email text not null,
  password_hash text not null,
  subscription_status text not null default 'Pending' check (subscription_status in ('Pending', 'Active', 'Past due', 'Cancelled')),
  payment_status text not null default 'Pending' check (payment_status in ('Pending', 'Paid', 'Failed')),
  access_role text not null default 'workspace_owner' check (access_role in ('workspace_owner', 'internal_admin', 'super_admin')),
  internal_access boolean not null default false,
  billing_bypass boolean not null default false,
  feature_scope text not null default 'standard' check (feature_scope in ('standard', 'full_access')),
  stripe_checkout_session_id text,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  stripe_live_mode boolean,
  stripe_checkout_completed_at timestamptz,
  activated_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists workspace_signups_owner_email_lower_idx
  on public.workspace_signups (lower(owner_email));

create index if not exists workspace_signups_subscription_idx
  on public.workspace_signups (stripe_subscription_id);

create index if not exists workspace_signups_customer_idx
  on public.workspace_signups (stripe_customer_id);

create index if not exists workspace_signups_checkout_idx
  on public.workspace_signups (stripe_checkout_session_id);

create or replace function public.set_workspace_signups_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists workspace_signups_set_updated_at on public.workspace_signups;

create trigger workspace_signups_set_updated_at
before update on public.workspace_signups
for each row
execute function public.set_workspace_signups_updated_at();

alter table public.workspace_signups enable row level security;

revoke all on public.workspace_signups from anon, authenticated;

alter table public.workspace_signups
  drop constraint if exists workspace_signups_plan_id_check;

alter table public.workspace_signups
  add constraint workspace_signups_plan_id_check
  check (plan_id in ('solo', 'team', 'business'));

alter table public.workspace_signups
  add column if not exists access_role text not null default 'workspace_owner';

alter table public.workspace_signups
  add column if not exists internal_access boolean not null default false;

alter table public.workspace_signups
  add column if not exists billing_bypass boolean not null default false;

alter table public.workspace_signups
  add column if not exists feature_scope text not null default 'standard';

alter table public.workspace_signups
  drop constraint if exists workspace_signups_access_role_check;

alter table public.workspace_signups
  add constraint workspace_signups_access_role_check
  check (access_role in ('workspace_owner', 'internal_admin', 'super_admin'));

alter table public.workspace_signups
  drop constraint if exists workspace_signups_feature_scope_check;

alter table public.workspace_signups
  add constraint workspace_signups_feature_scope_check
  check (feature_scope in ('standard', 'full_access'));
