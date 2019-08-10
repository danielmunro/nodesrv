import {MigrationInterface, QueryRunner} from "typeorm"

export class addRoomGroupName1565402278754 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "mob_entity" ADD "allowFollow" boolean NOT NULL DEFAULT true`)
        await queryRunner.query(`ALTER TABLE "room_entity" ADD "groupName" character varying`)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "room_entity" DROP COLUMN "groupName"`)
        await queryRunner.query(`ALTER TABLE "mob_entity" DROP COLUMN "allowFollow"`)
    }

}
