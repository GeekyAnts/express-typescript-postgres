/* ============================================================================================== */
/* DOMAIN: DOUBLE                                                                                 */
/* ============================================================================================== */
CREATE DOMAIN public.DOUBLE AS DOUBLE PRECISION;
ALTER DOMAIN public.DOUBLE OWNER TO postgres;

/* ============================================================================================== */
/* FUNCTION: __current_user()                                                                     */
/* ============================================================================================== */
DROP FUNCTION IF EXISTS public.__current_user();

CREATE OR REPLACE FUNCTION public.__current_user()
RETURNS INTEGER AS
    $BODY$
DECLARE
	UserID INTEGER = -1;
BEGIN
	SELECT id
	INTO STRICT
	UserID FROM public.users WHERE username = current_setting
	('postgres.username');
RETURN UserID;

EXCEPTION
WHEN UNDEFINED_OBJECT THEN
RETURN (SELECT id
FROM public.users
WHERE username = 'user_default');

WHEN NO_DATA_FOUND THEN
RETURN (SELECT id
FROM public.users
WHERE username = 'user_default');

WHEN TOO_MANY_ROWS THEN
RETURN (SELECT id
FROM public.users
WHERE username = 'user_default');
END;
    $BODY$
LANGUAGE plpgsql VOLATILE
COST 100;

ALTER FUNCTION public.__current_user() OWNER TO postgres;

/* ============================================================================================== */
/* TRIGGER FUNCTION: set_modified_by_user_at_date()                                               */
/* ============================================================================================== */
DROP FUNCTION IF EXISTS public.set_modified_by_user_at_date();

CREATE OR REPLACE FUNCTION public.set_modified_by_user_at_date()
  RETURNS TRIGGER AS
    $BODY$
    BEGIN
			NEW.modified_date = NOW() AT TIME ZONE 'UTC';
			NEW.modified_by = __current_user();
    RETURN NEW;
    END;
    $BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

ALTER FUNCTION public.set_modified_by_user_at_date() OWNER TO postgres;

/* ============================================================================================== */
/* TRIGGER FUNCTION: set_deleted_by_user_at_date()                                                */
/* ============================================================================================== */
DROP FUNCTION IF EXISTS public.set_deleted_by_user_at_date();

CREATE OR REPLACE FUNCTION public.set_deleted_by_user_at_date()
  RETURNS TRIGGER AS
    $BODY$
    BEGIN
        IF (NEW.deleted <> OLD.deleted AND NEW.deleted) THEN
          NEW.deleted_date = NOW() AT TIME ZONE 'UTC';
    NEW.deleted_by = __current_user();
    END
    IF;
			RETURN NEW;
    END;
    $BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

ALTER FUNCTION public.set_deleted_by_user_at_date() OWNER TO postgres;

--------------------------------------------------------------------------------------------------
-- 									Create Crypto Extension										--
--------------------------------------------------------------------------------------------------

CREATE EXTENSION pgcrypto;

/* ============================================================================================== */
/* TRIGGER FUNCTION: enforce_secure_pwd_storage()                                                 */
/* ============================================================================================== */
DROP FUNCTION IF EXISTS public.enforce_secure_pwd_storage();

CREATE OR REPLACE FUNCTION public.enforce_secure_pwd_storage()
  RETURNS TRIGGER AS
    $BODY$
    BEGIN
        IF NEW.hashpass IS NULL OR TRIM(NEW.hashpass)=''
          THEN
        SELECT crypt(gen_random_uuid()
        ::TEXT, gen_salt
        ('bf')) INTO NEW.hashpass;
    -- Generate unique, random, and secure (hashed/non-decipherable), but invalid (not known) passwords.
    ELSE
    SELECT crypt(NEW.hashpass, gen_salt('bf'))
    INTO NEW.hashpass;
    -- Make provided cleartext passwords secure (hashed/non-decipherable).
    END
    IF;
			RETURN NEW;
    END
    $BODY$
    LANGUAGE plpgsql VOLATILE
    COST 100;

ALTER FUNCTION public.enforce_secure_pwd_storage() OWNER TO postgres;

/* ============================================================================================== */
/* INHERITED TABLE: __creation_log                                                                */
/* ============================================================================================== */
DROP TABLE IF EXISTS public.__creation_log;

