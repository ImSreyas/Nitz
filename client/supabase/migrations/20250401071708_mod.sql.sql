alter table "public"."tbl_starter_code" drop column "code";

alter table "public"."tbl_starter_code" add column "logic_code" text;

alter table "public"."tbl_starter_code" add column "user_code" text;

CREATE UNIQUE INDEX tbl_problems_title_key ON public.tbl_problems USING btree (title);

alter table "public"."tbl_problems" add constraint "tbl_problems_title_key" UNIQUE using index "tbl_problems_title_key";


