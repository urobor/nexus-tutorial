# Migration `20200922213027-base-topic-entity`

This migration has been generated by Kuba Salkowski at 9/22/2020, 11:30:27 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Topic" (
"id" SERIAL,
"title" text   NOT NULL ,
"body" text   NOT NULL ,
"nextTopicId" integer   NOT NULL ,
PRIMARY KEY ("id")
)
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200920214723-init..20200922213027-base-topic-entity
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -14,5 +14,12 @@
   id        Int     @id @default(autoincrement())
   title     String
   body      String
   published Boolean
-}
+}
+
+model Topic {
+  id          Int    @id @default(autoincrement())
+  title       String
+  body        String
+  nextTopicId Int
+}
```


