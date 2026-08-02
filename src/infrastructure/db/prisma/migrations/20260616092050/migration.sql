-- CreateTable
CREATE TABLE "Profile"
(
    "id"         TEXT         NOT NULL,
    "userId"     TEXT         NOT NULL,
    "nickname"   TEXT         NOT NULL DEFAULT 'guest',
    "level"      INTEGER      NOT NULL DEFAULT 1,
    "rating"     INTEGER      NOT NULL DEFAULT 1000,
    "experience" INTEGER      NOT NULL DEFAULT 0,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileAchievement"
(
    "id"            TEXT         NOT NULL,
    "profileId"     TEXT         NOT NULL,
    "achievementId" TEXT         NOT NULL,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement"
(
    "id"          TEXT         NOT NULL,
    "title"       TEXT         NOT NULL,
    "description" TEXT,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceLevel"
(
    "level"        INTEGER      NOT NULL,
    "nextRequired" INTEGER      NOT NULL,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperienceLevel_pkey" PRIMARY KEY ("level")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile" ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileAchievement_profileId_achievementId_key" ON "ProfileAchievement" ("profileId", "achievementId");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_title_key" ON "Achievement" ("title");

-- AddForeignKey
ALTER TABLE "ProfileAchievement"
    ADD CONSTRAINT "ProfileAchievement_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileAchievement"
    ADD CONSTRAINT "ProfileAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
