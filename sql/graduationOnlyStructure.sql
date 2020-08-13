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

 Date: 24/05/2020 03:22:31
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
  `mainTeacher` int(11) DEFAULT NULL COMMENT '班主任',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COMMENT='班级表';

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
  `coverImage` varchar(255) DEFAULT NULL COMMENT '课程首图',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COMMENT='课程表';

-- ----------------------------
-- Table structure for examination
-- ----------------------------
DROP TABLE IF EXISTS `examination`;
CREATE TABLE `examination` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createBy` int(11) NOT NULL,
  `createTime` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `testPaper` int(11) NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `classId` int(11) NOT NULL,
  `curriculumId` int(11) NOT NULL,
  `testTime` int(11) NOT NULL COMMENT '考试时长',
  `isEnd` int(11) DEFAULT NULL COMMENT '考试是否结束',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COMMENT='考试表';

-- ----------------------------
-- Table structure for question
-- ----------------------------
DROP TABLE IF EXISTS `question`;
CREATE TABLE `question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` int(11) NOT NULL,
  `answerTrue` json NOT NULL,
  `curriculumId` int(11) NOT NULL,
  `createBy` int(11) NOT NULL,
  `createTime` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `difficulty` int(11) NOT NULL,
  `imgUrl` varchar(255) DEFAULT NULL,
  `answerJson` json NOT NULL,
  `questionJson` json NOT NULL,
  `isTest` int(11) NOT NULL,
  `questionTitle` longtext CHARACTER SET utf8 COLLATE utf8_general_ci,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1133 DEFAULT CHARSET=utf8 COMMENT='题目表';

-- ----------------------------
-- Table structure for student
-- ----------------------------
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(255) NOT NULL,
  `createBy` int(10) NOT NULL,
  `createTime` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `classId` int(11) DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `sex` int(11) NOT NULL COMMENT '性别',
  `identity` int(11) NOT NULL DEFAULT '3',
  `createIdentity` int(11) NOT NULL COMMENT '创建者身份',
  `headPortraitUrl` varchar(255) DEFAULT NULL COMMENT '头像url',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COMMENT='学生账号表';

-- ----------------------------
-- Table structure for studentResult
-- ----------------------------
DROP TABLE IF EXISTS `studentResult`;
CREATE TABLE `studentResult` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `studentId` int(11) NOT NULL,
  `examinationId` int(11) NOT NULL,
  `answerJson` json DEFAULT NULL,
  `result` json DEFAULT NULL,
  `startTime` datetime NOT NULL,
  `isEnd` int(255) NOT NULL,
  `questionJson` json NOT NULL,
  `endTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COMMENT='学生成绩/试卷生成表';

-- ----------------------------
-- Table structure for TCCrelation
-- ----------------------------
DROP TABLE IF EXISTS `TCCrelation`;
CREATE TABLE `TCCrelation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teacherId` int(11) DEFAULT NULL COMMENT '教师id',
  `classId` int(11) NOT NULL COMMENT '班级id',
  `curriculumId` int(11) NOT NULL COMMENT '课程id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COMMENT='教师，课程，班级，考试关联表';

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
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8 COMMENT='教师账号表';

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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COMMENT='试卷表';

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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

SET FOREIGN_KEY_CHECKS = 1;
