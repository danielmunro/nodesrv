import {MigrationInterface, QueryRunner} from "typeorm";

export class addAliasesToPlayerMob1566069861449 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "player_mob_entity" ADD "aliases" json NOT NULL DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "player_mob_entity" DROP COLUMN "aliases"`);
    }

}
