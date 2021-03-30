/* ============================================================================================== */
/* START DEFAULT DATA                                                                             */
/* ============================================================================================== */

-- UPDATE pg_settings SET setting = 'user_default' WHERE name = 'database_name.username';

-- SELECT set_config('database_name.username', 'user_default', false);

UPDATE pg_settings SET setting = 'user_default' WHERE name = 'website.username';

SELECT set_config('website.username', 'user_default', false);
