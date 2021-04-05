CREATE TABLE public.database_update_statuses(
	created_by integer NOT NULL DEFAULT __current_user(),
	created_date timestamp without time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
	modified_by integer NULL,
	modified_date timestamp without time zone NULL,
	deleted boolean NOT NULL DEFAULT false,
	deleted_by integer NULL,
	deleted_date timestamp without time zone NULL,
	id integer NOT NULL DEFAULT nextval('database_update_statuses_id_seq'::regclass),
	name character varying NOT NULL,
	label character varying NOT NULL,
	description character varying NOT NULL,
	CONSTRAINT pk_database_update_statuses PRIMARY KEY (id),
	CONSTRAINT ak_database_update_statuses UNIQUE (name) 
	)
	COMMENT ON TABLE public.database_update_statuses
		IS 'Potential Data:
  Pending - Script execution has not occurred, yet. This is the default status when a new autoupdate script is INSERTed into database_updates.
  Successful - Script execution completed without error. Results (number of records added, modified, deleted...) of successful script executions should be added to script_results in database_updates.
  Failed - Script execution was unsuccessful. Results (error messages/codes...) of failed script executions should be added to script_results in database_updates.'