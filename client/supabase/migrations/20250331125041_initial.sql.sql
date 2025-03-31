create type "public"."competition_mode" as enum ('general', 'competitive');

create type "public"."difficulty_level" as enum ('beginner', 'easy', 'medium', 'hard', 'complex');

create type "public"."problem_type" as enum ('coding', 'debugging');

create sequence "public"."tbl_problems_problem_number_seq";

create sequence "public"."tbl_user_tiers_id_seq";

create table "public"."tbl_allowed_languages" (
    "id" uuid not null default gen_random_uuid(),
    "problem_id" uuid not null,
    "language_id" uuid not null
);


create table "public"."tbl_moderators" (
    "id" uuid not null,
    "username" text not null,
    "name" text,
    "permission" integer default 0,
    "problems_added" integer default 0,
    "blackpoints" integer default 0,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "email" text
);


create table "public"."tbl_problems" (
    "id" uuid not null default gen_random_uuid(),
    "problem_number" integer not null default nextval('tbl_problems_problem_number_seq'::regclass),
    "title" character varying(255) not null,
    "difficulty" difficulty_level not null,
    "problem_type" problem_type not null,
    "competition_mode" competition_mode not null,
    "topics" text[] not null,
    "problem_statement" text not null,
    "constraints" text not null,
    "time_limit" character varying(50) not null,
    "memory_limit" character varying(50) not null,
    "input_format" text not null,
    "output_format" text not null,
    "moderator_id" uuid not null,
    "created_at" timestamp without time zone default now()
);


create table "public"."tbl_programming_languages" (
    "id" uuid not null default gen_random_uuid(),
    "name" character varying(100) not null,
    "version" character varying(50) not null,
    "description" text
);


create table "public"."tbl_starter_code" (
    "id" uuid not null default gen_random_uuid(),
    "problem_id" uuid not null,
    "language_id" uuid not null,
    "code" text
);


create table "public"."tbl_test_cases" (
    "id" uuid not null default gen_random_uuid(),
    "problem_id" uuid not null,
    "input" text not null,
    "output" text not null,
    "explanation" text
);


create table "public"."tbl_user_roles" (
    "id" uuid not null,
    "role" text default 'user'::text,
    "created_at" timestamp without time zone default now()
);


create table "public"."tbl_user_tiers" (
    "id" integer not null default nextval('tbl_user_tiers_id_seq'::regclass),
    "tier_name" text not null,
    "value" integer default 2
);


create table "public"."tbl_users" (
    "id" uuid not null,
    "name" text,
    "blackpoints" integer default 0,
    "points" integer default 1200,
    "points_today" integer default 0,
    "points_this_week" integer default 0,
    "points_this_month" integer default 0,
    "points_this_year" integer default 0,
    "tier" integer,
    "is_active" boolean default true,
    "completed_1vs1_matches" integer default 0,
    "completed_problems" integer default 0,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "username" text not null,
    "email" text
);


alter sequence "public"."tbl_problems_problem_number_seq" owned by "public"."tbl_problems"."problem_number";

alter sequence "public"."tbl_user_tiers_id_seq" owned by "public"."tbl_user_tiers"."id";

CREATE INDEX idx_problem_number ON public.tbl_problems USING btree (problem_number);

CREATE UNIQUE INDEX roles_pkey ON public.tbl_user_roles USING btree (id);

CREATE UNIQUE INDEX tbl_allowed_languages_pkey ON public.tbl_allowed_languages USING btree (id);

CREATE UNIQUE INDEX tbl_moderators_email_key ON public.tbl_moderators USING btree (email);

CREATE UNIQUE INDEX tbl_moderators_pkey ON public.tbl_moderators USING btree (id);

CREATE UNIQUE INDEX tbl_moderators_username_key ON public.tbl_moderators USING btree (username);

CREATE UNIQUE INDEX tbl_problems_pkey ON public.tbl_problems USING btree (id);

CREATE UNIQUE INDEX tbl_problems_problem_number_key ON public.tbl_problems USING btree (problem_number);

CREATE UNIQUE INDEX tbl_programming_languages_name_key ON public.tbl_programming_languages USING btree (name);

