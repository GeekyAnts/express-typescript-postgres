CREATE TABLE public.permissions(
	created_by integer NOT NULL DEFAULT __current_user(),
	created_date timestamp without time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
	modified_by integer NULL,
	modified_date timestamp without time zone NULL,
	deleted boolean NOT NULL DEFAULT false,
	deleted_by integer NULL,
	deleted_date timestamp without time zone NULL,
	id integer NOT NULL DEFAULT nextval('permissions_id_seq'::regclass),
	name character varying NOT NULL,
	label character varying NOT NULL,
	description character varying NOT NULL,
	CONSTRAINT pk_permissions PRIMARY KEY (id),
	CONSTRAINT ak_permissions UNIQUE (name) 
	)
	