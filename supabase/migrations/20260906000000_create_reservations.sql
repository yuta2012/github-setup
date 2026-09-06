create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  person text not null,
  reservation_date date not null,
  start_time time not null,
  end_time time not null,
  destination text not null,
  note text,
  created_at timestamptz not null default now(),
  constraint reservations_valid_time check (end_time > start_time)
);

create index if not exists reservations_date_idx
  on public.reservations (reservation_date, start_time);

alter table public.reservations enable row level security;

create policy "family can read reservations"
  on public.reservations for select
  to anon, authenticated
  using (true);

create policy "family can create reservations"
  on public.reservations for insert
  to anon, authenticated
  with check (true);

create policy "family can delete reservations"
  on public.reservations for delete
  to anon, authenticated
  using (true);

create or replace function public.prevent_reservation_overlap()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1
    from public.reservations existing
    where existing.reservation_date = new.reservation_date
      and existing.id <> new.id
      and new.start_time < existing.end_time
      and new.end_time > existing.start_time
  ) then
    raise exclusion_violation using message = 'The reservation time overlaps an existing reservation';
  end if;
  return new;
end;
$$;

drop trigger if exists reservations_prevent_overlap on public.reservations;
create trigger reservations_prevent_overlap
  before insert or update on public.reservations
  for each row execute function public.prevent_reservation_overlap();
