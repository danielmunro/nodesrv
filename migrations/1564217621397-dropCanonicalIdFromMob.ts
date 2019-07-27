import {MigrationInterface, QueryRunner} from "typeorm";

export class dropCanonicalIdFromMob1564217621397 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query("ALTER TABLE mob_entity DROP COLUMN \"importId\"")
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query("ALTER TABLE mob_entity ADD \"importId\" text null")
    }

}