CREATE UNIQUE INDEX tbl_programming_languages_pkey ON public.tbl_programming_languages USING btree (id);

CREATE UNIQUE INDEX tbl_starter_code_pkey ON public.tbl_starter_code USING btree (id);

CREATE UNIQUE INDEX tbl_test_cases_pkey ON public.tbl_test_cases USING btree (id);

CREATE UNIQUE INDEX tbl_user_tiers_pkey ON public.tbl_user_tiers USING btree (id);

CREATE UNIQUE INDEX tbl_users_email_key ON public.tbl_users USING btree (email);

CREATE UNIQUE INDEX tbl_users_pkey ON public.tbl_users USING btree (id);

CREATE UNIQUE INDEX tbl_users_username_key ON public.tbl_users USING btree (username);

alter table "public"."tbl_allowed_languages" add constraint "tbl_allowed_languages_pkey" PRIMARY KEY using index "tbl_allowed_languages_pkey";

alter table "public"."tbl_moderators" add constraint "tbl_moderators_pkey" PRIMARY KEY using index "tbl_moderators_pkey";

alter table "public"."tbl_problems" add constraint "tbl_problems_pkey" PRIMARY KEY using index "tbl_problems_pkey";

alter table "public"."tbl_programming_languages" add constraint "tbl_programming_languages_pkey" PRIMARY KEY using index "tbl_programming_languages_pkey";

alter table "public"."tbl_starter_code" add constraint "tbl_starter_code_pkey" PRIMARY KEY using index "tbl_starter_code_pkey";

alter table "public"."tbl_test_cases" add constraint "tbl_test_cases_pkey" PRIMARY KEY using index "tbl_test_cases_pkey";

alter table "public"."tbl_user_roles" add constraint "roles_pkey" PRIMARY KEY using index "roles_pkey";

alter table "public"."tbl_user_tiers" add constraint "tbl_user_tiers_pkey" PRIMARY KEY using index "tbl_user_tiers_pkey";

alter table "public"."tbl_users" add constraint "tbl_users_pkey" PRIMARY KEY using index "tbl_users_pkey";

alter table "public"."tbl_allowed_languages" add constraint "tbl_allowed_languages_language_id_fkey" FOREIGN KEY (language_id) REFERENCES tbl_programming_languages(id) ON DELETE CASCADE not valid;

alter table "public"."tbl_allowed_languages" validate constraint "tbl_allowed_languages_language_id_fkey";

alter table "public"."tbl_allowed_languages" add constraint "tbl_allowed_languages_problem_id_fkey" FOREIGN KEY (problem_id) REFERENCES tbl_problems(id) ON DELETE CASCADE not valid;

alter table "public"."tbl_allowed_languages" validate constraint "tbl_allowed_languages_problem_id_fkey";

alter table "public"."tbl_moderators" add constraint "tbl_moderators_email_key" UNIQUE using index "tbl_moderators_email_key";

alter table "public"."tbl_moderators" add constraint "tbl_moderators_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."tbl_moderators" validate constraint "tbl_moderators_id_fkey";

alter table "public"."tbl_moderators" add constraint "tbl_moderators_username_key" UNIQUE using index "tbl_moderators_username_key";

alter table "public"."tbl_problems" add constraint "tbl_problems_constraints_check" CHECK ((length(constraints) >= 5)) not valid;

alter table "public"."tbl_problems" validate constraint "tbl_problems_constraints_check";

alter table "public"."tbl_problems" add constraint "tbl_problems_input_format_check" CHECK ((length(input_format) >= 5)) not valid;

alter table "public"."tbl_problems" validate constraint "tbl_problems_input_format_check";

alter table "public"."tbl_problems" add constraint "tbl_problems_moderator_id_fkey" FOREIGN KEY (moderator_id) REFERENCES tbl_moderators(id) ON DELETE SET NULL not valid;

alter table "public"."tbl_problems" validate constraint "tbl_problems_moderator_id_fkey";

alter table "public"."tbl_problems" add constraint "tbl_problems_output_format_check" CHECK ((length(output_format) >= 5)) not valid;

alter table "public"."tbl_problems" validate constraint "tbl_problems_output_format_check";

