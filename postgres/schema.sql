DO $$ BEGIN
--DROP ROLE IF EXISTS postgraphile;
CREATE ROLE postgraphile login PASSWORD 'ari';

--DROP ROLE IF EXISTS anonymous;
CREATE ROLE anonymous;
GRANT anonymous TO postgraphile;

--DROP ROLE IF EXISTS authenticated;
CREATE ROLE authenticated;
GRANT authenticated TO postgraphile;

--DROP ROLE IF EXISTS admin_authenticated;
CREATE ROLE admin_authenticated bypassrls;
GRANT admin_authenticated TO postgraphile;

EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE SCHEMA IF NOT EXISTS private;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


CREATE TABLE IF NOT EXISTS public.user (
	id					uuid primary key default uuid_generate_v1mc(),
	participation_id	text unique not null,
	first_name			text not null,
	last_name			text,
	grade				integer not null,
	exam_center			text,
	attendance			boolean
);

COMMENT ON TABLE public.user IS 'A contestant';
COMMENT ON COLUMN public.user.id IS 'Globally unique identifier';
COMMENT ON COLUMN public.user.participation_id IS 'Contestant participation identifier';
COMMENT ON COLUMN public.user.first_name IS 'Contestant first name';
COMMENT ON COLUMN public.user.last_name IS 'Contestant last name';
COMMENT ON COLUMN public.user.grade IS 'Contestant educational stage';
COMMENT ON COLUMN public.user.exam_center IS 'Contestant assigned exam center';
COMMENT ON COLUMN public.user.attendance IS 'Contestant attendance';


CREATE TABLE IF NOT EXISTS public.task (
	id					uuid primary key default uuid_generate_v1mc(),
	name				text not null,
	source_name			text
);

COMMENT ON TABLE public.task IS 'A task';
COMMENT ON COLUMN public.task.id IS 'Globally unique identifier';
COMMENT ON COLUMN public.task.name IS 'Task name';
COMMENT ON COLUMN public.task.source_name IS 'Task source name; optional';


CREATE TABLE IF NOT EXISTS public.test_case (
	id					uuid primary key default uuid_generate_v1mc(),
	task_id				uuid references public.task(id) not null,
	name				text not null,
	value				integer not null,
	in_file				text,
	ok_file				text
);

COMMENT ON TABLE public.test_case IS 'A test case';
COMMENT ON COLUMN public.test_case.id IS 'Globally unique identifier';
COMMENT ON COLUMN public.test_case.task_id IS 'Task name';
COMMENT ON COLUMN public.test_case.name IS 'Test case name';
COMMENT ON COLUMN public.test_case.value IS 'Test case absolute value';
COMMENT ON COLUMN public.test_case.in_file IS 'Test case grader input';
COMMENT ON COLUMN public.test_case.ok_file IS 'Test case grader expected output';


DO $$ BEGIN
CREATE TYPE public.result_status AS ENUM (
	'OK',
	'INCORRECT',
	'TIME_LIMIT_EXCEEDED',
	'MEMORY_LIMIT_EXCEEDED',
	'COMPILE_ERROR',
	'RUNTIME_ERROR'
);

CREATE TYPE public.jwt_token AS (
	role				text,
	id					uuid
);

EXCEPTION WHEN duplicate_object THEN null;
END $$;


CREATE TABLE IF NOT EXISTS public.submission (
	id					uuid primary key default uuid_generate_v1mc(),
	author_id			uuid references public.user(id) not null,
	task_id				uuid references public.task(id) not null,
	body				text,
	source_name			text,
	total_score			integer not null
);

COMMENT ON TABLE public.submission IS 'A submission';
COMMENT ON COLUMN public.submission.id IS 'Globally unique identifier';
COMMENT ON COLUMN public.submission.author_id IS 'Contestant globally unique identifier';
COMMENT ON COLUMN public.submission.task_id IS 'Task globally unique idenitifer';
COMMENT ON COLUMN public.submission.body IS 'Submission source code';
COMMENT ON COLUMN public.submission.source_name IS 'Submission source name; optional';
COMMENT ON COLUMN public.submission.total_score IS 'Contestant graded score';

COMMENT ON CONSTRAINT submission_author_id_fkey ON public.submission IS E'@foreignFieldName submissions\n@fieldName user';


CREATE TABLE IF NOT EXISTS public.test_result (
	id					uuid primary key default uuid_generate_v1mc(),
	author_id			uuid references public.user(id) not null,
	submission_id		uuid references public.submission(id) not null,
	task_id				uuid references public.task(id) not null,
	test_case_id		uuid references public.test_case(id) not null,
	out_file			text,
	score				integer not null,
	status				public.result_status,
	UNIQUE (submission_id, test_case_id)
);

COMMENT ON CONSTRAINT test_result_author_id_fkey ON public.test_result IS E'@foreignFieldName test_results\n@fieldName user';


DO $$ BEGIN
CREATE TYPE public.appeal_status AS ENUM (
	'PENDING',
	'PROCESSING',
	'FINALIZED',
	'REJECTED'
);

EXCEPTION WHEN duplicate_object THEN null;
END $$;


