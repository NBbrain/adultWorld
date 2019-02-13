CREATE TABLE IF NOT EXISTS `user` (
`user_id` int UNSIGNED PRIMARY KEY UNIQUE NOT NULL COMMENT '用户ID, 主键',
`user_name` char(30) NOT NULL COMMENT '用户名',
`user_sex` enum('male', 'female') NOT NULL DEFAULT 'male' COMMENT '性别',
`user_age` tinyint UNSIGNED NOT NULL DEFAULT 30 COMMENT '年龄',
`user_password` char(100) NOT NULL COMMENT '密码',
`user_avator_url` char(100) NOT NULL DEFAULT '' COMMENT '头像路径',
`create_time` datetime NOT NULL COMMENT '创建时间',
`user_saved_num` int NOT NULL DEFAULT 0 COMMENT '用户收藏note数'
) ENGINE = innodb default CHARSET = 'utf8' auto_increment=1;

CREATE TABLE IF NOT EXISTS note (
`note_id` int UNSIGNED PRIMARY KEY UNIQUE NOT NULL COMMENT '主键',
`user_id` int UNSIGNED NOT NULL COMMENT '创建note的用户ID',
`note_description` varchar(1000) NOT NULL COMMENT 'note描述',
`note_create_time` datetime NOT NULL COMMENT '创建时间',
`note_delete_time` datetime COMMENT '删除时间',
`note_resource_url` char(100) NOT NULL DEFAULT '' COMMENT '资源路径',
`note_be_saved_num` int UNSIGNED NOT NULL DEFAULT 0 COMMENT 'note被收藏的次数',
`note_be_loved_num` int UNSIGNED NOT NULL DEFAULT 0 COMMENT 'note被赞的次数',
`note_type` int UNSIGNED NOT NULL DEFAULT 0 COMMENT 'note的类型',
`note_tag` char(50) COMMENT '为note添加的标签',
	FOREIGN KEY (user_id) REFERENCES user (user_id)
) ENGINE = innodb default CHARSET = 'utf8';

CREATE TABLE IF NOT EXISTS saved (
`user_id` int UNSIGNED NOT NULL COMMENT '收藏者id',
`saved_id` int UNSIGNED PRIMARY KEY UNIQUE NOT NULL COMMENT '收藏note的id',
	FOREIGN KEY (user_id) REFERENCES user (user_id)
) ENGINE = innodb default CHARSET = 'utf8';


SET foreign_key_checks = 0;
ALTER TABLE `saved` MODIFY COLUMN cloumn `saved_id` AUTO_INCREMENT;
SET foreign_key_checks = 1;