alter table "public"."tbl_problems" add constraint "tbl_problems_problem_number_key" UNIQUE using index "tbl_problems_problem_number_key";

alter table "public"."tbl_problems" add constraint "tbl_problems_problem_statement_check" CHECK ((length(problem_statement) >= 10)) not valid;

alter table "public"."tbl_problems" validate constraint "tbl_problems_problem_statement_check";

alter table "public"."tbl_problems" add constraint "tbl_problems_title_check" CHECK ((length((title)::text) >= 3)) not valid;

alter table "public"."tbl_problems" validate constraint "tbl_problems_title_check";

alter table "public"."tbl_programming_languages" add constraint "tbl_programming_languages_name_key" UNIQUE using index "tbl_programming_languages_name_key";

alter table "public"."tbl_starter_code" add constraint "tbl_starter_code_language_id_fkey" FOREIGN KEY (language_id) REFERENCES tbl_programming_languages(id) ON DELETE CASCADE not valid;

alter table "public"."tbl_starter_code" validate constraint "tbl_starter_code_language_id_fkey";

alter table "public"."tbl_starter_code" add constraint "tbl_starter_code_problem_id_fkey" FOREIGN KEY (problem_id) REFERENCES tbl_problems(id) ON DELETE CASCADE not valid;

alter table "public"."tbl_starter_code" validate constraint "tbl_starter_code_problem_id_fkey";

alter table "public"."tbl_test_cases" add constraint "tbl_test_cases_input_check" CHECK ((length(input) >= 1)) not valid;

alter table "public"."tbl_test_cases" validate constraint "tbl_test_cases_input_check";

alter table "public"."tbl_test_cases" add constraint "tbl_test_cases_output_check" CHECK ((length(output) >= 1)) not valid;

alter table "public"."tbl_test_cases" validate constraint "tbl_test_cases_output_check";

alter table "public"."tbl_test_cases" add constraint "tbl_test_cases_problem_id_fkey" FOREIGN KEY (problem_id) REFERENCES tbl_problems(id) ON DELETE CASCADE not valid;

alter table "public"."tbl_test_cases" validate constraint "tbl_test_cases_problem_id_fkey";

alter table "public"."tbl_user_roles" add constraint "roles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."tbl_user_roles" validate constraint "roles_id_fkey";

alter table "public"."tbl_user_roles" add constraint "roles_role_check" CHECK ((role = ANY (ARRAY['user'::text, 'moderator'::text, 'admin'::text]))) not valid;

alter table "public"."tbl_user_roles" validate constraint "roles_role_check";

alter table "public"."tbl_users" add constraint "tbl_users_email_key" UNIQUE using index "tbl_users_email_key";

alter table "public"."tbl_users" add constraint "tbl_users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."tbl_users" validate constraint "tbl_users_id_fkey";

alter table "public"."tbl_users" add constraint "tbl_users_tier_fkey" FOREIGN KEY (tier) REFERENCES tbl_user_tiers(id) not valid;

alter table "public"."tbl_users" validate constraint "tbl_users_tier_fkey";

alter table "public"."tbl_users" add constraint "tbl_users_username_key" UNIQUE using index "tbl_users_username_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_moderator_with_role(p_id uuid, p_username character varying, p_email character varying)
 RETURNS TABLE(id uuid, username character varying, email character varying, role character varying)
 LANGUAGE plpgsql
AS $function$
DECLARE
    existing_user UUID;
    existing_moderator UUID;
