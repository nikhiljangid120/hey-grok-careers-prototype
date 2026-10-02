create extension if not exists pgcrypto;

create type public.application_status as enum (
  'SUBMITTED',
  'REVIEWING',
  'REJECTED',
  'HIRED'
);

create table public.jobs (
  id uuid primary key,
  slug text not null unique,
  title text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null,
  phone text,
  github_url text,
  linkedin_url text,
  portfolio_url text,
  cover_note text check (char_length(cover_note) <= 2000),
  resume_path text not null,
  status public.application_status not null default 'SUBMITTED',
  created_at timestamptz not null default now()
);

create unique index applications_job_email_unique
  on public.applications (job_id, lower(email));

alter table public.jobs enable row level security;
alter table public.applications enable row level security;

-- Candidate writes go through the server with the service-role key. No public
-- application or resume policies are created.

insert into public.jobs (id, slug, title) values
  ('62699ae1-d869-4620-b446-054cfa66ea84', 'senior-ml-engineer', 'Senior ML Engineer'),
  ('9f0a84c2-b700-4874-8cad-3da8fd9cfac8', 'product-designer', 'Product Designer'),
  ('15488177-0565-4288-936b-533f01010f5c', 'ai-safety-researcher', 'AI Safety Researcher'),
  ('6157d852-3f20-43d7-8137-9e097ab45312', 'full-stack-engineer', 'Full-Stack Engineer'),
  ('cde69702-02a9-4a6b-8c99-2c2ee09954e1', 'developer-advocate', 'Developer Advocate'),
  ('49096b13-74cc-4864-8066-74e5d0a9db13', 'content-marketing-manager', 'Content Marketing Manager')
on conflict (id) do update set
  slug = excluded.slug,
  title = excluded.title,
  active = true;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resumes',
  'resumes',
  false,
  5242880,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;