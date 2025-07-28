import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSection1753693290998 implements MigrationInterface {
    name = 'UpdateSection1753693290998'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "section" DROP COLUMN "slug"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "section" ADD "slug" character varying NOT NULL`);
    }

}