BEGIN
    -- Check if the username already exists in tbl_users
    SELECT tbl_users.id INTO existing_user FROM tbl_users WHERE tbl_users.username = p_username;
    
    IF existing_user IS NOT NULL THEN
        RAISE EXCEPTION 'Username already taken in tbl_users';
    END IF;

    -- Check if the username already exists in tbl_moderators
    SELECT tbl_moderators.id INTO existing_moderator FROM tbl_moderators WHERE tbl_moderators.username = p_username;
    
    IF existing_moderator IS NOT NULL THEN
        RAISE EXCEPTION 'Username already taken in tbl_moderators';
    END IF;

    -- Step 1: Insert moderator into tbl_moderators
    INSERT INTO tbl_moderators (id, username, email, created_at)
    VALUES (p_id, p_username, p_email, CURRENT_TIMESTAMP);

    -- Step 2: Insert moderator role into tbl_user_roles
    INSERT INTO tbl_user_roles (id, role, created_at)
    VALUES (p_id, 'moderator', CURRENT_TIMESTAMP);

    -- Step 3: Return the newly inserted moderator's details
    RETURN QUERY 
    SELECT p_id::UUID, p_username::VARCHAR, p_email::VARCHAR, 'moderator'::VARCHAR;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error adding moderator: %', SQLERRM;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.add_problem(p_title character varying, p_difficulty difficulty_level, p_problem_type problem_type, p_competition_mode competition_mode, p_topics text[], p_problem_statement text, p_constraints text, p_time_limit character varying, p_memory_limit character varying, p_input_format text, p_output_format text, p_moderator_id uuid, p_test_cases jsonb, p_allowed_languages uuid[], p_starter_code jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_problem_id UUID;
    v_test_case JSONB;
    v_starter_code JSONB;
    v_language_id UUID;
BEGIN
    -- Start transaction
    BEGIN 

        -- Insert into tbl_problems
        INSERT INTO tbl_problems (
            title, difficulty, problem_type, competition_mode, topics, 
            problem_statement, constraints, time_limit, memory_limit, 
            input_format, output_format, moderator_id
        ) VALUES (
            p_title, p_difficulty, p_problem_type, p_competition_mode, p_topics, 
            p_problem_statement, p_constraints, p_time_limit, p_memory_limit, 
            p_input_format, p_output_format, p_moderator_id
        )
        RETURNING id INTO v_problem_id;

        -- Insert test cases
        FOR v_test_case IN SELECT * FROM jsonb_array_elements(p_test_cases) LOOP
            INSERT INTO tbl_test_cases (problem_id, input, output, explanation)
            VALUES (v_problem_id, v_test_case->>'input', v_test_case->>'output', v_test_case->>'explanation');
        END LOOP;

        -- Insert allowed languages
        FOREACH v_language_id IN ARRAY p_allowed_languages LOOP
            INSERT INTO tbl_allowed_languages (problem_id, language_id)
            VALUES (v_problem_id, v_language_id);
        END LOOP;

        -- Insert starter code
        FOR v_starter_code IN SELECT * FROM jsonb_array_elements(p_starter_code) LOOP
            INSERT INTO tbl_starter_code (problem_id, language_id, code)
            VALUES (v_problem_id, v_starter_code->>'language_id', v_starter_code->>'code');
        END LOOP;

        -- Commit transaction and return the problem ID
        RETURN v_problem_id;

    EXCEPTION 
        WHEN OTHERS THEN 
            ROLLBACK;
            RAISE;
    END;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.add_user_with_role(p_id uuid, p_username character varying, p_email character varying)
 RETURNS TABLE(id uuid, username character varying, email character varying, role character varying)
 LANGUAGE plpgsql
AS $function$
DECLARE
    existing_user UUID;
    existing_moderator UUID;
BEGIN
    -- Check if the username already exists in tbl_users
    SELECT tbl_users.id INTO existing_user FROM tbl_users WHERE tbl_users.username = p_username;
    
    IF existing_user IS NOT NULL THEN
        RAISE EXCEPTION 'Username already taken in tbl_users';
    END IF;

    -- Check if the username already exists in tbl_moderators
    SELECT tbl_moderators.id INTO existing_moderator FROM tbl_moderators WHERE tbl_moderators.username = p_username;
    
    IF existing_moderator IS NOT NULL THEN
        RAISE EXCEPTION 'Username already taken in tbl_moderators';
    END IF;

    -- Step 1: Insert user into tbl_users
    INSERT INTO tbl_users (id, username, email, created_at)
    VALUES (p_id, p_username, p_email, CURRENT_TIMESTAMP);

    -- Step 2: Insert user role into tbl_user_roles (hardcoded as 'user')
    INSERT INTO tbl_user_roles (id, role, created_at)
    VALUES (p_id, 'user', CURRENT_TIMESTAMP);

    -- Step 3: Return the newly inserted user's details
    RETURN QUERY 
    SELECT p_id::UUID, p_username::VARCHAR, p_email::VARCHAR, 'user'::VARCHAR;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error adding user: %', SQLERRM;
