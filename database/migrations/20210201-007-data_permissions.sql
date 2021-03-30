----------------------------------------------------------------
-- 									Permissions																--
----------------------------------------------------------------

-- INSERT INTO public.permissions(id, name, label, description) 
-- 	VALUES (1, 'user_read', 'User: Read', ''),
-- 	(2, 'user_create', 'User: Create', ''),
-- 	(3, 'user_update', 'User: Update', ''),
-- 	(4, 'user_delete', 'User: Delete', '');

----------------------------------------------------------------
-- 									Role Permissions																--
----------------------------------------------------------------

-- INSERT INTO public.role_permissions(id_role, id_permission)
-- 	VALUES (1, (select id from public.permissions where name = 'user_read')),
-- 	(1, (select id from public.permissions where name = 'user_create')),
-- 	(1, (select id from public.permissions where name = 'user_update')),
-- 	(1, (select id from public.permissions where name = 'user_delete'));