CREATE TABLE IF NOT EXISTS public.appeal_reason (
	id					uuid primary key default uuid_generate_v1mc(),
	title				text not null,
	description			text not null
);


CREATE TABLE IF NOT EXISTS public.appeal (
	id					uuid primary key default uuid_generate_v1mc(),
	author_id			uuid references public.user(id) not null,
	submission_id		uuid references public.submission(id) unique not null,
	reason_id			uuid references public.appeal_reason(id) not null,
	detailed			text not null,
	status				public.appeal_status default 'PENDING'::public.appeal_status not null,
	comment				text,
	resolution_id		uuid references public.submission(id)
);

COMMENT ON TABLE public.appeal IS 'An appeal';
COMMENT ON COLUMN public.appeal.id IS 'Globally unique identifier';
COMMENT ON COLUMN public.appeal.author_id IS 'Contestant globally unique identifier';
COMMENT ON COLUMN public.appeal.submission_id IS 'Submission globally unique identifier';
COMMENT ON COLUMN public.appeal.reason_id IS 'Appeal reason globally unique identifier';
COMMENT ON COLUMN public.appeal.detailed IS 'Appeal reason details';
COMMENT ON COLUMN public.appeal.status IS 'Appeal status';
COMMENT ON COLUMN public.appeal.comment IS 'Appeal resolution comment';
COMMENT ON COLUMN public.appeal.resolution_id IS 'Resolution submission globally unique identifier';

COMMENT ON CONSTRAINT appeal_author_id_fkey ON public.appeal IS E'@foreignFieldName appeals\n@fieldName user';


CREATE TABLE IF NOT EXISTS private.user_account (
	id					uuid primary key references public.user(id) on delete cascade,
	access_code			text not null
);

COMMENT ON TABLE private.user_account IS 'Authentication information for a participant account';
COMMENT ON COLUMN private.user_account.id IS 'Contestant account identifier';
COMMENT ON COLUMN private.user_account.access_code IS 'Contestant access code';


CREATE TABLE IF NOT EXISTS public.admin (
	id					uuid primary key default uuid_generate_v1mc(),
	username			text unique not null,
	first_name			text not null,
	last_name			text
);

COMMENT ON TABLE public.admin IS 'Account information for administrators';
COMMENT ON COLUMN public.admin.id IS 'Globally unique identifier';
COMMENT ON COLUMN public.admin.username IS 'Administrator username';
COMMENT ON COLUMN public.admin.first_name IS 'Administrator first name';
COMMENT ON COLUMN public.admin.last_name IS 'Administrator last name';


CREATE TABLE IF NOT EXISTS private.admin_account (
	id					uuid primary key references public.admin(id) on delete cascade,
	password			text
);

COMMENT ON TABLE private.admin_account IS 'Authentication information for administrators';
COMMENT ON COLUMN private.admin_account.id IS 'Administrator account identifier';
COMMENT ON COLUMN private.admin_account.password IS 'Administrator hashed password';


ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM public;

DROP FUNCTION IF EXISTS public.register_user(text, text, text, integer, text, boolean, text);
CREATE FUNCTION public.register_user(
	participation_id	text,
	first_name			text,
	last_name			text,
	grade				integer,
	exam_center			text,
	attendance			boolean,
	access_code			text
) RETURNS public.user AS $$
DECLARE
	new_user			public.user;
BEGIN
	INSERT INTO public.user (participation_id, first_name, last_name, grade, exam_center, attendance) VALUES
		(participation_id, first_name, last_name, grade, exam_center, attendance)
		RETURNING * INTO new_user;
	
	INSERT INTO private.user_account (id, access_code) VALUES
		(new_user.id, access_code);
	
	RETURN new_user;
END;
$$ LANGUAGE plpgsql STRICT SECURITY DEFINER;
COMMENT ON FUNCTION public.register_user(text, text, text, integer, text, boolean, text) IS 'Registers a single user and creates authentication information';


DROP FUNCTION IF EXISTS public.register_admin(text, text, text, text);
CREATE FUNCTION public.register_admin(
	username			text,
	password			text,
	first_name			text,
	last_name			text
) RETURNS public.admin AS $$
DECLARE
	new_admin			public.admin;
BEGIN
	INSERT INTO public.admin (username, first_name, last_name) VALUES
		(username, first_name, last_name)
		RETURNING * INTO new_admin;

	INSERT INTO private.admin_account (id, password) VALUES
		(new_admin.id, crypt(password, gen_salt('bf')));

	RETURN new_admin;
END;
$$ LANGUAGE plpgsql STRICT SECURITY DEFINER;
COMMENT ON FUNCTION public.register_admin(text, text, text, text) IS 'Registers an administrator account';


DROP FUNCTION IF EXISTS public.authenticate(text, text);
CREATE FUNCTION public.authenticate(
	id					text,
	password			text
) RETURNS public.jwt_token AS $$
DECLARE
	account				public.user;
	auth				private.user_account;
	admin_account		public.admin;
	admin_auth			private.admin_account;
