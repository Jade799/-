
DROP DATABASE IF EXISTS polling_system;
CREATE DATABASE polling_system;

-- 2. 进入这个新房间
USE polling_system;

-- 3. 创建一张干净的表
CREATE TABLE official_enterprises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255) NOT NULL
);

-- 4. 插入测试数据（这次我们用 Pledis 的数据）
INSERT INTO official_enterprises (company_name, legal_name) 
VALUES ('Pledis', '尹净汉');