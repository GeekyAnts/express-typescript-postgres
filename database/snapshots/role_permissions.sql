CREATE TABLE public.role_permissions(
	created_by integer NOT NULL DEFAULT __current_user(),
	created_date timestamp without time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
	modified_by integer NULL,
	modified_date timestamp without time zone NULL,
	deleted boolean NOT NULL DEFAULT false,
	deleted_by integer NULL,
	deleted_date timestamp without time zone NULL,
	id_role integer NOT NULL,
	id_permission integer NOT NULL,
	CONSTRAINT pk_role_permissions PRIMARY KEY (id_role),
	CONSTRAINT pk_role_permissions PRIMARY KEY (id_role),
	CONSTRAINT pk_role_permissions PRIMARY KEY (id_permission),
	CONSTRAINT pk_role_permissions PRIMARY KEY (id_permission) 
	)
	