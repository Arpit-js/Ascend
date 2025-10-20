-- Creates a function to securely delete a user and their public data.
create or replace function public.delete_user()
returns void
language plpgsql
security definer -- Important: Allows the function to bypass RLS
as $$
begin
  -- First, delete the user's profile from the public.users table
  delete from public.users where id = auth.uid();
  -- Then, delete the user from the auth.users table
  delete from auth.users where id = auth.uid();
end;
$$;

-- Grant execute permission to authenticated users
grant execute on function public.delete_user() to authenticated;