CREATE DATABASE  IF NOT EXISTS `employee_tracker`;
USE `employee_tracker`;

DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(30) DEFAULT NULL
);

DROP TABLE if exists `roles`;
CREATE TABLE `roles`(
	`id` INT AUTO_INCREMENT PRIMARY KEY,
	`title` VARCHAR (35),
    `salary` DECIMAL(4,2) DEFAULT '0.00',
    `department_id` INT DEFAULT NULL,
    FOREIGN KEY (departments_id) REFERENCES departments(id)
    ON DELETE CASCADE
);

DROP TABLE if exists `employees`;
CREATE TABLE `employees`(
    `id` INT AUTO_INCREMENT PRIMARY KEY,
	`first_name` VARCHAR (35),
    `last_name` VARCHAR(500) NOT NULL,	
    `role_id` INT DEFAULT "",
    `manager_id` INT DEFAULT NULL,
    FOREIGN KEY (roles_id) REFERENCES roles(id)
    ON DELETE CASCADE
);
