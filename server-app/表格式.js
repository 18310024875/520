// 用户信息
| user  | CREATE TABLE `user` (
    `uid` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `account` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
    `password` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
    `cname` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
    `avatar` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
    `name` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
    `des` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
    `sex` smallint(6) DEFAULT NULL,
    `age` tinyint(4) DEFAULT NULL,
    `ctime` varchar(13) COLLATE utf8_unicode_ci DEFAULT NULL,
    `utime` varchar(13) COLLATE utf8_unicode_ci DEFAULT NULL,
    `discover_bg` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
    PRIMARY KEY (`uid`),
    UNIQUE KEY `account` (`account`),
    UNIQUE KEY `ctime` (`ctime`)
  ) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci


// 房间信息
| rooms | CREATE TABLE `rooms` (
  `room_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(45) DEFAULT '0',
  `room_name` varchar(30) DEFAULT NULL,
  `room_des` varchar(200) DEFAULT NULL,
  `creator_id` varchar(32) DEFAULT NULL,
  `join_ids` varchar(2000) ,
  `ctime` varchar(13) DEFAULT NULL,
  `utime` varchar(13) DEFAULT NULL,
  PRIMARY KEY (`room_id`),
  UNIQUE KEY `ctime` (`ctime`)
  UNIQUE KEY `join_ids` (`join_ids`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8 |


// 对话信息
| talk  | CREATE TABLE `talk` (
  `talk_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `talk_content` text,
  `talk_fid` varchar(2000) DEFAULT NULL,
  `room_id` varchar(13) DEFAULT NULL,
  `creator_id` varchar(32) DEFAULT NULL,
  `ctime` varchar(13) DEFAULT NULL,
  `utime` varchar(13) DEFAULT NULL,
  PRIMARY KEY (`talk_id`),
  UNIQUE KEY `ctime` (`ctime`)
) ENGINE=InnoDB AUTO_INCREMENT=147 DEFAULT CHARSET=utf8 |


// 文件信息 ;
| files | CREATE TABLE `files` (
  `fid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `size` int(10) DEFAULT NULL,
  `indexname` varchar(500) NOT NULL,
  `originname` varchar(500) NOT NULL,
  `serverUrl` varchar(1000) DEFAULT NULL,
  `creator_id` varchar(32) DEFAULT NULL,
  `ctime` varchar(13) DEFAULT NULL,
  `utime` varchar(13) DEFAULT NULL,
  PRIMARY KEY (`fid`),
  UNIQUE KEY `ctime` (`ctime`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 |







