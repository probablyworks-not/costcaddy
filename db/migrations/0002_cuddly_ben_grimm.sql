CREATE TYPE "public"."op_file_parse_status" AS ENUM('parsed', 'unreadable');--> statement-breakpoint
CREATE TYPE "public"."operational_file_type" AS ENUM('Bill Edit & Modification', 'Non-chargeable', 'Item Purchase Statement', 'Stock Statement', 'Item Cancellation', 'Discounts');--> statement-breakpoint
CREATE TABLE "audit_operational_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"audit_id" uuid NOT NULL,
	"type" "operational_file_type" NOT NULL,
	"period" text NOT NULL,
	"name" text NOT NULL,
	"format" text NOT NULL,
	"storage_path" text NOT NULL,
	"parse_status" "op_file_parse_status" NOT NULL,
	"coverage_summary" text,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_operational_files" ADD CONSTRAINT "audit_operational_files_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_operational_files" ADD CONSTRAINT "audit_operational_files_audit_id_audits_id_fk" FOREIGN KEY ("audit_id") REFERENCES "public"."audits"("id") ON DELETE no action ON UPDATE no action;