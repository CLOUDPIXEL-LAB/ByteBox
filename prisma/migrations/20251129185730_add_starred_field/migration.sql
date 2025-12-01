-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "imageData" TEXT,
    "fileData" TEXT,
    "fileName" TEXT,
    "fileType" TEXT,
    "fileSize" INTEGER,
    "language" TEXT,
    "starred" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cards_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_cards" ("categoryId", "content", "createdAt", "description", "fileData", "fileName", "fileSize", "fileType", "id", "imageData", "language", "order", "title", "type", "updatedAt") SELECT "categoryId", "content", "createdAt", "description", "fileData", "fileName", "fileSize", "fileType", "id", "imageData", "language", "order", "title", "type", "updatedAt" FROM "cards";
DROP TABLE "cards";
ALTER TABLE "new_cards" RENAME TO "cards";
CREATE INDEX "cards_categoryId_idx" ON "cards"("categoryId");
CREATE INDEX "cards_type_idx" ON "cards"("type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
