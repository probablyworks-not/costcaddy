PRODUCT REQUIREMENTS DOCUMENT
F&amp;B Controller — Restaurant Audit &amp; Analytics Platform
Version 1.0 (MVP)  ·  Draft for Review
Status: Draft  ·  Owner: Product  ·  Date: July 21, 2026

## Table of Contents

## 1. Overview &amp; Problem Statement

## 1.1 The Problem
F&amp;B controllers and auditors currently run restaurant audits entirely on Excel. Auditors physically visit each restaurant and manually pull data across multiple report types, analyse each one by hand, review stored-food photos, and reconcile PNL, ingredient costs, bill modifications, service charges, and unit economics. There is no dedicated software for this workflow — it is slow, error-prone, hard to standardise across outlets, and impossible to trend over time.

## 1.2 The Product
A web and mobile platform that digitises the F&amp;B audit workflow and layers analytics on top of the restaurant&apos;s operational reports. Auditors run structured, checklist-driven audits on mobile (uploading photos and remarks); a Super Admin reviews and publishes reports; restaurant admins view published reports and (in a later phase) assign corrective tasks. In parallel, the platform ingests six operational report types, auto-parses them, and surfaces insights on cost, discounts, cancellations, stock, and unit economics.

## 1.3 Vision vs. MVP
Vision: A plug-and-play control tower where any restaurant uploads its reports and instantly gets cost control, variance, and unit-economics analytics across all outlets.
MVP (this document): Deliver the end-to-end audit workflow first (auditor → super admin → published report), a Super-Admin-owned checklist template builder, plus report upload with auto-parse and initial insights for the six report types. Task assignment and multi-format normalisation are deferred.

## 1.4 Goals &amp; Success Metrics
Goal
Success Metric (MVP)
Replace Excel-based audits
≥ 80% of audits completed in-app vs. spreadsheet
Speed up the audit cycle
Reduce audit + report turnaround time by ≥ 50%
Standardise audits across outlets
100% of audits run from a Super-Admin template
Make reports analyzable
6 report types parse successfully ≥ 90% of uploads
Give restaurants visibility
Restaurant admins view every published report online

## 1.5 Out of Scope (MVP)
In-app task assignment to Food / Procurement managers (view &amp; export only for MVP).
Auto-normalisation across differing POS/report formats (see Open Question OQ-1).
Advanced role/permission granularity — basic login only for MVP.
Billing, subscriptions, and multi-tenant onboarding automation.

## 2. Users &amp; Roles
The platform serves three primary roles. A Restaurant may have its own admins and managers; auditors operate across restaurants.
Role
Who they are
Primary surface
Key actions
Super Admin
Creates restaurants, auditors, and audit templates; the control centre for the platform.
Laptop / web
Create audits, define checklists, assign audits, review &amp; publish reports, manage users
Auditor
Field staff responsible for carrying out audits at restaurants.
Mobile (responsive)
View pending audits, run checklist, upload photos/files, add remarks, submit for review
Restaurant Admin
Restaurant-side owner/manager who consumes reports.
Laptop / web
View published reports, drill into findings, export; (later) assign tasks to managers
Figure 1 — Users overview (source project notes)
Note: The user-flow mockups reference downstream restaurant-side roles — Food Manager and Procurement Manager — who receive assigned tasks. These are represented in the data model but their task-assignment functionality is deferred beyond MVP.

## 3. User Flows

## 3.1 Auditor Flow (mobile-responsive)
Auditor → sees pending audits (restaurant name + date) → clicks into an audit → sees the restaurant&apos;s checklist → for each item, can upload files/photos and enter remarks → completes checklist → submits → can view the report.
Step
Screen / Action
Notes
1
Login
Basic auth; lands on pending-audits list
2
Pending audits list
Each row: restaurant name + audit date; sorted by due date
3
Open audit
Loads the checklist template assigned to that restaurant
4
Complete checklist items
Per item: upload photo/file + enter remark; mark pass/fail/observation
5
Submit for review
Locks the audit; routes to Super Admin queue
6
View report
Read-only view of submitted audit
Figure 2 — Auditor flow (mobile-responsive)

