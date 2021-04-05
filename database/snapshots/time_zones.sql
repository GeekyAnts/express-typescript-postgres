CREATE TABLE public.time_zones(
	created_by integer NOT NULL DEFAULT __current_user(),
	created_date timestamp without time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
	modified_by integer NULL,
	modified_date timestamp without time zone NULL,
	deleted boolean NOT NULL DEFAULT false,
	deleted_by integer NULL,
	deleted_date timestamp without time zone NULL,
	id integer NOT NULL DEFAULT nextval('time_zones_id_seq'::regclass),
	tz_identifier character varying NOT NULL,
	id_country integer NULL,
	CONSTRAINT time_zones_pkey PRIMARY KEY (id),
	CONSTRAINT time_zones_tzIdentifier_key UNIQUE (tz_identifier),
	CONSTRAINT fk_time_zones_country FOREIGN KEY (id_country) REFERENCES public.countries (id) 
	)
	