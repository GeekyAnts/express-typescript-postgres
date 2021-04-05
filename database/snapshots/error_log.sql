CREATE TABLE public.error_log(
	created_by integer NOT NULL DEFAULT __current_user(),
	created_date timestamp without time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
	modified_by integer NULL,
	modified_date timestamp without time zone NULL,
	deleted boolean NOT NULL DEFAULT false,
	deleted_by integer NULL,
	deleted_date timestamp without time zone NULL,
	id integer NOT NULL DEFAULT nextval('error_log_id_seq'::regclass),
	id_et_type integer NOT NULL,
	id_device integer NULL,
	id_user integer NULL,
	code character varying NOT NULL,
	message character varying NOT NULL,
	details character varying NOT NULL,
	CONSTRAINT pk_error_log PRIMARY KEY (id) 
	)
	COMMENT ON TABLE public.error_log
		IS 'Errors logged include system-level and event violations (for example, attempting to test the wrong unit on a given fixture), etc, but excluding sensor test results and outcomes (pass/fail).
The data included when an error occurs depends on when it occurs. For example, a script error when booting the API server will only have the database update script identifier (id_dbu_script). In contrast, a query or application error that occurs during an impact test will have data for all COLUMNs.'