## 3.2 Super Admin Flow (laptop)
Super Admin creates audits (name + checklist, or reuses an existing template), defines roles and assigns audits to auditors, and manages restaurants. After an auditor submits, the Super Admin reviews the report, edits it if needed, and publishes it to the client.
Step
Action
Notes
1
Create audit
Name the audit; create a new checklist or reuse a template
2
Assign audit
Assign to an auditor and a restaurant with a due date
3
Manage restaurants
Restaurants have their own admins &amp; roles
4
Review submission
Open completed audit from the review queue
5
Edit report
Adjust findings/remarks before publishing
6
Publish to client
Report becomes visible to the restaurant admin
Figure 3 — Super Admin flow

## 3.3 Restaurant Admin Flow (laptop)
Restaurant admin views published reports, drills into the detail of each report as required, and exports. Task assignment (create roles → assign tasks → check status) is shown in the flow but deferred beyond MVP.
Step
Action
MVP?
1
View published reports
Yes
2
Drill into report details
Yes
3
Export report
Yes
4
Create roles &amp; assign tasks
Deferred
5
Assign tasks / check status
Deferred
Figure 4 — Restaurant Admin flow, with sample Food Safety &amp; Compliance report

## 4. Operational Reports &amp; Auto-Parsing
Beyond audits, the platform ingests six operational report types. In MVP these are uploaded (Excel/CSV, PDF, and image via OCR), auto-parsed into structured data, and surfaced with initial insights. Auto-parse reliability depends on format standardisation — see Open Question OQ-1.
#
Report type
Contents
Target insights
1
Bill Edit &amp; Modification
Edited/modified bills — Swiggy Dineout discounts, items added/removed, service charge removed, credit card
Per-item unit economics; service charges removed; modification reasons
2
Non-chargeable
Food/drinks not charged — govt officials, staff, DJ, guest complimentary, party
Comp volume &amp; value; policy compliance
3
Item Purchase Statement
Purchase details — item, category, qty, amount, vendor, date
Ingredient price fluctuations → dish cost → PNL impact; vendor-switch impact
4
Stock Statement
Items with opening &amp; closing stock value (likely daily)
Consumption, variance, shrinkage
5
Item Cancellation
Cancelled items and cancellation reasons
Cancellation patterns; SOP adherence
6
Discounts
Items, discounts given, and reasons
Discount fluctuation vs. policy thresholds

## 4.1 Supported Upload Formats
Excel / CSV — structured tabular reports (primary path).
PDF — parsed for tabular content.
Images — parsed via OCR.
Parsing rule of thumb: every upload is stored in original form, parsed into a normalised schema per report type, and flagged for manual review if confidence is low.

## 4.2 Sample Audit Checklist (current Excel format)
Illustrative of the existing spreadsheet-based audit the platform replaces — a daily checklist (Verify NC Report, Cancellation Orders, Bill Modification, Discount Report, etc.) with a controls-remarks column.
Figure 5 — Existing audit checklist sample (UNIT 7A Restaurant &amp; Bar)

## 5. Feature Requirements (Prioritised)
Priorities reflect the ranked v1 focus: (1) auditor mobile checklist flow, (2) Super Admin review &amp; publish, (3) template/checklist builder, (4) restaurant report viewing. Report upload/parsing runs in parallel as a core MVP pillar.
ID
Feature
Priority
Role
F-1
Auditor mobile checklist flow (upload photos/files, remarks, submit)
P0
Auditor
F-2
Super Admin review, edit &amp; publish reports
P0
Super Admin
F-3
Checklist / audit template builder
P0
Super Admin
F-4
Report upload + auto-parse + insights (6 types)
P0
Super Admin / System
F-5
Restaurant report viewing + export
P1
Restaurant Admin
F-6
User &amp; restaurant management (create users, assign audits)
P1
Super Admin
F-7
Basic auth / login
P1
All
F-8
Task assignment to managers
P3
Restaurant Admin

## 6. User Stories &amp; Acceptance Criteria

## 6.1 Auditor (F-1)
US-1.1  As an auditor, I want to see my pending audits with restaurant name and date, so I know what to do next.
Acceptance criteria:
Pending audits list shows restaurant name + audit date.
List is sorted by due date; overdue items flagged.
Tapping a row opens that audit.
View is mobile-responsive.
US-1.2  As an auditor, I want to open a restaurant&apos;s checklist and complete each item, so I can record findings on site.
Acceptance criteria:
Checklist loads from the template assigned to that restaurant.
Each item supports a status (e.g., pass / fail / observation).
Each item allows a free-text remark.
Progress is saved as I go (no data loss on connection drop).
US-1.3  As an auditor, I want to upload photos or files against a checklist item, so evidence is captured.
Acceptance criteria:
I can attach one or more photos/files per item.
Uploads work from a mobile camera and gallery.
Attachments are linked to the specific item and visible in the report.
US-1.4  As an auditor, I want to submit the completed audit for review, so the Super Admin can act on it.
Acceptance criteria:
Submit is enabled only when required items are complete.
On submit, the audit locks and moves to the Super Admin review queue.
I can view (read-only) the submitted report.

