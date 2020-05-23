ALTER TABLE `user`
ADD `twoFactor` varchar(100) NULL;

CREATE TABLE `emailTwoFactor` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `token` varchar(100) NOT NULL,
  `expires` int NOT NULL,
  `used` tinyint NOT NULL DEFAULT 0,
  FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) COLLATE 'utf8mb4_general_ci';

CREATE TABLE `totpTwoFactor` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `secret` varchar(255) NOT NULL,
  FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) COLLATE 'utf8mb4_general_ci';