END;
$function$
;

grant delete on table "public"."tbl_allowed_languages" to "anon";

grant insert on table "public"."tbl_allowed_languages" to "anon";

grant references on table "public"."tbl_allowed_languages" to "anon";

grant select on table "public"."tbl_allowed_languages" to "anon";

grant trigger on table "public"."tbl_allowed_languages" to "anon";

grant truncate on table "public"."tbl_allowed_languages" to "anon";

grant update on table "public"."tbl_allowed_languages" to "anon";

grant delete on table "public"."tbl_allowed_languages" to "authenticated";

grant insert on table "public"."tbl_allowed_languages" to "authenticated";

grant references on table "public"."tbl_allowed_languages" to "authenticated";

grant select on table "public"."tbl_allowed_languages" to "authenticated";

grant trigger on table "public"."tbl_allowed_languages" to "authenticated";

grant truncate on table "public"."tbl_allowed_languages" to "authenticated";

grant update on table "public"."tbl_allowed_languages" to "authenticated";

grant delete on table "public"."tbl_allowed_languages" to "service_role";

grant insert on table "public"."tbl_allowed_languages" to "service_role";

grant references on table "public"."tbl_allowed_languages" to "service_role";

grant select on table "public"."tbl_allowed_languages" to "service_role";

grant trigger on table "public"."tbl_allowed_languages" to "service_role";

grant truncate on table "public"."tbl_allowed_languages" to "service_role";

grant update on table "public"."tbl_allowed_languages" to "service_role";

grant delete on table "public"."tbl_moderators" to "anon";

grant insert on table "public"."tbl_moderators" to "anon";

grant references on table "public"."tbl_moderators" to "anon";

grant select on table "public"."tbl_moderators" to "anon";

grant trigger on table "public"."tbl_moderators" to "anon";

grant truncate on table "public"."tbl_moderators" to "anon";

grant update on table "public"."tbl_moderators" to "anon";

grant delete on table "public"."tbl_moderators" to "authenticated";

grant insert on table "public"."tbl_moderators" to "authenticated";

grant references on table "public"."tbl_moderators" to "authenticated";

grant select on table "public"."tbl_moderators" to "authenticated";

grant trigger on table "public"."tbl_moderators" to "authenticated";

grant truncate on table "public"."tbl_moderators" to "authenticated";

grant update on table "public"."tbl_moderators" to "authenticated";

grant delete on table "public"."tbl_moderators" to "service_role";

grant insert on table "public"."tbl_moderators" to "service_role";

grant references on table "public"."tbl_moderators" to "service_role";

grant select on table "public"."tbl_moderators" to "service_role";

grant trigger on table "public"."tbl_moderators" to "service_role";

grant truncate on table "public"."tbl_moderators" to "service_role";

grant update on table "public"."tbl_moderators" to "service_role";

grant delete on table "public"."tbl_problems" to "anon";

grant insert on table "public"."tbl_problems" to "anon";

grant references on table "public"."tbl_problems" to "anon";

grant select on table "public"."tbl_problems" to "anon";

grant trigger on table "public"."tbl_problems" to "anon";

grant truncate on table "public"."tbl_problems" to "anon";

grant update on table "public"."tbl_problems" to "anon";

grant delete on table "public"."tbl_problems" to "authenticated";

grant insert on table "public"."tbl_problems" to "authenticated";

grant references on table "public"."tbl_problems" to "authenticated";

grant select on table "public"."tbl_problems" to "authenticated";

grant trigger on table "public"."tbl_problems" to "authenticated";

grant truncate on table "public"."tbl_problems" to "authenticated";

grant update on table "public"."tbl_problems" to "authenticated";

grant delete on table "public"."tbl_problems" to "service_role";

grant insert on table "public"."tbl_problems" to "service_role";

grant references on table "public"."tbl_problems" to "service_role";

grant select on table "public"."tbl_problems" to "service_role";

grant trigger on table "public"."tbl_problems" to "service_role";