## 6.2 Super Admin (F-2, F-3, F-6)
US-2.1  As a Super Admin, I want to create an audit by naming it and building or reusing a checklist, so audits are standardised.
Acceptance criteria:
I can create a new checklist or select an existing template.
A checklist is a list of items, each with a label and optional guidance.
Only Super Admins can create/edit templates.
Saved templates are reusable across restaurants.
US-2.2  As a Super Admin, I want to assign an audit to an auditor and restaurant with a due date, so work is allocated.
Acceptance criteria:
I can pick auditor, restaurant, and due date.
The assigned audit appears in that auditor&apos;s pending list.
I can see status: assigned / in-progress / submitted / published.
US-2.3  As a Super Admin, I want to review a submitted audit, edit findings, and publish it, so clients get a clean report.
Acceptance criteria:
Submitted audits appear in a review queue.
I can edit findings/remarks before publishing.
On publish, the report becomes visible to the restaurant admin.
Published reports are immutable (further edits create a new version).
US-2.4  As a Super Admin, I want to create restaurants and users, so the platform is populated.
Acceptance criteria:
I can create a restaurant with its admins.
I can create auditor accounts.
Users receive basic login credentials.

## 6.3 Report Upload &amp; Parsing (F-4)
US-3.1  As a Super Admin, I want to upload an operational report and have it auto-parsed, so I don&apos;t process Excel by hand.
Acceptance criteria:
I can upload Excel/CSV, PDF, or image files.
The system detects/labels the report type (one of the six).
Parsed data is stored in a structured schema.
Original file is retained and downloadable.
Low-confidence parses are flagged for manual review.
US-3.2  As a Super Admin, I want to see initial insights per report type, so I can spot issues fast.
Acceptance criteria:
Each report type shows its target insights (see §4).
Discounts and cancellations are highlighted against policy thresholds where defined.
Insights are viewable per restaurant and per period.

## 6.4 Restaurant Admin (F-5)
US-4.1  As a restaurant admin, I want to view published reports and drill into details, so I understand findings.
Acceptance criteria:
I see only my restaurant&apos;s published reports.
I can open any report and view item-level findings, remarks, and photos.
I can export a report (e.g., PDF).

## 7. High-Level Data Model
Indicative entities to support MVP. Detailed schema TBD with engineering.
Entity
Key fields
Relationships
Restaurant
id, name, location, admins[]
has many Audits, Reports, Users
User
id, name, role, restaurant_id?
belongs to Restaurant (admins/managers); auditors are cross-restaurant
ChecklistTemplate
id, name, items[]
created by Super Admin; used by Audits
Audit
id, restaurant_id, auditor_id, template_id, status, due_date
has many AuditItems
AuditItem
id, audit_id, label, status, remark, attachments[]
belongs to Audit
Report (published)
id, audit_id, version, published_at
derived from a submitted Audit
OperationalReport
id, restaurant_id, type, period, source_file, parsed_data, parse_status
belongs to Restaurant
Task (deferred)
id, report_id, assignee_id, status
belongs to Report / User

## 8. Open Questions &amp; Assumptions
ID
Item
Type
Impact
OQ-1
Are operational report formats standardised across restaurants, or do they vary by POS? (Flagged pending.)
Open
High — drives auto-parse feasibility &amp; effort for F-4
OQ-2
Which insights need policy thresholds defined (discounts, cancellations)?
Open
Medium — needed for insight highlighting
A-1
Task assignment to Food/Procurement managers is out of MVP.
Assumption
Low
A-2
Basic login only in MVP; granular permissions later.
Assumption
Low
A-3
Auditor surface must be fully mobile-responsive; admin surfaces are laptop-first.
Assumption
Medium
Recommended next step: resolve OQ-1 before committing engineering effort to auto-parse, since a variable-format world materially changes the F-4 build (per-format adapters vs. a single normaliser).