BEGIN
	SELECT a.* INTO admin_account
		FROM public.admin AS a
		WHERE a.username = $1;

	SELECT b.* INTO admin_auth
		FROM private.admin_account AS b
		WHERE b.id = admin_account.id;
	
	IF admin_auth.password = crypt(password, admin_auth.password) THEN
		RETURN ('admin_authenticated', admin_account.id)::public.jwt_token;
	ELSE
		SELECT a.* INTO account
			FROM public.user AS a
			WHERE a.participation_id = $1;

		SELECT b.* INTO auth
			FROM private.user_account AS b
			WHERE b.id = account.id;

		IF auth.access_code = password THEN
			RETURN ('authenticated', auth.id)::public.jwt_token;
		ELSE
			RETURN null;
		END IF;
	END IF;
END;
$$ LANGUAGE plpgsql STRICT SECURITY DEFINER;
COMMENT ON FUNCTION public.authenticate(text, text) IS 'Creates a JWT token that will securely identify a user and give them certain permissions';


DROP FUNCTION IF EXISTS public.current_user();
CREATE FUNCTION public.current_user() RETURNS public.user AS $$
	SELECT *
		FROM public.user
		WHERE id::text = nullif(current_setting('jwt.claims.id', true), '')::text
$$ LANGUAGE sql STABLE;
COMMENT ON FUNCTION public.current_user() is 'Gets currently authenticated user by JWT';


DROP FUNCTION IF EXISTS public.start_appeal(uuid, uuid, text);
CREATE FUNCTION public.start_appeal(
	submission_id		uuid,
	reason_id			uuid,
	detailed			text
) RETURNS public.appeal AS $$
DECLARE
	submission			public.submission;
	appeal				public.appeal;
BEGIN
	SELECT s.* INTO submission
		FROM public.submission AS s
		WHERE s.id = submission_id;
	
	IF submission.author_id::text <> nullif(current_setting('jwt.claims.id', true), '')::text THEN
		RETURN null;
	END IF;

	INSERT INTO public.appeal (author_id, submission_id, reason_id, detailed, status) VALUES (
			nullif(current_setting('jwt.claims.id', true), '')::uuid,
			submission_id,
			reason_id,
			detailed,
			'PENDING'::public.appeal_status
		)
		RETURNING * INTO appeal;
	
	RETURN appeal;
END;
$$ LANGUAGE plpgsql STRICT SECURITY DEFINER;


DO $$ BEGIN
CREATE TYPE public.configuration AS (
	detailed_feedback	boolean,
	test_case_review	boolean,
	appeals				boolean,
	statistics			boolean,
	default_status		public.appeal_status
);

EXCEPTION WHEN duplicate_object THEN null;
END $$;


GRANT USAGE ON SCHEMA public TO anonymous, authenticated, admin_authenticated;

GRANT SELECT ON TABLE public.user TO authenticated, admin_authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.user to admin_authenticated;

GRANT SELECT ON TABLE public.task TO anonymous, authenticated, admin_authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.task to admin_authenticated;

GRANT SELECT ON TABLE public.test_case TO authenticated, admin_authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.test_case to admin_authenticated;

GRANT SELECT ON TABLE public.submission TO authenticated, admin_authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.submission to admin_authenticated;

GRANT SELECT ON TABLE public.test_result TO authenticated, admin_authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.test_result to admin_authenticated;

GRANT SELECT ON TABLE public.appeal_reason TO authenticated, admin_authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.appeal_reason to admin_authenticated;

GRANT SELECT ON TABLE public.appeal TO authenticated, admin_authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.appeal TO admin_authenticated;


GRANT EXECUTE ON FUNCTION public.authenticate(text, text) TO anonymous, authenticated, admin_authenticated;
GRANT EXECUTE ON FUNCTION public.current_user() TO anonymous, authenticated, admin_authenticated;

GRANT EXECUTE ON FUNCTION public.register_user(text, text, text, integer, text, boolean, text) TO admin_authenticated;
GRANT EXECUTE ON FUNCTION public.register_admin(text, text, text, text) TO admin_authenticated;

GRANT EXECUTE ON FUNCTION public.start_appeal(uuid, uuid, text) TO authenticated;

ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_result ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appeal ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
CREATE POLICY select_user ON public.user FOR SELECT TO authenticated
	USING (id::text = nullif(current_setting('jwt.claims.id', true), '')::text);

CREATE POLICY select_submission ON public.submission FOR SELECT TO authenticated
	USING (author_id::text = nullif(current_setting('jwt.claims.id', true), '')::text);

CREATE POLICY select_test_result ON public.test_result FOR SELECT TO authenticated
	USING (author_id::text = nullif(current_setting('jwt.claims.id', true), '')::text);

CREATE POLICY select_appeal ON public.appeal FOR SELECT TO authenticated
	USING (author_id::text = nullif(current_setting('jwt.claims.id', true), '')::text);

EXCEPTION WHEN duplicate_object THEN null;
END $$;

--CREATE DEFAULT ADMINISTRATOR ACCOUNT
SELECT public.register_admin('admin', 'admin', 'Default', 'Administrator');