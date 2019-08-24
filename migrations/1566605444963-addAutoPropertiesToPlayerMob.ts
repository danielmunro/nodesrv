import {MigrationInterface, QueryRunner} from "typeorm";

export class addAutoPropertiesToPlayerMob1566605444963 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "player_mob_entity" ADD "autoAssist" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "player_mob_entity" ADD "autoExit" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "player_mob_entity" ADD "autoList" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "player_mob_entity" ADD "autoLoot" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "player_mob_entity" ADD "autoSac" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "player_mob_entity" ADD "autoSplit" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "player_mob_entity" DROP COLUMN "autoSplit"`);
        await queryRunner.query(`ALTER TABLE "player_mob_entity" DROP COLUMN "autoSac"`);
        await queryRunner.query(`ALTER TABLE "player_mob_entity" DROP COLUMN "autoLoot"`);
        await queryRunner.query(`ALTER TABLE "player_mob_entity" DROP COLUMN "autoList"`);
        await queryRunner.query(`ALTER TABLE "player_mob_entity" DROP COLUMN "autoExit"`);
        await queryRunner.query(`ALTER TABLE "player_mob_entity" DROP COLUMN "autoAssist"`);
    }
}
