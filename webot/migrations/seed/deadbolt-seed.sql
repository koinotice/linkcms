-- Adminer 4.7.1 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

CREATE DATABASE `DEADBOLT_DB_NAME` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `DEADBOLT_DB_NAME`;

CREATE TABLE `authPassword` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `resetToken` varchar(36) DEFAULT NULL,
  `resetTokenExpires` int DEFAULT NULL,
  `created` int NOT NULL,
  `updated` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `authPassword_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `authPassword` (`id`, `userId`, `passwordHash`, `resetToken`, `resetTokenExpires`, `created`, `updated`) VALUES
(1,	1,	'plain:pineapples',	NULL,	NULL,	1565550000,	1565550000);

CREATE TABLE `membership` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created` int NOT NULL,
  `app` varchar(100) NOT NULL,
  `role` varchar(100) NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `membership_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `membership` (`id`, `created`, `app`, `role`, `userId`) VALUES
(1,	1565516907,	'test-app',	'admin',	1);

CREATE TABLE `session` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(32) NOT NULL,
  `userId` int NOT NULL,
  `created` int NOT NULL,
  `expires` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `session_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `firstName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL,
  `active` tinyint NOT NULL DEFAULT '1',
  `created` int NOT NULL DEFAULT '0',
  `lastActivity` int NOT NULL DEFAULT '0',
  `emailConfirmed` int DEFAULT NULL,
  `emailConfirmToken` varchar(36) DEFAULT NULL,
  `emailConfirmTokenExpires` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `user` (`id`, `uuid`, `username`, `email`, `firstName`, `lastName`, `active`, `created`, `lastActivity`, `emailConfirmed`, `emailConfirmToken`, `emailConfirmTokenExpires`) VALUES
(1,	'ee13624b-cf22-4597-adb9-bfa4b16baa71',	'admin',	NULL,	NULL,	NULL,	1,	0,	0,	1565550000,	NULL,	NULL);

-- 2020-05-17 07:41:12