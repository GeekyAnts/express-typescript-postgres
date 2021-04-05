CREATE TABLE public.__deletion_log(
	deleted boolean NOT NULL DEFAULT false,
	deleted_by integer NULL,
	deleted_date timestamp without time zone NULL,
	)
	COMMENT ON TABLE public.__deletion_log
		IS 'This TABLE is for inheritance use only. It is NOT intended to contain its own data.'