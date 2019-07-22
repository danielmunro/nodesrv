import {MigrationInterface, QueryRunner, TableColumn} from "typeorm"

export class playerMobTitle1563763130318 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.addColumn("player_mob_entity", new TableColumn({
        default: "'the acolyte'",
        name: "title",
        type: "text",
      }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query("ALTER TABLE player_mob_entity DROP COLUMN title")
    }
}
