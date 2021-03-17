import {MigrationInterface, QueryRunner} from "typeorm";

export class fixDate1616015143548 implements MigrationInterface {
    name = 'fixDate1616015143548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_9fc134ca20766e165ad650ee74` ON `users`");
        await queryRunner.query("ALTER TABLE `user_details` CHANGE `created_at` `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `user_details` CHANGE `updated_at` `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `users` CHANGE `created_at` `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `users` CHANGE `updated_at` `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `roles` CHANGE `created_at` `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `roles` CHANGE `updated_at` `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `roles` CHANGE `updated_at` `updated_at` timestamp(0) NOT NULL");
        await queryRunner.query("ALTER TABLE `roles` CHANGE `created_at` `created_at` timestamp(0) NOT NULL");
        await queryRunner.query("ALTER TABLE `users` CHANGE `updated_at` `updated_at` timestamp(0) NOT NULL");
        await queryRunner.query("ALTER TABLE `users` CHANGE `created_at` `created_at` timestamp(0) NOT NULL");
        await queryRunner.query("ALTER TABLE `user_details` CHANGE `updated_at` `updated_at` timestamp(0) NOT NULL");
        await queryRunner.query("ALTER TABLE `user_details` CHANGE `created_at` `created_at` timestamp(0) NOT NULL");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_9fc134ca20766e165ad650ee74` ON `users` (`detail_id`)");
    }

}
