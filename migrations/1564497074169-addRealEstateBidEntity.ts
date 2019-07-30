import {MigrationInterface, QueryRunner} from "typeorm"

export class addRealEstateBidEntity1564497074169 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "real_estate_listing_entity" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "offeringPrice" double precision NOT NULL, CONSTRAINT "PK_0749b4eac0df37f001fbe723e51" PRIMARY KEY ("id"))`)
        await queryRunner.query(`CREATE TABLE "real_estate_bid_entity" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "amount" double precision NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_fe0a885204576fb608db5f8d8b2" PRIMARY KEY ("id"))`)
        await queryRunner.query(`ALTER TABLE "room_entity" ADD "isOwnable" boolean NOT NULL DEFAULT false`)
        await queryRunner.query(`ALTER TABLE "room_entity" ADD "ownerId" integer`)
        await queryRunner.query(`ALTER TABLE "room_entity" ADD CONSTRAINT "FK_be2379b8bfd927bf7b513b78dee" FOREIGN KEY ("ownerId") REFERENCES "mob_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "room_entity" DROP CONSTRAINT "FK_be2379b8bfd927bf7b513b78dee"`)
        await queryRunner.query(`ALTER TABLE "room_entity" DROP COLUMN "ownerId"`)
        await queryRunner.query(`ALTER TABLE "room_entity" DROP COLUMN "isOwnable"`)
        await queryRunner.query(`DROP TABLE "real_estate_bid_entity"`)
        await queryRunner.query(`DROP TABLE "real_estate_listing_entity"`)
    }

}
