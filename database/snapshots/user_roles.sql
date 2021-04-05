CREATE TABLE public.user_roles(
	created_by integer NOT NULL DEFAULT __current_user(),
	created_date timestamp without time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
	modified_by integer NULL,
	modified_date timestamp without time zone NULL,
	deleted boolean NOT NULL DEFAULT false,
	deleted_by integer NULL,
	deleted_date timestamp without time zone NULL,
	id integer NOT NULL DEFAULT nextval('user_roles_id_seq'::regclass),
	id_user integer NOT NULL,
	id_role integer NOT NULL,
	CONSTRAINT pk_user_roles_id PRIMARY KEY (id),
	CONSTRAINT uk_user_roles UNIQUE (id_user),
	CONSTRAINT uk_user_roles UNIQUE (id_user),
	CONSTRAINT uk_user_roles UNIQUE (id_role),
	CONSTRAINT uk_user_roles UNIQUE (id_role),
	CONSTRAINT fk_user_role_user_pk FOREIGN KEY (id_user) REFERENCES public.users (id),
	CONSTRAINT fk_user_role_role_pk FOREIGN KEY (id_role) REFERENCES public.roles (id) 
	)
	