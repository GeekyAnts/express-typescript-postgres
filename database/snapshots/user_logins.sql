CREATE TABLE public.user_logins(
	created_by integer NOT NULL DEFAULT __current_user(),
	created_date timestamp without time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
	modified_by integer NULL,
	modified_date timestamp without time zone NULL,
	deleted boolean NOT NULL DEFAULT false,
	deleted_by integer NULL,
	deleted_date timestamp without time zone NULL,
	id integer NOT NULL DEFAULT nextval('user_logins_id_seq'::regclass),
	id_user integer NOT NULL,
	date timestamp without time zone NOT NULL,
	ip_address inet NOT NULL,
	host_name character varying NOT NULL,
	CONSTRAINT pk_user_logins PRIMARY KEY (id) 
	)
	