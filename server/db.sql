CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE USERS(userid uuid DEFAULT uuid_generate_v1(), name TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, bio TEXT,profile_img TEXT, PRIMARY KEY(userid));

SELECT (userid,name,email,password,bio) FROM USERS;

CREATE TABLE BLOGS(blogid uuid DEFAULT uuid_generate_v1(), userid uuid NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, author TEXT NOT NULL, category TEXT NOT NULL, createdon TEXT NOT NULL, totalviews INT NOT NULL, blog_img TEXT, keywords TEXT NOT NULL,author_img TEXT,PRIMARY KEY(blogid));

CREATE TABLE COMMENTS(commentid uuid DEFAULT uuid_generate_v1(), userid uuid NOT NULL,username TEXT NOT NULL, blogid uuid NOT NULL, commentbody TEXT NOT NULL,postedon TEXT NOT NULL,PRIMARY KEY(commentid), user_img TEXT);


CREATE TABLE FOLLOWS(id uuid DEFAULT uuid_generate_v1(), follower_id uuid NOT NULL,follower_name TEXT NOT NULL,
following_name TEXT NOT NULL ,following_id uuid NOT NULL, PRIMARY KEY(id));

CREATE TABLE LIKES (id uuid DEFAULT uuid_generate_v1(), userid uuid NOT NULL,username TEXT NOT NULL, blogid uuid NOT NULL ,PRIMARY KEY (id));

CREATE TABLE REPORTS ( id uuid DEFAULT uuid_generate_v1(), userid uuid  NOT NULL, username TEXT NOT NULL, blogid uuid NOT NULL, author TEXT NOT NULL, reason TEXT NOT NULL, PRIMARY KEY(id));