import {MigrationInterface, QueryRunner} from "typeorm";

export class fixUserDetails1616012121364 implements MigrationInterface {
    name = 'fixUserDetails1616012121364'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` ADD `detail_id` int NOT NULL");
        await queryRunner.query("ALTER TABLE `users` ADD UNIQUE INDEX `IDX_9fc134ca20766e165ad650ee74` (`detail_id`)");
        await queryRunner.query("CREATE UNIQUE INDEX `REL_9fc134ca20766e165ad650ee74` ON `users` (`detail_id`)");
        await queryRunner.query("ALTER TABLE `users` ADD CONSTRAINT `FK_9fc134ca20766e165ad650ee740` FOREIGN KEY (`detail_id`) REFERENCES `user_details`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` DROP FOREIGN KEY `FK_9fc134ca20766e165ad650ee740`");
        await queryRunner.query("DROP INDEX `REL_9fc134ca20766e165ad650ee74` ON `users`");
        await queryRunner.query("ALTER TABLE `users` DROP INDEX `IDX_9fc134ca20766e165ad650ee74`");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `detail_id`");
    }

}