grant truncate on table "public"."tbl_problems" to "service_role";

grant update on table "public"."tbl_problems" to "service_role";

grant delete on table "public"."tbl_programming_languages" to "anon";

grant insert on table "public"."tbl_programming_languages" to "anon";

grant references on table "public"."tbl_programming_languages" to "anon";

grant select on table "public"."tbl_programming_languages" to "anon";

grant trigger on table "public"."tbl_programming_languages" to "anon";

grant truncate on table "public"."tbl_programming_languages" to "anon";

grant update on table "public"."tbl_programming_languages" to "anon";

grant delete on table "public"."tbl_programming_languages" to "authenticated";

grant insert on table "public"."tbl_programming_languages" to "authenticated";

grant references on table "public"."tbl_programming_languages" to "authenticated";

grant select on table "public"."tbl_programming_languages" to "authenticated";

grant trigger on table "public"."tbl_programming_languages" to "authenticated";

grant truncate on table "public"."tbl_programming_languages" to "authenticated";

grant update on table "public"."tbl_programming_languages" to "authenticated";

grant delete on table "public"."tbl_programming_languages" to "service_role";

grant insert on table "public"."tbl_programming_languages" to "service_role";

grant references on table "public"."tbl_programming_languages" to "service_role";

grant select on table "public"."tbl_programming_languages" to "service_role";

grant trigger on table "public"."tbl_programming_languages" to "service_role";

grant truncate on table "public"."tbl_programming_languages" to "service_role";

grant update on table "public"."tbl_programming_languages" to "service_role";

grant delete on table "public"."tbl_starter_code" to "anon";

grant insert on table "public"."tbl_starter_code" to "anon";

grant references on table "public"."tbl_starter_code" to "anon";

grant select on table "public"."tbl_starter_code" to "anon";

grant trigger on table "public"."tbl_starter_code" to "anon";

grant truncate on table "public"."tbl_starter_code" to "anon";

grant update on table "public"."tbl_starter_code" to "anon";

grant delete on table "public"."tbl_starter_code" to "authenticated";

grant insert on table "public"."tbl_starter_code" to "authenticated";

grant references on table "public"."tbl_starter_code" to "authenticated";

grant select on table "public"."tbl_starter_code" to "authenticated";

grant trigger on table "public"."tbl_starter_code" to "authenticated";

grant truncate on table "public"."tbl_starter_code" to "authenticated";

grant update on table "public"."tbl_starter_code" to "authenticated";

grant delete on table "public"."tbl_starter_code" to "service_role";

grant insert on table "public"."tbl_starter_code" to "service_role";

grant references on table "public"."tbl_starter_code" to "service_role";

grant select on table "public"."tbl_starter_code" to "service_role";

grant trigger on table "public"."tbl_starter_code" to "service_role";

grant truncate on table "public"."tbl_starter_code" to "service_role";

grant update on table "public"."tbl_starter_code" to "service_role";

grant delete on table "public"."tbl_test_cases" to "anon";

grant insert on table "public"."tbl_test_cases" to "anon";

grant references on table "public"."tbl_test_cases" to "anon";

grant select on table "public"."tbl_test_cases" to "anon";

grant trigger on table "public"."tbl_test_cases" to "anon";

grant truncate on table "public"."tbl_test_cases" to "anon";

grant update on table "public"."tbl_test_cases" to "anon";

grant delete on table "public"."tbl_test_cases" to "authenticated";

grant insert on table "public"."tbl_test_cases" to "authenticated";

grant references on table "public"."tbl_test_cases" to "authenticated";

grant select on table "public"."tbl_test_cases" to "authenticated";

grant trigger on table "public"."tbl_test_cases" to "authenticated";

grant truncate on table "public"."tbl_test_cases" to "authenticated";

grant update on table "public"."tbl_test_cases" to "authenticated";

grant delete on table "public"."tbl_test_cases" to "service_role";

grant insert on table "public"."tbl_test_cases" to "service_role";

grant references on table "public"."tbl_test_cases" to "service_role";

grant select on table "public"."tbl_test_cases" to "service_role";

grant trigger on table "public"."tbl_test_cases" to "service_role";

