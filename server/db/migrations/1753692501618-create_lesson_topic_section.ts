import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLessonTopicSection1753692501618 implements MigrationInterface {
    name = 'CreateLessonTopicSection1753692501618'

    public async up(queryRunner: QueryRunner): Promise<void> {
        //👉 Tạo enum cho lesson.type
        await queryRunner.query(`
            CREATE TYPE "public"."lesson_type_enum" AS ENUM('video', 'audio', 'translate')
        `);

         await queryRunner.query(`
            CREATE TYPE "public"."topic_type_enum" AS ENUM('video', 'audio', 'translate')
        `);
        await queryRunner.query(`CREATE TABLE "lesson" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "type" "public"."lesson_type_enum" NOT NULL, "slug" character varying NOT NULL, "topicId" integer, "sectionId" integer, CONSTRAINT "PK_0ef25918f0237e68696dee455bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "section" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "slug" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "topicId" integer, CONSTRAINT "PK_3c41d2d699384cc5e8eac54777d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "topic" ("id" SERIAL NOT NULL, "description" text NOT NULL, "level" character varying NOT NULL, "type" "public"."topic_type_enum" NOT NULL, "slug" character varying NOT NULL, "totalLessons" integer NOT NULL DEFAULT '0', "title" character varying NOT NULL, CONSTRAINT "PK_33aa4ecb4e4f20aa0157ea7ef61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "video_lesson" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "url" character varying NOT NULL, "transcript_path" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "lessonId" integer, CONSTRAINT "REL_d69d2df7ce08206004f31df970" UNIQUE ("lessonId"), CONSTRAINT "PK_431f25302a5cafba0235aa6c55f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD CONSTRAINT "FK_d0249d483a9b7116cd9c23cd3be" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD CONSTRAINT "FK_70eb01d08acf5be68e3a17451b0" FOREIGN KEY ("sectionId") REFERENCES "section"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "section" ADD CONSTRAINT "FK_0b761928231b0509807419216f6" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "video_lesson" ADD CONSTRAINT "FK_d69d2df7ce08206004f31df970d" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video_lesson" DROP CONSTRAINT "FK_d69d2df7ce08206004f31df970d"`);
        await queryRunner.query(`ALTER TABLE "section" DROP CONSTRAINT "FK_0b761928231b0509807419216f6"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP CONSTRAINT "FK_70eb01d08acf5be68e3a17451b0"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP CONSTRAINT "FK_d0249d483a9b7116cd9c23cd3be"`);
        await queryRunner.query(`DROP TABLE "video_lesson"`);
        await queryRunner.query(`DROP TABLE "topic"`);
        await queryRunner.query(`DROP TABLE "section"`);
        await queryRunner.query(`DROP TABLE "lesson"`);
    }

}
