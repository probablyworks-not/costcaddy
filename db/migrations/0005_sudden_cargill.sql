ALTER TABLE "audit_items" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "audit_items" ALTER COLUMN "status" SET DEFAULT 'pending'::text;--> statement-breakpoint
-- 'observation' status removed (auditor flow now only exposes Pass/Fail/N-A);
-- existing observation items already required a remark and counted as a
-- finding just like fail, so fold them into fail rather than losing data.
UPDATE "audit_items" SET "status" = 'fail' WHERE "status" = 'observation';--> statement-breakpoint
DROP TYPE "public"."item_status";--> statement-breakpoint
CREATE TYPE "public"."item_status" AS ENUM('pending', 'pass', 'fail', 'na');--> statement-breakpoint
ALTER TABLE "audit_items" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."item_status";--> statement-breakpoint
ALTER TABLE "audit_items" ALTER COLUMN "status" SET DATA TYPE "public"."item_status" USING "status"::"public"."item_status";