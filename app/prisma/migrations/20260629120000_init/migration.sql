-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('student', 'trainer', 'admin');

-- CreateEnum
CREATE TYPE "gender" AS ENUM ('male', 'female', 'none');

-- CreateEnum
CREATE TYPE "skill_level" AS ENUM ('beginner', 'basic', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "price_visibility" AS ENUM ('public', 'consult');

-- CreateEnum
CREATE TYPE "chat_room_status" AS ENUM ('new', 'active', 'trial_proposed', 'reservation_pending', 'reserved', 'closed', 'left');

-- CreateEnum
CREATE TYPE "message_sender_role" AS ENUM ('student', 'trainer', 'system');

-- CreateEnum
CREATE TYPE "media_type" AS ENUM ('photo', 'video', 'audio', 'link');

-- CreateEnum
CREATE TYPE "banner_status" AS ENUM ('draft', 'published', 'hidden');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "role" "user_role" NOT NULL DEFAULT 'student',
    "login_id" VARCHAR(50),
    "email" VARCHAR(255),
    "phone" VARCHAR(30),
    "password_hash" TEXT,
    "name" VARCHAR(50) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "terms_agreed_at" TIMESTAMPTZ(6),
    "privacy_agreed_at" TIMESTAMPTZ(6),
    "marketing_agreed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_profiles" (
    "user_id" TEXT NOT NULL,
    "gender" "gender",
    "birth_year" INTEGER,
    "district_id" TEXT,
    "neighborhood_id" TEXT,
    "skill_level" "skill_level",
    "lesson_goal_id" TEXT,
    "admission_major" VARCHAR(50),
    "event_date" DATE,
    "event_song_name" VARCHAR(150),
    "audition_direction" VARCHAR(80),
    "other_lesson_description" TEXT,
    "main_concern" VARCHAR(120),
    "intro" TEXT,
    "profile_completion_score" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "genres" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_goals" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "lesson_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facilities" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "neighborhoods" (
    "id" TEXT NOT NULL,
    "district_id" TEXT NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "neighborhoods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainer_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "display_name" VARCHAR(50) NOT NULL,
    "gender" "gender",
    "avatar_url" TEXT,
    "hero_image_url" TEXT,
    "card_image_url" TEXT,
    "location_text" VARCHAR(255),
    "address" TEXT,
    "district_id" TEXT,
    "neighborhood_id" TEXT,
    "headline" TEXT,
    "intro" TEXT,
    "career_years" INTEGER NOT NULL DEFAULT 0,
    "lesson_method" VARCHAR(80),
    "lesson_minutes" INTEGER,
    "price_monthly" INTEGER,
    "price_single" INTEGER,
    "price_visibility" "price_visibility" NOT NULL DEFAULT 'public',
    "has_practice_room" BOOLEAN NOT NULL DEFAULT false,
    "has_parking" BOOLEAN NOT NULL DEFAULT false,
    "lesson_approach" TEXT,
    "extra_info" TEXT,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "bookmark_count" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "trainer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_genres" ("student_id" TEXT NOT NULL, "genre_id" TEXT NOT NULL, CONSTRAINT "student_genres_pkey" PRIMARY KEY ("student_id","genre_id"));
CREATE TABLE "trainer_genres" ("trainer_id" TEXT NOT NULL, "genre_id" TEXT NOT NULL, CONSTRAINT "trainer_genres_pkey" PRIMARY KEY ("trainer_id","genre_id"));
CREATE TABLE "trainer_goals" ("trainer_id" TEXT NOT NULL, "goal_id" TEXT NOT NULL, CONSTRAINT "trainer_goals_pkey" PRIMARY KEY ("trainer_id","goal_id"));
CREATE TABLE "trainer_tags" ("trainer_id" TEXT NOT NULL, "tag_id" TEXT NOT NULL, CONSTRAINT "trainer_tags_pkey" PRIMARY KEY ("trainer_id","tag_id"));
CREATE TABLE "trainer_facilities" ("trainer_id" TEXT NOT NULL, "facility_id" TEXT NOT NULL, "available" BOOLEAN NOT NULL DEFAULT true, CONSTRAINT "trainer_facilities_pkey" PRIMARY KEY ("trainer_id","facility_id"));

-- CreateTable
CREATE TABLE "trainer_recommended_for" (
    "id" TEXT NOT NULL,
    "trainer_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "trainer_recommended_for_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "trainer_educations" ("id" TEXT NOT NULL, "trainer_id" TEXT NOT NULL, "school" VARCHAR(120) NOT NULL, "major" VARCHAR(120), "sort_order" INTEGER NOT NULL DEFAULT 0, "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMPTZ(6) NOT NULL, CONSTRAINT "trainer_educations_pkey" PRIMARY KEY ("id"));
CREATE TABLE "trainer_careers" ("id" TEXT NOT NULL, "trainer_id" TEXT NOT NULL, "period" VARCHAR(80), "title" VARCHAR(120) NOT NULL, "detail" TEXT, "sort_order" INTEGER NOT NULL DEFAULT 0, "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMPTZ(6) NOT NULL, CONSTRAINT "trainer_careers_pkey" PRIMARY KEY ("id"));
CREATE TABLE "trainer_works" ("id" TEXT NOT NULL, "trainer_id" TEXT NOT NULL, "type" "media_type" NOT NULL, "title" VARCHAR(150) NOT NULL, "subtitle" VARCHAR(150), "url" TEXT, "sort_order" INTEGER NOT NULL DEFAULT 0, "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMPTZ(6) NOT NULL, CONSTRAINT "trainer_works_pkey" PRIMARY KEY ("id"));
CREATE TABLE "trainer_media" ("id" TEXT NOT NULL, "trainer_id" TEXT NOT NULL, "type" "media_type" NOT NULL, "title" VARCHAR(100), "url" TEXT NOT NULL, "sort_order" INTEGER NOT NULL DEFAULT 0, "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMPTZ(6) NOT NULL, CONSTRAINT "trainer_media_pkey" PRIMARY KEY ("id"));

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "trainer_id" TEXT NOT NULL,
    "student_id" TEXT,
    "body" TEXT NOT NULL,
    "display_name" VARCHAR(50),
    "region_label" VARCHAR(50),
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "dislikes_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "review_reactions" ("review_id" TEXT NOT NULL, "user_id" TEXT NOT NULL, "reaction" VARCHAR(10) NOT NULL, "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMPTZ(6) NOT NULL, CONSTRAINT "review_reactions_pkey" PRIMARY KEY ("review_id","user_id"));
CREATE TABLE "bookmarks" ("user_id" TEXT NOT NULL, "trainer_id" TEXT NOT NULL, "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("user_id","trainer_id"));

-- CreateTable
CREATE TABLE "chat_rooms" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "trainer_id" TEXT NOT NULL,
    "status" "chat_room_status" NOT NULL DEFAULT 'new',
    "last_message" TEXT,
    "last_message_at" TIMESTAMPTZ(6),
    "student_unread_count" INTEGER NOT NULL DEFAULT 0,
    "trainer_unread_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "chat_rooms_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "messages" ("id" TEXT NOT NULL, "room_id" TEXT NOT NULL, "sender_user_id" TEXT, "sender_role" "message_sender_role" NOT NULL, "body" TEXT NOT NULL, "read_at" TIMESTAMPTZ(6), "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "messages_pkey" PRIMARY KEY ("id"));
CREATE TABLE "banners" ("id" TEXT NOT NULL, "title" VARCHAR(100) NOT NULL, "image_url" TEXT, "bg_color" VARCHAR(20), "link_url" TEXT, "status" "banner_status" NOT NULL DEFAULT 'published', "sort_order" INTEGER NOT NULL DEFAULT 0, "starts_at" TIMESTAMPTZ(6), "ends_at" TIMESTAMPTZ(6), "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMPTZ(6) NOT NULL, CONSTRAINT "banners_pkey" PRIMARY KEY ("id"));
CREATE TABLE "user_daily_dismissals" ("user_id" TEXT NOT NULL, "key" VARCHAR(80) NOT NULL, "dismissed_date" DATE NOT NULL, "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "user_daily_dismissals_pkey" PRIMARY KEY ("user_id","key","dismissed_date"));

-- Indexes
CREATE UNIQUE INDEX "users_login_id_key" ON "users"("login_id");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
CREATE UNIQUE INDEX "genres_name_key" ON "genres"("name");
CREATE UNIQUE INDEX "lesson_goals_name_key" ON "lesson_goals"("name");
CREATE UNIQUE INDEX "facilities_name_key" ON "facilities"("name");
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");
CREATE UNIQUE INDEX "districts_name_key" ON "districts"("name");
CREATE UNIQUE INDEX "neighborhoods_district_id_name_key" ON "neighborhoods"("district_id", "name");
CREATE UNIQUE INDEX "trainer_profiles_user_id_key" ON "trainer_profiles"("user_id");
CREATE INDEX "trainer_profiles_is_published_sort_order_idx" ON "trainer_profiles"("is_published", "sort_order");
CREATE INDEX "trainer_profiles_price_monthly_idx" ON "trainer_profiles"("price_monthly");
CREATE INDEX "trainer_profiles_career_years_idx" ON "trainer_profiles"("career_years");
CREATE INDEX "reviews_trainer_id_created_at_idx" ON "reviews"("trainer_id", "created_at");
CREATE INDEX "chat_rooms_student_id_updated_at_idx" ON "chat_rooms"("student_id", "updated_at");
CREATE UNIQUE INDEX "chat_rooms_student_id_trainer_id_key" ON "chat_rooms"("student_id", "trainer_id");
CREATE INDEX "messages_room_id_created_at_idx" ON "messages"("room_id", "created_at");
CREATE INDEX "banners_status_sort_order_idx" ON "banners"("status", "sort_order");

-- Foreign keys
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_neighborhood_id_fkey" FOREIGN KEY ("neighborhood_id") REFERENCES "neighborhoods"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_lesson_goal_id_fkey" FOREIGN KEY ("lesson_goal_id") REFERENCES "lesson_goals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "neighborhoods" ADD CONSTRAINT "neighborhoods_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trainer_profiles" ADD CONSTRAINT "trainer_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "trainer_profiles" ADD CONSTRAINT "trainer_profiles_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "trainer_profiles" ADD CONSTRAINT "trainer_profiles_neighborhood_id_fkey" FOREIGN KEY ("neighborhood_id") REFERENCES "neighborhoods"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "student_genres" ADD CONSTRAINT "student_genres_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "student_genres" ADD CONSTRAINT "student_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trainer_genres" ADD CONSTRAINT "trainer_genres_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trainer_genres" ADD CONSTRAINT "trainer_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trainer_goals" ADD CONSTRAINT "trainer_goals_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trainer_goals" ADD CONSTRAINT "trainer_goals_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "lesson_goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trainer_tags" ADD CONSTRAINT "trainer_tags_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trainer_tags" ADD CONSTRAINT "trainer_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trainer_facilities" ADD CONSTRAINT "trainer_facilities_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trainer_facilities" ADD CONSTRAINT "trainer_facilities_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trainer_recommended_for" ADD CONSTRAINT "trainer_recommended_for_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trainer_educations" ADD CONSTRAINT "trainer_educations_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trainer_careers" ADD CONSTRAINT "trainer_careers_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trainer_works" ADD CONSTRAINT "trainer_works_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trainer_media" ADD CONSTRAINT "trainer_media_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "review_reactions" ADD CONSTRAINT "review_reactions_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "review_reactions" ADD CONSTRAINT "review_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "messages" ADD CONSTRAINT "messages_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "user_daily_dismissals" ADD CONSTRAINT "user_daily_dismissals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
