/*
 Navicat Premium Data Transfer

 Source Server         : wkysql
 Source Server Type    : MySQL
 Source Server Version : 80018
 Source Host           : localhost:3306
 Source Schema         : graduation

 Target Server Type    : MySQL
 Target Server Version : 80018
 File Encoding         : 65001

 Date: 08/03/2020 17:18:19
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for classes
-- ----------------------------
DROP TABLE IF EXISTS `classes`;
CREATE TABLE `classes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `className` varchar(255) NOT NULL,
  `createTime` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `createBy` int(11) NOT NULL,
  `startTime` datetime DEFAULT NULL COMMENT '开学时间',
  `graduationTime` datetime DEFAULT NULL COMMENT '毕业时间',
  `mainTeacher` varchar(255) DEFAULT NULL COMMENT '班主任',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='班级表';

-- ----------------------------
-- Table structure for curriculum
-- ----------------------------
DROP TABLE IF EXISTS `curriculum`;
CREATE TABLE `curriculum` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `introduce` varchar(255) DEFAULT NULL,
  `createBy` int(11) NOT NULL,
  `createTime` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='课程表';

-- ----------------------------
-- Table structure for examination
-- ----------------------------
DROP TABLE IF EXISTS `examination`;
CREATE TABLE `examination` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `include` varchar(255) DEFAULT NULL,
  `createBy` int(11) NOT NULL,
  `createTime` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `maxTime` time NOT NULL,
  `startTime` datetime NOT NULL,
  `questionJson` json NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='考试表';

-- ----------------------------
-- Table structure for question
-- ----------------------------
DROP TABLE IF EXISTS `question`;
CREATE TABLE `question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` int(11) NOT NULL,
  `ansewerTrue` varchar(255) NOT NULL,
  `curriculumId` int(11) NOT NULL,
  `createBy` varchar(255) NOT NULL,
  `createTime` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `difficulty` varchar(255) NOT NULL,
  `imgUrl` varchar(255) DEFAULT NULL,
  `answerJson` json NOT NULL,
  `quetionJson` json NOT NULL,
  `isTest` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='题目表';

-- ----------------------------
-- Records of question
-- ----------------------------
BEGIN;
INSERT INTO `question` VALUES (1, 1, 'A', 1, '1', '2020-01-15 16:19:34', '1', NULL, '[{\"question\": 1}]', '1', 0);
COMMIT;

-- ----------------------------
-- Table structure for student
-- ----------------------------
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createBy` int(10) NOT NULL,
  `createTime` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `classId` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `gender` int(11) NOT NULL,
  `identity` int(11) NOT NULL DEFAULT '3',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='学生账号表';

-- ----------------------------
-- Table structure for studentResult
-- ----------------------------
DROP TABLE IF EXISTS `studentResult`;
CREATE TABLE `studentResult` (
  `id` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `examinationId` int(11) NOT NULL,
  `questionJson` json NOT NULL,
  `answerJson` json DEFAULT NULL,
  `result` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='学生成绩/试卷生成表';

-- ----------------------------
-- Table structure for TCCrelation
-- ----------------------------
DROP TABLE IF EXISTS `TCCrelation`;
CREATE TABLE `TCCrelation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teacherId` int(11) NOT NULL COMMENT '教师id',
  `classId` int(11) NOT NULL COMMENT '班级id',
  `curriculumId` int(11) NOT NULL COMMENT '课程id',
  `examinationId` int(11) DEFAULT NULL COMMENT '考试id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='教师，课程，班级，考试关联表';

-- ----------------------------
-- Table structure for teacher
-- ----------------------------
DROP TABLE IF EXISTS `teacher`;
CREATE TABLE `teacher` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createBy` int(11) NOT NULL,
  `createTime` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `identity` int(11) NOT NULL DEFAULT '2',
  `account` varchar(255) NOT NULL,
  `sex` int(2) NOT NULL,
  `headPortraitUrl` varchar(255) DEFAULT NULL COMMENT '头像URL',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8 COMMENT='教师账号表';

-- ----------------------------
-- Records of teacher
-- ----------------------------
BEGIN;
INSERT INTO `teacher` VALUES (1, 'wky', '123456', 2, '2020-02-07 17:53:40', 2, 'wukaoyu2', 1, NULL);
INSERT INTO `teacher` VALUES (2, '鱼哥', '1234567', 2, '2020-02-07 17:35:05', 2, 'suixing1', 1, NULL);
INSERT INTO `teacher` VALUES (3, '测试姓名', '123456', 2, '2020-02-07 16:09:00', 2, 'ceszhanghao', 1, NULL);
INSERT INTO `teacher` VALUES (48, 'wukaoyu2', '123456', 2, '2020-02-16 18:05:08', 2, 'wukaoyu2', 1, NULL);
INSERT INTO `teacher` VALUES (49, 'wukaoyu3', '123456', 2, '2020-02-16 18:05:08', 2, 'wukaoyu3', 1, NULL);
INSERT INTO `teacher` VALUES (71, 'wukaoyu1', '123456', 2, '2020-02-23 17:47:44', 2, 'wukaoyu1', 1, NULL);
COMMIT;

-- ----------------------------
-- Table structure for testPaper
-- ----------------------------
DROP TABLE IF EXISTS `testPaper`;
CREATE TABLE `testPaper` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createBy` int(11) NOT NULL,
  `createTime` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `fullMarks` int(11) NOT NULL,
  `rules` json NOT NULL,
  `curriculumId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='试卷表';

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `account` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `createBy` int(11) NOT NULL,
  `createTime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `identity` int(11) NOT NULL DEFAULT '1',
  `createName` varchar(255) NOT NULL,
  `sex` int(10) NOT NULL,
  `headPortraitUrl` varchar(255) DEFAULT NULL COMMENT '头像URL',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COMMENT='管理员账号表';

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES (2, 'wukaoyu', '123456', 'wky', 2, '2020-02-18 15:54:22', 1, 'wky', 1, NULL);
INSERT INTO `users` VALUES (3, 'suixing', '123456', '鱼哥', 2, '2020-02-18 17:32:49', 1, 'wky', 1, NULL);
INSERT INTO `users` VALUES (4, 'xiaoxingzang', '123456', '小心脏', 3, '2020-02-18 17:28:10', 1, '鱼哥', 1, NULL);
INSERT INTO `users` VALUES (5, 'wukaoyu1', '123456', 'wukaoyu1', 2, '2020-02-23 17:53:28', 1, 'wky', 1, NULL);
INSERT INTO `users` VALUES (10, 'wukaoyu2', '123456', 'wukaoyu2', 2, '2020-02-23 17:55:58', 1, 'wky', 1, NULL);
INSERT INTO `users` VALUES (11, 'wukaoyu3', '123456', 'wukaoyu3', 2, '2020-02-23 17:57:02', 1, 'wky', 1, NULL);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
