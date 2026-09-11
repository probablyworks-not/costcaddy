CREATE TYPE "public"."active_status" AS ENUM('active', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."audit_status" AS ENUM('assigned', 'in-progress', 'submitted', 'published');--> statement-breakpoint
CREATE TYPE "public"."file_kind" AS ENUM('image', 'file');--> statement-breakpoint
CREATE TYPE "public"."item_status" AS ENUM('pending', 'pass', 'fail', 'observation', 'na');--> statement-breakpoint
CREATE TYPE "public"."metric_cost_group" AS ENUM('bar', 'kitchen', 'nc');--> statement-breakpoint
CREATE TYPE "public"."metric_kind" AS ENUM('tax', 'charge');--> statement-breakpoint
CREATE TYPE "public"."metric_rev_group" AS ENUM('bar', 'kitchen');--> statement-breakpoint
CREATE TYPE "public"."metric_section" AS ENUM('covers', 'sales', 'discount', 'tax', 'cost');--> statement-breakpoint
CREATE TYPE "public"."metric_unit" AS ENUM('currency', 'count');--> statement-breakpoint
CREATE TYPE "public"."polish_state" AS ENUM('polishing', 'ready', 'failed');--> statement-breakpoint
CREATE TYPE "public"."resolution_status" AS ENUM('Pending', 'Resolved');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('super_admin', 'auditor', 'outlet');--> statement-breakpoint
CREATE TYPE "public"."severity" AS ENUM('High', 'Medium', 'Low');--> statement-breakpoint
CREATE TABLE "brands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orgs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "outlets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"brand_id" uuid NOT NULL,
	"name" text NOT NULL,
	"city" text,
	"status" "active_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auditor_outlets" (
	"org_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"outlet_id" uuid NOT NULL,
	CONSTRAINT "auditor_outlets_user_id_outlet_id_pk" PRIMARY KEY("user_id","outlet_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"role" "role" NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"pwd_hash" text NOT NULL,
	"must_change_password" boolean DEFAULT true NOT NULL,
	"status" "active_status" DEFAULT 'active' NOT NULL,
	"last_active_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_checklist_points" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"template_id" uuid NOT NULL,
	"department_id" uuid NOT NULL,
	"label" text NOT NULL,
	"guidance" text,
	"freeform" boolean DEFAULT false NOT NULL,
	"code" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_departments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"template_id" uuid NOT NULL,
	"cat" text NOT NULL,
	"code" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"template_id" uuid NOT NULL,
	"metric_key" text NOT NULL,
	"label" text NOT NULL,
	"section" "metric_section" NOT NULL,
	"rev_group" "metric_rev_group",
	"kind" "metric_kind",
	"cost_group" "metric_cost_group",
	"den" text,
	"unit" "metric_unit",
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_item_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"audit_item_id" uuid NOT NULL,
	"kind" "file_kind" NOT NULL,
	"name" text NOT NULL,
	"storage_path" text NOT NULL,
	"meta" text,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"audit_id" uuid NOT NULL,
	"code" text NOT NULL,
	"cat" text NOT NULL,
	"cat_code" text NOT NULL,
	"label" text NOT NULL,
	"guidance" text,
	"freeform" boolean DEFAULT false NOT NULL,
	"status" "item_status" DEFAULT 'pending' NOT NULL,
	"remark" text DEFAULT '' NOT NULL,
	"na_reason" text,
	"severity" "severity",
	"impact" text,
	"corrective_action" text,
	"sla" text,
	"ownership" text,
	"resolution_status" "resolution_status",
	"ref_id" text,
	"category" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_metric_defs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"audit_id" uuid NOT NULL,
	"metric_key" text NOT NULL,
	"label" text NOT NULL,
	"section" "metric_section" NOT NULL,
	"rev_group" "metric_rev_group",
	"kind" "metric_kind",
	"cost_group" "metric_cost_group",
	"den" text,
	"unit" "metric_unit",
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_metric_values" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"audit_id" uuid NOT NULL,
	"metric_key" text NOT NULL,
	"value" numeric
);
--> statement-breakpoint
CREATE TABLE "audits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"token" text NOT NULL,
	"outlet_id" uuid NOT NULL,
	"auditor_id" uuid NOT NULL,
	"template_id" uuid NOT NULL,
	"name" text,
	"due_start" date,
	"due_date" date NOT NULL,
	"status" "audit_status" DEFAULT 'assigned' NOT NULL,
	"submitted_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"version" integer DEFAULT 0 NOT NULL,
	"polish_state" "polish_state",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "audits_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"audit_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"token" text NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"pdf_path" text,
	"xlsx_path" text,
	"note" text,
	CONSTRAINT "reports_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "brands" ADD CONSTRAINT "brands_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outlets" ADD CONSTRAINT "outlets_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outlets" ADD CONSTRAINT "outlets_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auditor_outlets" ADD CONSTRAINT "auditor_outlets_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auditor_outlets" ADD CONSTRAINT "auditor_outlets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auditor_outlets" ADD CONSTRAINT "auditor_outlets_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_checklist_points" ADD CONSTRAINT "template_checklist_points_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_checklist_points" ADD CONSTRAINT "template_checklist_points_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_checklist_points" ADD CONSTRAINT "template_checklist_points_department_id_template_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."template_departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_departments" ADD CONSTRAINT "template_departments_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_departments" ADD CONSTRAINT "template_departments_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_metrics" ADD CONSTRAINT "template_metrics_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_metrics" ADD CONSTRAINT "template_metrics_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_item_files" ADD CONSTRAINT "audit_item_files_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_item_files" ADD CONSTRAINT "audit_item_files_audit_item_id_audit_items_id_fk" FOREIGN KEY ("audit_item_id") REFERENCES "public"."audit_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_items" ADD CONSTRAINT "audit_items_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_items" ADD CONSTRAINT "audit_items_audit_id_audits_id_fk" FOREIGN KEY ("audit_id") REFERENCES "public"."audits"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_metric_defs" ADD CONSTRAINT "audit_metric_defs_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_metric_defs" ADD CONSTRAINT "audit_metric_defs_audit_id_audits_id_fk" FOREIGN KEY ("audit_id") REFERENCES "public"."audits"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_metric_values" ADD CONSTRAINT "audit_metric_values_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_metric_values" ADD CONSTRAINT "audit_metric_values_audit_id_audits_id_fk" FOREIGN KEY ("audit_id") REFERENCES "public"."audits"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audits" ADD CONSTRAINT "audits_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audits" ADD CONSTRAINT "audits_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audits" ADD CONSTRAINT "audits_auditor_id_users_id_fk" FOREIGN KEY ("auditor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audits" ADD CONSTRAINT "audits_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_audit_id_audits_id_fk" FOREIGN KEY ("audit_id") REFERENCES "public"."audits"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "users_org_email_unique" ON "users" USING btree ("org_id","email");--> statement-breakpoint
CREATE UNIQUE INDEX "template_checklist_points_template_code_unique" ON "template_checklist_points" USING btree ("template_id","code");--> statement-breakpoint
CREATE UNIQUE INDEX "template_departments_template_code_unique" ON "template_departments" USING btree ("template_id","code");--> statement-breakpoint
CREATE UNIQUE INDEX "template_metrics_template_key_unique" ON "template_metrics" USING btree ("template_id","metric_key");--> statement-breakpoint
CREATE UNIQUE INDEX "audit_items_audit_code_unique" ON "audit_items" USING btree ("audit_id","code");--> statement-breakpoint
CREATE UNIQUE INDEX "audit_metric_defs_audit_key_unique" ON "audit_metric_defs" USING btree ("audit_id","metric_key");--> statement-breakpoint
CREATE UNIQUE INDEX "audit_metric_values_audit_key_unique" ON "audit_metric_values" USING btree ("audit_id","metric_key");--> statement-breakpoint
CREATE UNIQUE INDEX "reports_audit_version_unique" ON "reports" USING btree ("audit_id","version");