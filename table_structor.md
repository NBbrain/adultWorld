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

## 数据库

1. 启动：bash mysql.server start
2. 用户登录：Mysql -u root
3. 连接远程数据库服务器：mysql  - D 所选择数据库名  -h 主机名 -u 用户名 -p 密码
4. 查看：show databases
5. 创建建：create database name
6. 启用：use databaseName
7. 删除：Drop database databaseName
8. 备份：mysqldump -u root -p 数据库名>url/xxx.sql
9. 恢复：mysql -u root 新数据库名<xxx.sql
10. 执行外部sql：mysql -u root -p --source xxx.sql

## 表

- 基础操作
1. 查看：Show tables;
2. 创建：Create table Tname (fieldName type description , fieldName…)
3. 插入：Insert into tableName ([fieldName, …]) values (v1,…)
4. 删除：Drop table Tname 或 Delete from Tname 。。。
5. 修改：Alter table tableName rename newTableName
6. 通过脚本文件创建表：mysql -D databaseName -u userName -p < createtable.sql
7. 创建时字段描述：类型 [长度] 索引 自增 默认值(int unsigned primary key auto_increment not null)


- 修改表结构
1. 添加字段：alter table tableName add fieldName  type after fieldName
2. 修改字段名：alter table tableName change newFieldName NewType
3. 删除字段：Alter table tableName drop fieldName

常用常量：
NULL

查询：
Select fieldName, …   from tableName where 运算

更新：
update tableName set  fieldName = v  where 运算

删除：
delete from tableName where 运算

## 数据类型

- 数字类型
  1. 整数: tinyint、smallint、mediumint、int、bigint
  2. 浮点数: float、double、real、decimal
- 日期和时间: date、time、datetime、timestamp、year
- 字符串类型
  1. 字符串: char、varchar
  2. 文本: tinytext、text、mediumtext、longtext
- 二进制(可用来存储图片、音乐等): tinyblob、blob、mediumblob、longblob
- 对类型的描述：unsigned, signed

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

## 性能

1. 开启时间监测：set profiling = 1;
2. 查看检测结果：show profiles;

## 索引：提高了查询速度，但降低更新表的速度，因更新时需要保存数据，同时保存索引文件，会占磁盘空间

1. 创建：create index 索引名称 on 表名(字段名(长度))
2. 查看：show index from 表名
3. 删除：drop index 索引名 on 表名

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
  - 脏读：一个事务将数据改变，但还未提交；此时另一个事务读取时读到的是新数据，而事务又将其回滚，此时事务再读取，发现数据又变回去了；而此前读到的变成的脏数据。(解决问题的方式：读已提交，可重复读)
  - 不可复读：事务多次查询数据，因另一事务对数据的操作，导致查询数据结果不一致。(解决问题的方式：可重复读)
  - 虚/幻读：事务读取值后对其更名，而另一事务又创建了此名称，而原事务再查询时发现未修改，产生了幻觉。(读未提交，读已提交)
  - 读已提交：一个事务在写时，禁止其他事务读写，提交后才能被读取。
  - 可重复读：一个事务在写时，禁止其他事务读写，一个事务在读取时，禁止其他事务写。
  - 串行化：每次只能执行一个事务。
  - mySQL：采用innodb为其默认引擎。insert, update, delete会触发事务；开启事务后，变更会维护到本地缓存中，而非物理表中。
  - 使用：begin; 提交事务 comit; 回滚事务 rollback;
  - 关闭默认事务提交：set [global] autocommit = 0;
