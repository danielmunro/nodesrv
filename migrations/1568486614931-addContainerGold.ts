import {MigrationInterface, QueryRunner} from "typeorm";

export class addContainerGold1568486614931 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "container_entity" ADD "gold" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "container_entity" ALTER COLUMN "weightCapacity" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "container_entity" ALTER COLUMN "itemCapacity" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "container_entity" ALTER COLUMN "maxWeightForItem" SET DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "container_entity" ALTER COLUMN "maxWeightForItem" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "container_entity" ALTER COLUMN "itemCapacity" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "container_entity" ALTER COLUMN "weightCapacity" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "container_entity" DROP COLUMN "gold"`);
    }

}
