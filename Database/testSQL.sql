INSERT INTO public.user (user_id, first_name, last_name, email, password)
VALUES (1234, 'Matt', 'Igo', 'mcigo332@gmail.com', 'abc123');

select * 
from public.user;

delete from Workflow.user;

drop table Workflow.user;

drop schema Workflow;