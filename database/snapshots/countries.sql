CREATE TABLE public.countries(
	created_by integer NOT NULL DEFAULT __current_user(),
	created_date timestamp without time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
	modified_by integer NULL,
	modified_date timestamp without time zone NULL,
	deleted boolean NOT NULL DEFAULT false,
	deleted_by integer NULL,
	deleted_date timestamp without time zone NULL,
	id integer NOT NULL DEFAULT nextval('countries_id_seq'::regclass),
	name character varying NOT NULL,
	label character varying NULL,
	description character varying NULL,
	CONSTRAINT pk_countries PRIMARY KEY (id),
	CONSTRAINT ak_countries UNIQUE (name) 
	)
	