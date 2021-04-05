CREATE TABLE public.database_updates(
	created_by integer NOT NULL DEFAULT __current_user(),
	created_date timestamp without time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
	modified_by integer NULL,
	modified_date timestamp without time zone NULL,
	deleted boolean NOT NULL DEFAULT false,
	deleted_by integer NULL,
	deleted_date timestamp without time zone NULL,
	id integer NOT NULL DEFAULT nextval('database_updates_id_seq'::regclass),
	id_dbupdate_status integer NOT NULL,
	script_name character varying NOT NULL,
	script_sql character varying NOT NULL,
	script_results character varying NULL,
	execution_date timestamp without time zone NULL,
	description character varying NULL,
	CONSTRAINT pk_database_updates PRIMARY KEY (id),
	CONSTRAINT fk_database_updates_statuses FOREIGN KEY (id_dbupdate_status) REFERENCES public.database_update_statuses (id) 
	)
	COMMENT ON TABLE public.database_updates
		IS 'Newly INSERTed scripts would, by default, have a status of Pending. 
During an autoupdate, Successful or Failed scripts would be marked as such, 
script results would be updated as noted in the comments of the 
database_script_statuses TABLE, and for Successful scripts, 
the database version would be incremented. Script execution stops whenever a script fails. 
A previously Failed script of a given name is added again to database_updates during the next autoupdate; 
the original Failed script record is NOT removed or modified. 
Therefore, this TABLE  also acts as a log of script execution attempts. 
(More accurately, ALL scripts whose dated and numbered filename is subsequent to the 
last successfully executed script and has not previously been INSERTed are added to the 
database_updates TABLE during each API server boot.)'