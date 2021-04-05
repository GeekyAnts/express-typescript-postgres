CREATE TABLE public.__creation_log(
	created_by integer NOT NULL DEFAULT __current_user(),
	created_date timestamp without time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
	)
	COMMENT ON TABLE public.__creation_log
		IS 'This TABLE is for inheritance use only. It is NOT intended to contain its own data.'