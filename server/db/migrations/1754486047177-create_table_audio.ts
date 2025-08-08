import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableAudio1754486047177 implements MigrationInterface {
    name = 'CreateTableAudio1754486047177'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "audio_lesson" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "url" character varying NOT NULL, "transcript_path" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "lessonId" integer, CONSTRAINT "REL_847a04483f92bcdb588295c737" UNIQUE ("lessonId"), CONSTRAINT "PK_050ac14a11f59c9e8663fda5da4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "audio_lesson" ADD CONSTRAINT "FK_847a04483f92bcdb588295c7372" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audio_lesson" DROP CONSTRAINT "FK_847a04483f92bcdb588295c7372"`);
        await queryRunner.query(`DROP TABLE "audio_lesson"`);
    }

}
