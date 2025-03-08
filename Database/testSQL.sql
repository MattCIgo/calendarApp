INSERT INTO public.user (user_id, first_name, last_name, email, password)
VALUES (111111111, 'Matt', 'Igo', 'mcigo332@gmail.com', 'abc123');

select * 
from public.user;

delete from "user";

drop table "user";

drop schema Workflow;

select * 
from public.authtoken_token;

delete from authtoken_token;