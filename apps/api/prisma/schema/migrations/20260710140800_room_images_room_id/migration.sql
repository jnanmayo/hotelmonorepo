-- RoomImage: replace room_type_id with room_id (images belong to individual rooms)

DELETE FROM "room_images";

ALTER TABLE "room_images" DROP CONSTRAINT IF EXISTS "room_images_room_type_id_fkey";
DROP INDEX IF EXISTS "room_images_hotel_id_room_type_id_idx";

ALTER TABLE "room_images" DROP COLUMN "room_type_id";

ALTER TABLE "room_images" ADD COLUMN "room_id" UUID NOT NULL;

CREATE INDEX "room_images_hotel_id_room_id_idx" ON "room_images"("hotel_id", "room_id");

ALTER TABLE "room_images" ADD CONSTRAINT "room_images_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
