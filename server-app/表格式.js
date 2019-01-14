// 用户信息
| user  | CREATE TABLE `user` (
  `uid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `account` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `cname` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `avatar` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `discover_bg` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `name` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `des` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sex` tinyint(1) DEFAULT NULL,
  `age` tinyint(4) DEFAULT NULL,
  `ctime` timestamp NOT NULL DEFAULT current_timestamp(),
  `utime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`uid`),
  UNIQUE KEY `account` (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci |

// 用户的所有朋友 ;
| user_friends | CREATE TABLE `user_friends` (
  `id` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `creator_id` int(10) unsigned NOT NULL,
  `accept_id` int(10) unsigned NOT NULL,
  `agree` int(1) DEFAULT 0,
  `ctime` timestamp NOT NULL DEFAULT current_timestamp(),
  `utime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `creator_id` (`creator_id`),
  KEY `accept_id` (`accept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci |


// 房间信息
| room  | CREATE TABLE `room` (
  `room_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `connect_friends` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `creator_id` int(10) unsigned NOT NULL,
  `room_name` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `room_des` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ctime` timestamp NOT NULL DEFAULT current_timestamp(),
  `utime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`room_id`),
  KEY `connect_friends` (`connect_friends`),
  KEY `creator_id` (`creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci |


// 房间的人员 ;
| room_users | CREATE TABLE `room_users` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `room_id` int(10) unsigned NOT NULL,
    `uid` int(10) unsigned NOT NULL,
    `show` tinyint(1) DEFAULT '1',
    `ctime` timestamp NOT NULL DEFAULT current_timestamp(),
    `utime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    KEY `room_id` (`room_id`),
    KEY `uid` (`uid`)
  ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci |


// 对话信息
| talk  | CREATE TABLE `talk` (
  `talk_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `room_id` int(10) DEFAULT NULL,
  `creator_id` int(10) unsigned NOT NULL,
  `talk_fid` int(10) unsigned DEFAULT NULL,
  `talk_content` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `ctime` timestamp NOT NULL DEFAULT current_timestamp(),
  `utime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`talk_id`),
  KEY `room_id` (`room_id`),
  KEY `creator_id` (`creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci |


// 评论
| reply | CREATE TABLE `reply` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pid` int(10) unsigned DEFAULT NULL,
  `accept_id` int(10) unsigned DEFAULT NULL,
  `creator_id` int(10) unsigned DEFAULT NULL,
  `fids` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `text` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `ctime` timestamp NOT NULL DEFAULT current_timestamp(),
  `utime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `pid` (`pid`),
  KEY `accept_id` (`accept_id`),
  KEY `creator_id` (`creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci |
// 评论未读
| reply_read | CREATE TABLE `reply_read` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `reply_id` int(10) unsigned NOT NULL,
  `accept_id` int(10) unsigned NOT NULL,
  `readed` int(10) DEFAULT 0,
  `ctime` timestamp NOT NULL DEFAULT current_timestamp(),
  `utime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `reply_id` (`reply_id`),
  KEY `accept_id` (`accept_id`),
  KEY `readed` (`readed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci |


// 文件信息 ;
| file  | CREATE TABLE `file` (
  `fid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `creator_id` int(10) unsigned NOT NULL,
  `size` int(10) NOT NULL,
  `indexname` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `originname` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `serverUrl` varchar(1000) COLLATE utf8_unicode_ci NOT NULL,
  `ctime` timestamp NOT NULL DEFAULT current_timestamp(),
  `utime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`fid`),
  KEY `creator_id` (`creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci |







