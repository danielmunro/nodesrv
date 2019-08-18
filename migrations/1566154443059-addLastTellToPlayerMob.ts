import {MigrationInterface, QueryRunner} from "typeorm";

export class addLastTellToPlayerMob1566154443059 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "player_mob_entity" ADD "aliases" json NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "player_mob_entity" ADD "lastTellId" integer`);
        await queryRunner.query(`ALTER TABLE "player_mob_entity" ADD CONSTRAINT "UQ_db11aa331cb00fd6ee1845c52d5" UNIQUE ("lastTellId")`);
        await queryRunner.query(`ALTER TABLE "player_mob_entity" ADD CONSTRAINT "FK_db11aa331cb00fd6ee1845c52d5" FOREIGN KEY ("lastTellId") REFERENCES "mob_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "player_mob_entity" DROP CONSTRAINT "FK_db11aa331cb00fd6ee1845c52d5"`);
        await queryRunner.query(`ALTER TABLE "player_mob_entity" DROP CONSTRAINT "UQ_db11aa331cb00fd6ee1845c52d5"`);
        await queryRunner.query(`ALTER TABLE "player_mob_entity" DROP COLUMN "lastTellId"`);
        await queryRunner.query(`ALTER TABLE "player_mob_entity" DROP COLUMN "aliases"`);
    }

}
