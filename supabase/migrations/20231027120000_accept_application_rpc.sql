create or replace function accept_application_and_update_project(
  p_id uuid,
  a_id uuid,
  f_id uuid
) 
returns void as $$
begin
  -- Update project status and assign freelancer
  update public.projects
  set 
    status = 'in-progress',
    freelancer_id = f_id
  where id = p_id;

  -- Accept the chosen application
  update public.applications
  set status = 'accepted'
  where id = a_id;

  -- Reject other pending applications for the same project
  update public.applications
  set status = 'rejected'
  where 
    project_id = p_id and
    id != a_id and
    status = 'pending';

end;
$$ language plpgsql security definer;
