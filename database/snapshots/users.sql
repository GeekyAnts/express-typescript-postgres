CREATE TABLE public.users(
	created_by integer NOT NULL DEFAULT __current_user(),
	created_date timestamp without time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
	modified_by integer NULL,
	modified_date timestamp without time zone NULL,
	deleted boolean NOT NULL DEFAULT false,
	deleted_by integer NULL,
	deleted_date timestamp without time zone NULL,
	id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
	username character varying NOT NULL,
	salt character varying NOT NULL,
	hashpass character varying NOT NULL,
	CONSTRAINT pk_users PRIMARY KEY (id),
	CONSTRAINT ak_user_username UNIQUE (username) 
	)
	