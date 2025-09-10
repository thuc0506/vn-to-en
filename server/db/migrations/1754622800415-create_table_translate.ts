import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableTranslate1754622800415 implements MigrationInterface {
    name = 'CreateTableTranslate1754622800415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "translate_lesson" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "level" character varying NOT NULL, "number_of_question" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "lessonId" integer, CONSTRAINT "REL_2c8c2d0feb7df38effb3195ec4" UNIQUE ("lessonId"), CONSTRAINT "PK_729e4b254494e5ba5f13a788e1f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "translate_lesson" ADD CONSTRAINT "FK_2c8c2d0feb7df38effb3195ec4c" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "translate_lesson" DROP CONSTRAINT "FK_2c8c2d0feb7df38effb3195ec4c"`);
        await queryRunner.query(`DROP TABLE "translate_lesson"`);
    }

}
