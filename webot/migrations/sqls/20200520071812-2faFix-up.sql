DELETE FROM `emailTwoFactor`;

ALTER TABLE `emailTwoFactor`
ADD `userToken` varchar(36) COLLATE 'utf8mb4_general_ci' NOT NULL AFTER `token`,
ADD `attempt` int NOT NULL;

CREATE TABLE `totpToken` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `totpTwoFactorId` int NOT NULL,
  `attempt` int NOT NULL,
  `userToken` varchar(36) NOT NULL,
  `expires` int NOT NULL,
  `used` tinyint(4) NOT NULL,
  FOREIGN KEY (`totpTwoFactorId`) REFERENCES `totpTwoFactor` (`id`) ON DELETE CASCADE 
);