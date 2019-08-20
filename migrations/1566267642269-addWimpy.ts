import {MigrationInterface, QueryRunner} from "typeorm";

export class addWimpy1566267642269 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "mob_entity" ADD "wimpy" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "mob_entity" DROP COLUMN "wimpy"`);
    }

}
