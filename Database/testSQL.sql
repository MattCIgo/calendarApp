INSERT INTO public.user (user_id, first_name, last_name, email, password)
VALUES (385697154, 'Matt', 'Igo', 'mcigo332@gmail.com', 'Otto1234');

insert into public.user_note (note_id, message, user_id)
values (111111111, 'hihihihi', '385697154');

set search_path

select * 
from public.user;


select * 
from public.user_note;

delete from "user";

delete from "user_note";

drop table "user";

drop table "user_note";

drop schema Workflow;

select * 
from public.authtoken_token;

delete from authtoken_token;

/* used tables: user, auth_token*/