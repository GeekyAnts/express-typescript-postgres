CREATE TABLE public.__modification_log(
	modified_by integer NULL,
	modified_date timestamp without time zone NULL,
	)
	COMMENT ON TABLE public.__modification_log
		IS 'This TABLE is for inheritance use only. It is NOT intended to contain its own data.'