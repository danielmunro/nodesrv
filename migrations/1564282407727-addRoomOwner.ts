import {MigrationInterface, QueryRunner} from "typeorm";

export class addRoomOwner1564282407727 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "room_entity" ADD "isOwnable" boolean NOT NULL`)
        await queryRunner.query(`ALTER TABLE "room_entity" ADD "ownerId" integer`)
        await queryRunner.query(`ALTER TABLE "room_entity" ADD CONSTRAINT "FK_be2379b8bfd927bf7b513b78dee" FOREIGN KEY ("ownerId") REFERENCES "mob_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "room_entity" DROP CONSTRAINT "FK_be2379b8bfd927bf7b513b78dee"`)
        await queryRunner.query(`ALTER TABLE "room_entity" DROP COLUMN "ownerId"`)
        await queryRunner.query(`ALTER TABLE "room_entity" DROP COLUMN "isOwnable"`)
    }

}
