CREATE SCHEMA Workflow;

CREATE TABLE Workflow.user (
    user_id int,
    first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,
    email varchar(255),
    password varchar(50),
    PRIMARY KEY (user_id)
);