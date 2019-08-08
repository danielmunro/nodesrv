import {MigrationInterface, QueryRunner} from "typeorm"

export class mobEntityAddAllowFollow1565267437118 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "mob_entity" ADD "allowFollow" boolean NOT NULL DEFAULT 1`)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "mob_entity" DROP COLUMN "allowFollow" DEFAULT 1`)
    }

}