CREATE TABLE public.__creation_log(
	created_by INTEGER NOT NULL DEFAULT __current_user(),
	created_date TIMESTAMP NOT NULL DEFAULT TIMEZONE('UTC' ::TEXT, NOW())
)
WITH (OIDS=FALSE);

COMMENT ON TABLE public.__creation_log IS 'This TABLE is for inheritance use only. It is NOT intended to contain its own data.';

ALTER TABLE public.__creation_log OWNER TO postgres;

/* ============================================================================================== */
/* INHERITED TABLE: __modification_log                                                            */
/* ============================================================================================== */
DROP TABLE IF EXISTS public.__modification_log;

CREATE TABLE public.__modification_log(
	modified_by INTEGER,
	modified_date TIMESTAMP
) WITH (OIDS=FALSE);

COMMENT ON TABLE public.__modification_log IS 'This TABLE is for inheritance use only. It is NOT intended to contain its own data.';

ALTER TABLE public.__modification_log OWNER TO postgres;

/* ============================================================================================== */
/* INHERITED TABLE: __deletion_log                                                                */
/* ============================================================================================== */
DROP TABLE IF EXISTS public.__deletion_log;

CREATE TABLE public.__deletion_log(
	deleted BOOLEAN NOT NULL DEFAULT FALSE,
	deleted_by INTEGER,
	deleted_date TIMESTAMP
) WITH (OIDS=FALSE);

COMMENT ON TABLE public.__deletion_log IS 'This TABLE is for inheritance use only. It is NOT intended to contain its own data.';

ALTER TABLE public.__deletion_log OWNER TO postgres;

/*==============================================================*/
/* TABLE: database_update_statuses                               */
/*==============================================================*/
CREATE TABLE public.database_update_statuses(
	id SERIAL NOT NULL,
	name VARCHAR NOT NULL,
	label VARCHAR NOT NULL,
	description VARCHAR NOT NULL,
	CONSTRAINT pk_database_update_statuses PRIMARY KEY (id),
	CONSTRAINT ak_database_update_statuses UNIQUE (name)
)
INHERITS (public.__creation_log, public.__modification_log, public.__deletion_log)
WITH (OIDS=FALSE);

COMMENT ON TABLE public.database_update_statuses IS
'Potential Data:
  Pending - Script execution has not occurred, yet. This is the default status when a new autoupdate script is INSERTed into database_updates.
  Successful - Script execution completed without error. Results (number of records added, modified, deleted...) of successful script executions should be added to script_results in database_updates.
  Failed - Script execution was unsuccessful. Results (error messages/codes...) of failed script executions should be added to script_results in database_updates.';

ALTER TABLE public.database_update_statuses OWNER TO postgres;

/*==============================================================*/
/* TABLE: database_updates                                      */
/*==============================================================*/

CREATE TABLE public.database_updates(
	id SERIAL NOT NULL,
	id_dbupdate_status INTEGER NOT NULL,
	script_name VARCHAR NOT NULL,
	script_sql VARCHAR NOT NULL,
	script_results VARCHAR NULL,
	execution_date TIMESTAMP NULL,
	description VARCHAR NULL,
	CONSTRAINT pk_database_updates PRIMARY KEY (id),
	CONSTRAINT fk_database_updates_statuses FOREIGN KEY (id_dbupdate_status) REFERENCES public.database_update_statuses (id)
)
INHERITS (public.__creation_log, public.__modification_log, public.__deletion_log)
WITH (OIDS=FALSE);

COMMENT ON TABLE public.database_updates IS
'Newly INSERTed scripts would, by default, have a status of Pending. 
During an autoupdate, Successful or Failed scripts would be marked as such, 
script results would be updated as noted in the comments of the 
database_script_statuses TABLE, and for Successful scripts, 
the database version would be incremented. Script execution stops whenever a script fails. 
A previously Failed script of a given name is added again to database_updates during the next autoupdate; 
the original Failed script record is NOT removed or modified. 
Therefore, this TABLE  also acts as a log of script execution attempts. 
(More accurately, ALL scripts whose dated and numbered filename is subsequent to the 
last successfully executed script and has not previously been INSERTed are added to the 
database_updates TABLE during each API server boot.)';

ALTER TABLE public.database_updates OWNER TO postgres;

