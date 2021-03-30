----------------------------------------------------------------
-- 									Insert Roles															--
----------------------------------------------------------------

INSERT INTO public.roles(id, name, label, rank, active, description) 
	VALUES (1, 'admin', 'Admin', 1, true, '');
-- 	(2, 'clinician', 'Clinician', 2, true, ''),
-- 	(3, 'patient', 'Patient', 3, true, '');

----------------------------------------------------------------
-- 									Default User's Role												--
----------------------------------------------------------------

INSERT INTO public.user_roles (id_user, id_role)
	VALUES (1, (select id from roles where name = 'admin'));
