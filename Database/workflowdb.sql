CREATE TABLE public.user (
    user_id int,
    first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,
    email varchar(255),
    password varchar(50),
    PRIMARY KEY (user_id)
);

/*Update table*/
CREATE TABLE public.user_note (
    note_id int primary key,
    message varchar(255),
    date_created TIMESTAMPTZ not null default now(),
    user_id int references public.user(user_id),
    primary key (user_id, note_id)
);