grant truncate on table "public"."tbl_test_cases" to "service_role";

grant update on table "public"."tbl_test_cases" to "service_role";

grant delete on table "public"."tbl_user_roles" to "anon";

grant insert on table "public"."tbl_user_roles" to "anon";

grant references on table "public"."tbl_user_roles" to "anon";

grant select on table "public"."tbl_user_roles" to "anon";

grant trigger on table "public"."tbl_user_roles" to "anon";

grant truncate on table "public"."tbl_user_roles" to "anon";

grant update on table "public"."tbl_user_roles" to "anon";

grant delete on table "public"."tbl_user_roles" to "authenticated";

grant insert on table "public"."tbl_user_roles" to "authenticated";

grant references on table "public"."tbl_user_roles" to "authenticated";

grant select on table "public"."tbl_user_roles" to "authenticated";

grant trigger on table "public"."tbl_user_roles" to "authenticated";

grant truncate on table "public"."tbl_user_roles" to "authenticated";

grant update on table "public"."tbl_user_roles" to "authenticated";

grant delete on table "public"."tbl_user_roles" to "service_role";

grant insert on table "public"."tbl_user_roles" to "service_role";

grant references on table "public"."tbl_user_roles" to "service_role";

grant select on table "public"."tbl_user_roles" to "service_role";

grant trigger on table "public"."tbl_user_roles" to "service_role";

grant truncate on table "public"."tbl_user_roles" to "service_role";

grant update on table "public"."tbl_user_roles" to "service_role";

grant delete on table "public"."tbl_user_tiers" to "anon";

grant insert on table "public"."tbl_user_tiers" to "anon";

grant references on table "public"."tbl_user_tiers" to "anon";

grant select on table "public"."tbl_user_tiers" to "anon";

grant trigger on table "public"."tbl_user_tiers" to "anon";

grant truncate on table "public"."tbl_user_tiers" to "anon";

grant update on table "public"."tbl_user_tiers" to "anon";

grant delete on table "public"."tbl_user_tiers" to "authenticated";

grant insert on table "public"."tbl_user_tiers" to "authenticated";

grant references on table "public"."tbl_user_tiers" to "authenticated";

grant select on table "public"."tbl_user_tiers" to "authenticated";

grant trigger on table "public"."tbl_user_tiers" to "authenticated";

grant truncate on table "public"."tbl_user_tiers" to "authenticated";

grant update on table "public"."tbl_user_tiers" to "authenticated";

grant delete on table "public"."tbl_user_tiers" to "service_role";

grant insert on table "public"."tbl_user_tiers" to "service_role";

grant references on table "public"."tbl_user_tiers" to "service_role";

grant select on table "public"."tbl_user_tiers" to "service_role";

grant trigger on table "public"."tbl_user_tiers" to "service_role";

grant truncate on table "public"."tbl_user_tiers" to "service_role";

grant update on table "public"."tbl_user_tiers" to "service_role";

grant delete on table "public"."tbl_users" to "anon";

grant insert on table "public"."tbl_users" to "anon";

grant references on table "public"."tbl_users" to "anon";

grant select on table "public"."tbl_users" to "anon";

grant trigger on table "public"."tbl_users" to "anon";

grant truncate on table "public"."tbl_users" to "anon";

grant update on table "public"."tbl_users" to "anon";

grant delete on table "public"."tbl_users" to "authenticated";

grant insert on table "public"."tbl_users" to "authenticated";

grant references on table "public"."tbl_users" to "authenticated";

grant select on table "public"."tbl_users" to "authenticated";

grant trigger on table "public"."tbl_users" to "authenticated";

grant truncate on table "public"."tbl_users" to "authenticated";

grant update on table "public"."tbl_users" to "authenticated";

grant delete on table "public"."tbl_users" to "service_role";

grant insert on table "public"."tbl_users" to "service_role";

grant references on table "public"."tbl_users" to "service_role";

grant select on table "public"."tbl_users" to "service_role";

grant trigger on table "public"."tbl_users" to "service_role";

grant truncate on table "public"."tbl_users" to "service_role";

grant update on table "public"."tbl_users" to "service_role";


