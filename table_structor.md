表结构
User
	user_id
  user_name
  user_sex
  user_age
  user_password
  user_avator_url
  user_saved[] 收藏的动态id


Note
  note_id
  note_description
  note_create_time
  note_delete_time
  note_resource_url
  note_be_saved_num 被收藏数
  note_be_loved_num 被赞次数
  note_type // 笔记的分类
  note_tag

## 常用操作

Link preload

bash mysql.server start
Mysql -uroot

表：
Show tables;
Create table Tname (fieldName type description , fieldName…)
Insert into tableName ([fieldName, …]) values (v1,…)
Drop table Tname
Delete from Tname 。。。
Alter table tableName rename newTableName


修改表结构：
alter table tableName add fieldName  type after fieldName

alter table tableName change newFieldName NewType

Alter table tableName drop fieldName




通过文件创建：
mysql -D databaseName -u userName -p < createtable.sql

字段描述的关键字：
not null, auto_increment, primary key,

常用常量：
NULL

查询：
Select fieldName, …   from tableName where 运算

更新：
update tableName set  fieldName = v  where 运算

删除：
delete from tableName where 运算

数据库：
查：show databases
建：create database name 。。。
用：use databaseName
Drop database databaseName

用户：
create user ‘username’@‘ip’ by ‘password’
Drop user username
set password for’username’ = Password(‘new’)

权限
show grants for ‘username’

远程数据库服务器：
mysql  - D 所选择数据库名  -h 主机名 -u 用户名 -p 密码

1. 数字类型
整数: tinyint、smallint、mediumint、int、bigint
浮点数: float、double、real、decimal
2. 日期和时间: date、time、datetime、timestamp、year
3. 字符串类型
字符串: char、varchar
文本: tinytext、text、mediumtext、longtext
二进制(可用来存储图片、音乐等): tinyblob、blob、mediumblob、longblob


## 变量

- 用户变量(会话变量)，声明：SET @标识符 = v；
  1. 在查询中使用：select @标识符
  2. 在查询语句中进行赋值：select @标识符 := max(age) from student
  3. selct @@标识符

- 查看所有系统变量
  - show variables;

- 修改变量： set variable_name = new_name  , global关键字为永久修改

## 帐户

- 账户分类
  1. 数据表级别账户
  2. 字段级别账户
  3. 存储程序级别账户

- 创建账户
  1. create user user_name [identified by 'password']
  2. drop user 'username'@'hostname'
  3. 更新密码：set password for 'username' = password('password') 或 = ‘password’
  4. 更新密码：update user set password = password('password') where user="username"
  5. delete from mysql.user where user="username"


- 权限
  1. 权限分为：ALL PRIVILEGES、CREATE、ALTER、INSERT、UPDATE、DELETE、SELECT
  2. 创建用户并设置权限：grant 权限值, ... on 数据库名. to 'username'@'hostname' [identified by 'password']
  3. 对账户进行权限增加：grant 权限值, ... on 数据库名. to username1, username2... with grant option
  4. 查看用户权限：show grants for username
  5. 刷新权限：flush privileges
  6. 回收权限：revoke privilege 权限值, ... on 数据库名 from 'username'@'hostname'

```sql
# % 表示任意主机，.表示数据库中所有都授权
GRANT ALL PRIVILEGES ON test.* TO 'semon'@'%' IDENTIFIED BY 'semon';
GRANT CREATE ON test.* TO demon WITH GRANT OPTION;
```

## 函数/存储过程

- 创建函数，创建后会存到表中
  1. delimiter // create function function_name(param type, ...) return return_type  下面是 begin 函数体语句; return v; end // delimiter; (语句用`;`结束)
  2. 临时变量声明：delare 变量名 变量类型 [default v]
  3. 临时变量赋值：set 变量名 = 表达式
  4. delimiter 标识符
  5. 使用：select field from databaseName where name = 'function_name';  select function_name();
  6. 删除函数：delete from database where name='function_name'
  7. 循环：while 条件 do 循环体; end while;
  8. 条件：if 条件 then 语句; end if; (判断相等是 = )

- 存储过程：是存储在数据库中的一组SQL语句，可以在查询过程中调用这个`过程名字`来执行相关SQL
  1. delimiter // create procedure procedure_name(params) 下面是 begin 过程体语句; end // delimiter;
  2. 参数类型：in 传入类型的参数， out 传出类型的参数(相当于return)，inout 既能传入又能传出
  3. 调用：call procedure_name; 或 call procedure_name(params);

## 视图：对select语句进行封装，即存储在数据库中的一个虚拟表；(复杂的查询，多处使用，想更改很麻烦)

  1. 创建：create view view_name as select XX as 'XX', ... from tableName as 's'
  2. 查看：show tables
  3. 调用：select field from view_name;
  4. 删除：drop view view_name

## 事务：解决操作集合，如转帐，包含扣钱方 和 收钱方，整个rkwtj一体的
  - 原子性：全部操作，要做全做，要不做全不做
  - 一致性：结果一致
  - 隔离性：一个事务不爱另一个事务的影响
  - 持久性：对已提交的事务，系统必须保证该事务对数据库的改变不被丢失
  - 事务提交：整个事务下的操作集全部有效
  - 事务回滚：整个事务下的操作集全部作废
