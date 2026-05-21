-- 重新建库（谨慎：会清空原有数据）
DROP DATABASE IF EXISTS polling_system;
CREATE DATABASE polling_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE polling_system;

-- 用户表
CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(100) NOT NULL UNIQUE COMMENT '账号（手机/邮箱）',
  password_hash VARCHAR(255) NOT NULL,
  nickname      VARCHAR(50)  DEFAULT '' COMMENT '昵称',
  signature     VARCHAR(200) DEFAULT '' COMMENT '个性签名',
  avatar        MEDIUMTEXT   COMMENT '头像 base64',
  bg_image      MEDIUMTEXT   COMMENT '背景图 base64',
  is_certified  TINYINT(1)   DEFAULT 0,
  company_name  VARCHAR(100) DEFAULT '',
  real_name     VARCHAR(50)  DEFAULT '',
  created_at    DATETIME     DEFAULT CURRENT_TIMESTAMP
);

-- 投票主表
CREATE TABLE polls (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  algorithm   ENUM('single','multiple','weighted','borda','scoring') NOT NULL,
  status      ENUM('pending','active','ended') DEFAULT 'active',
  end_at      DATETIME NOT NULL,
  total_votes INT      DEFAULT 0,
  creator_id  INT,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 选项表
CREATE TABLE options (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  poll_id   INT          NOT NULL,
  label     VARCHAR(100) NOT NULL,
  count_val DECIMAL(10,2) DEFAULT 0  COMMENT '票数/分数/权重',
  FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
);

-- 投票记录表（防重复投票）
CREATE TABLE votes (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  poll_id    INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_poll (user_id, poll_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (poll_id) REFERENCES polls(id)
);

-- 企业认证白名单（保留原有）
CREATE TABLE official_enterprises (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  legal_name   VARCHAR(255) NOT NULL
);

INSERT INTO official_enterprises (company_name, legal_name) VALUES ('Pledis', '尹净汉');