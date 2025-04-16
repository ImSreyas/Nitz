create type "public"."problem_status" as enum ('pending', 'approved', 'rejected', 'archived', 'deprecated');

revoke delete on table "public"."tbl_user_tiers" from "anon";

revoke insert on table "public"."tbl_user_tiers" from "anon";

revoke references on table "public"."tbl_user_tiers" from "anon";

revoke select on table "public"."tbl_user_tiers" from "anon";

revoke trigger on table "public"."tbl_user_tiers" from "anon";

revoke truncate on table "public"."tbl_user_tiers" from "anon";

revoke update on table "public"."tbl_user_tiers" from "anon";

revoke delete on table "public"."tbl_user_tiers" from "authenticated";

revoke insert on table "public"."tbl_user_tiers" from "authenticated";

revoke references on table "public"."tbl_user_tiers" from "authenticated";

revoke select on table "public"."tbl_user_tiers" from "authenticated";

revoke trigger on table "public"."tbl_user_tiers" from "authenticated";

revoke truncate on table "public"."tbl_user_tiers" from "authenticated";

revoke update on table "public"."tbl_user_tiers" from "authenticated";

revoke delete on table "public"."tbl_user_tiers" from "service_role";

revoke insert on table "public"."tbl_user_tiers" from "service_role";

revoke references on table "public"."tbl_user_tiers" from "service_role";

revoke select on table "public"."tbl_user_tiers" from "service_role";

revoke trigger on table "public"."tbl_user_tiers" from "service_role";

revoke truncate on table "public"."tbl_user_tiers" from "service_role";

revoke update on table "public"."tbl_user_tiers" from "service_role";

alter table "public"."tbl_users" drop constraint "tbl_users_tier_fkey";

alter table "public"."tbl_user_tiers" drop constraint "tbl_user_tiers_pkey";

drop index if exists "public"."tbl_user_tiers_pkey";

drop table "public"."tbl_user_tiers";

create table "public"."tbl_admins" (
    "id" uuid not null,
    "name" character varying(255) not null,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "email" text
);


create table "public"."tbl_tiers" (
    "id" integer not null default nextval('tbl_user_tiers_id_seq'::regclass),
    "tier_name" text not null,
    "value" integer default 2
);


alter table "public"."tbl_problems" add column "blackpoints" numeric default '0'::numeric;

alter table "public"."tbl_problems" add column "is_deleted" boolean default false;

alter table "public"."tbl_problems" add column "publish_status" boolean default false;

alter table "public"."tbl_problems" add column "status" problem_status not null default 'pending'::problem_status;

alter sequence "public"."tbl_user_tiers_id_seq" owned by "public"."tbl_tiers"."id";

CREATE UNIQUE INDEX tbl_admins_pkey ON public.tbl_admins USING btree (id);

CREATE UNIQUE INDEX tbl_user_tiers_pkey ON public.tbl_tiers USING btree (id);

alter table "public"."tbl_admins" add constraint "tbl_admins_pkey" PRIMARY KEY using index "tbl_admins_pkey";

alter table "public"."tbl_tiers" add constraint "tbl_user_tiers_pkey" PRIMARY KEY using index "tbl_user_tiers_pkey";

alter table "public"."tbl_admins" add constraint "tbl_admins_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."tbl_admins" validate constraint "tbl_admins_id_fkey";

alter table "public"."tbl_users" add constraint "tbl_users_tier_fkey" FOREIGN KEY (tier) REFERENCES tbl_tiers(id) not valid;

alter table "public"."tbl_users" validate constraint "tbl_users_tier_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_user_tier()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  computed_value INTEGER;
  matched_tier_id INTEGER;
BEGIN
  -- Compute the tier value from points
  computed_value := NEW.points / 500;

  -- Get the matching tier ID from tbl_tiers
  SELECT id INTO matched_tier_id
  FROM tbl_tiers
  WHERE value = computed_value
  LIMIT 1;

  -- Set the tier field
  NEW.tier := matched_tier_id;

  RETURN NEW;
END;
$function$
;

grant delete on table "public"."tbl_admins" to "anon";

grant insert on table "public"."tbl_admins" to "anon";

grant references on table "public"."tbl_admins" to "anon";

grant select on table "public"."tbl_admins" to "anon";

grant trigger on table "public"."tbl_admins" to "anon";

grant truncate on table "public"."tbl_admins" to "anon";

grant update on table "public"."tbl_admins" to "anon";

grant delete on table "public"."tbl_admins" to "authenticated";

grant insert on table "public"."tbl_admins" to "authenticated";

grant references on table "public"."tbl_admins" to "authenticated";

grant select on table "public"."tbl_admins" to "authenticated";

grant trigger on table "public"."tbl_admins" to "authenticated";

grant truncate on table "public"."tbl_admins" to "authenticated";

grant update on table "public"."tbl_admins" to "authenticated";

grant delete on table "public"."tbl_admins" to "service_role";

grant insert on table "public"."tbl_admins" to "service_role";

grant references on table "public"."tbl_admins" to "service_role";

grant select on table "public"."tbl_admins" to "service_role";

grant trigger on table "public"."tbl_admins" to "service_role";

grant truncate on table "public"."tbl_admins" to "service_role";

grant update on table "public"."tbl_admins" to "service_role";

grant delete on table "public"."tbl_tiers" to "anon";

grant insert on table "public"."tbl_tiers" to "anon";

grant references on table "public"."tbl_tiers" to "anon";

grant select on table "public"."tbl_tiers" to "anon";

grant trigger on table "public"."tbl_tiers" to "anon";

grant truncate on table "public"."tbl_tiers" to "anon";

grant update on table "public"."tbl_tiers" to "anon";

grant delete on table "public"."tbl_tiers" to "authenticated";

grant insert on table "public"."tbl_tiers" to "authenticated";

grant references on table "public"."tbl_tiers" to "authenticated";

grant select on table "public"."tbl_tiers" to "authenticated";

grant trigger on table "public"."tbl_tiers" to "authenticated";

grant truncate on table "public"."tbl_tiers" to "authenticated";

grant update on table "public"."tbl_tiers" to "authenticated";

grant delete on table "public"."tbl_tiers" to "service_role";

grant insert on table "public"."tbl_tiers" to "service_role";

grant references on table "public"."tbl_tiers" to "service_role";

grant select on table "public"."tbl_tiers" to "service_role";

grant trigger on table "public"."tbl_tiers" to "service_role";

grant truncate on table "public"."tbl_tiers" to "service_role";

grant update on table "public"."tbl_tiers" to "service_role";

CREATE TRIGGER trg_update_user_tier BEFORE INSERT OR UPDATE OF points ON public.tbl_users FOR EACH ROW EXECUTE FUNCTION update_user_tier();