/*==============================================================*/
/* TABLE: users                                                 */
/*==============================================================*/

CREATE TABLE public.users(
  id SERIAL NOT NULL,
  username VARCHAR NOT NULL,
  salt VARCHAR NOT NULL,
  hashpass VARCHAR NOT NULL,
	CONSTRAINT pk_users PRIMARY KEY (id),
	CONSTRAINT ak_user_username UNIQUE (username)
)
INHERITS (public.__creation_log, public.__modification_log, public.__deletion_log)
WITH (OIDS=FALSE);

ALTER TABLE public.users OWNER TO postgres;

DROP TRIGGER IF EXISTS users_enforce_secure_pwd_storage on users;

CREATE TRIGGER users_enforce_secure_pwd_storage
	BEFORE INSERT OR UPDATE OF hashpass ON users
	FOR EACH ROW
	EXECUTE PROCEDURE enforce_secure_pwd_storage();

insert into public.users (created_by, id, username, salt, hashpass) 
  values (1, 1, 'user_default', 'default', 'user_default');

/*==============================================================*/
/* Function to update auto update schema                        */
/*==============================================================*/

CREATE OR REPLACE FUNCTION public.db_auto_schema_update()
  RETURNS boolean
  LANGUAGE 'plpgsql'
  COST 100
  VOLATILE 
AS $BODY$
DECLARE
    rec RECORD;
    error BOOLEAN := FALSE;
    errorMsg TEXT;
	results TEXT := '';
	rowCount INTEGER := 0;
  BEGIN
    CREATE TEMPORARY TABLE update_scripts AS -- Using a temporary table allows DDL/DML scripts to also target ittDatabaseUpdates
      SELECT id, script_sql, script_results, script_name
        FROM database_updates
       WHERE id_dbupdate_status IN (SELECT id FROM database_update_statuses WHERE name IN ('pending'))    -- Only previously failed or pending records are processed; the former must be fixed before processing can continue
         AND script_name > ( SELECT COALESCE( 
			 (SELECT MAX(script_name) FROM database_updates 
			  WHERE id_dbupdate_status = (SELECT id FROM database_update_statuses WHERE name = 'successful')), '' ) )    -- Empty string needed when no 'successful' scripts have been executed, such as when all scripts are pending.
       ORDER BY script_name; -- A defined name format dictates execution order

    FOR rec IN
      SELECT * FROM update_scripts
    LOOP
      BEGIN
        EXECUTE rec.script_sql;
      EXCEPTION
        WHEN OTHERS THEN -- Failure (Trap ALL Errors)
          error := TRUE;
          errorMsg := 'Database schema update failed on script having id = ' || rec.id || '. Error: ' || SQLSTATE || ' - ' || SQLERRM;
          RAISE WARNING USING MESSAGE = errorMsg;
      END;
      IF error THEN
        UPDATE database_updates SET id_dbupdate_status = (SELECT id FROM database_update_statuses WHERE name = 'failed'), script_results = 'WARNING: '||errorMsg WHERE id=rec.id;
        EXIT;  -- Stop processing scripts on first error
      ELSE
	  	IF FOUND THEN
			GET DIAGNOSTICS rowCount := ROW_COUNT;
	  		results := 'Affected rows from last SQL call in ' || rec.script_name || ': ' || rowCount;
		END IF;
        UPDATE database_updates SET id_dbupdate_status = (SELECT id FROM database_update_statuses WHERE name = 'successful'), script_results = results WHERE id = rec.id;
      END IF;
    END LOOP;

    DROP TABLE IF EXISTS update_scripts;
    RETURN NOT error;
  END
$BODY$;

ALTER FUNCTION public.db_auto_schema_update()
  OWNER TO postgres;

INSERT INTO "database_update_statuses" (id, name, label, description)
VALUES ('1', 'pending', 'Script execution has not occurred, yet.', 'This is the default status when a new autoupdate script is INSERTed into database_updates.'),
  ('2', 'successful', 'Script execution completed without error.', 'Results (number of records added, modified, deleted...) of successful script executions should be added to script_results in database_updates.'),
  ('3', 'failed', 'Script execution was unsuccessful.', 'Results (error messages/codes...) of failed script executions should be added to script_results in database_updates.');