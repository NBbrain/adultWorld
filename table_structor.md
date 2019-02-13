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
  user_id
  note_description
  note_create_time
  note_delete_time
  note_resource_url
  note_be_saved_num 被收藏数
  note_be_loved_num 被赞次数
  note_type // 笔记的分类
  note_tag

## 常用操作

1. 操作之前判断 if not exists, 如 create table if not exists user
2. 更改编码类型：CHARACTER SET  指定字符集

## 查看当前所在
1. 数据库
1. 帐户

## 数据库

1. 启动：bash mysql.server start
2. 用户登录【交互模式】：Mysql -u root -p passwd；【命令模式】：mysql -p pwd -e "查询命令或其他命令"；【批处理模式】：more xxx.sql 或 source xxx.sql 或 mysql -u xxx -p xxx < xxx.sql
3. 连接远程数据库服务器：mysql  - D 所选择数据库名  -h 主机名 -u 用户名 -p 密码
4. 查看：show databases
5. 创建建：create database name
6. 启用：use databaseName 或 \u databaseName
7. 删除：Drop database databaseName
8. 备份：mysqldump -u root -p 数据库名>url/xxx.sql
9. 恢复：mysql -u root 新数据库名<xxx.sql
10. 执行外部sql：mysql -u root -p --source xxx.sql 或 source xxx.sql

## 表

- 基础操作
1. 查看：Show tables;
2. 创建：Create table Tname (fieldName type description , fieldName…)
3. 插入：Insert into tableName ([fieldName, …]) values (v1,…)
4. 删除：Drop table Tname 或 Delete from Tname 。。。
5. 修改：Alter table tableName rename newTableName
6. 通过脚本文件创建表：mysql -D databaseName -u userName -p < createtable.sql
7. 创建时字段描述：类型[(长度)] 索引 自增 默认值(int unsigned primary key auto_increment unique not null default '')

## 修改表结构：
1. add 字段 类型；删除 drop column 字段；更名或其他描述：change old字段名 new字段名 iteger；add index 索引名 (字段名, ...)
2. 修改字段描述：alter table table_name modify column field type;
3. alter table note drop primary key; alter table note modify cloumn note_id auto_increment; alter table note add primary key(note_id);
4. 1 SELECT auto_increment FROM information_schema.tables where table_schema="dbName" and table_name="tableName";
5. alter 中使用 modify 与 change：alter table user change old_field new field integer
6. add：alter table user add new_field 描述; add primary key(field);

- 修改表结构
1. 添加字段：alter table tableName add fieldName  type after fieldName
2. 修改字段名：alter table tableName change newFieldName NewType
3. 删除字段：Alter table tableName drop fieldName
4. 创建表时与另一表有相同字段：foreign key (fieldName) references 表名 (fieldName);

## 字段
1. 查询 desc 表名

## 表数据
1. 插入：insert into tableName (fieldName,...) (values...)
2. 更新；update tableName set fieldName = v, ... where condition
3. 删除：delete from 表名 where condition


常用常量：
NULL default

查询：
Select fieldName, …   from tableName where 运算

更新：
update tableName set  fieldName = v  where 运算

删除：
delete from tableName where 运算

## 主键，外键，关联
1. 主键：标识一条记录，不可重复或空；保证数据完整性。
2. 外键：另一个表的主键，可以空或重复，建立与其他表的联系。主键值修改，关联的数据也同步更新；保证了一致性。
3. alter table 表名 add promary key 字段名/ constraint `外键名` foreign key 字段名 references 另一个表 (字段) / index (字段名)
4. 对外键关联操作的定义：on delete cascade on update cascade; 或 on delete no action on update no action;
5. 删除外键：alter table tableName drop foreign key `外键名`
6. 取消外键：set foreign_key_checks = 0;

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
- Set, Enum类型
- 修改字段类型：set foreign_key_checks = 0; alter table user modify column user_id bigint;set foreign_key_checks = 1;

## 变量

- 用户变量(会话变量)，声明：SET @标识符 = v；
  1. 在查询中使用：select @标识符
  2. 在查询语句中进行赋值：select @标识符 := max(age) from student
  3. selct @@标识符

- 查看所有系统变量
  - show variables;

- 修改变量： set variable_name = new_name  , global关键字为永久修改

## 帐户，是多用户数据库，访问mysql.user

1. 数据库mysql
2. 相关数据表：user, db, host, tables_priv, columns_priv, procs_priv...
3. user存储包含：用户信息(主机%、用户名、密码)，权限_priv，安全ssl_，资源分配max_
4. 可以select, insert, alter相关的权限表：table_priv, column_priv, procs_priv
5. 查询：select user from mysql.user
6. 创建：create user user_name[@hostname] [identified by 'password']
7. 删除：drop user 'username'@'hostname'
8. 更新密码：set password for 'username' = password('password') 或 = ‘password’ 或 update user set password = password('password') where user="username"
9. delete from mysql.user where user="username"
10. 更新密码：update mysql.user set password=password('1111') where user = 'root';
  或 修改当前用户密码 set password=password('1111');
  或set password for '用户名'@'主机名' = password=password('1111')

- 权限
  1. 权限分为：ALL PRIVILEGES、CREATE、ALTER、INSERT、UPDATE、DELETE、SELECT
  2. 创建用户并设置权限：grant 权限值, (select,insert,update,delete) on 数据库名.表 to 'username'@'hostname' [identified by 'password']
  3. 对账户进行权限增加：grant 权限值, ... on 数据库名. to username1, username2... with grant option
  4. 刷新权限：flush privileges
  5. 回收权限：revoke privilege 权限值, ... on 数据库名.表 from 'username'@'hostname'
  6. 权限有：select ,update,delete,insert(表数据)、create,alert,drop(表结构)、references(外键)、create temporary tables(创建临时表)、index(操作索引)、create view,show view(视图)、create routine,alert routine,execute(存储过程)、all,all privileges(所有权限)
  7. 查看权限：show grants 或 show grants for username@主机名称

- 如何使用：
  1. information_schema>[table]: user_privileges
  2. mysql>[table]: tables_priv / columns_priv
  3. select * from mysql.columns_priv where user='' and host=''


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
4. 普通、唯一、全文索引；主键、外键

## 关联(外键关系)
1. foreign key(user_id) references user(user_id)

## 函数/存储过程

- 创建函数，创建后会存到表中
  1. create function `function_name`(param type, ...) returns return_type  下面是 begin 函数体语句; return v; end
  2. 临时变量声明：delare 变量名 变量类型 [default v]
  3. 临时变量赋值：set 变量名 = 表达式, ...
  4. delimiter 标识符
  5. 使用：select field from databaseName where name = 'function_name';  select function_name();
  6. 删除函数：delete from database where name='function_name'
  7. 循环：while 条件 do 循环体; end while;
  8. 条件：if 条件 then 语句; end if; (判断相等是 = )
  9. 调用：select fun(params)
  10. drop function if exists fun 可加条件的删除
  11. 已提供的通用方法：

- delimiter 在命令行中，默认;回车即为结束，这时需要把结束符定义成其他符号，如$$ 或 //; 例子：1) delimiter // 2) 函数或过程体    3)  end; //

- 存储过程：是存储在数据库中的一组SQL语句，可以在查询过程中调用这个`过程名字`来执行相关SQL
  1. delimiter // create procedure procedure_name(params) 下面是 begin 过程体语句; end // delimiter;
  2. 参数类型：in 传入类型的参数， out 传出类型的参数(相当于return)，inout 既能传入又能传出
  3. 调用：call procedure_name; 或 call procedure_name(params);
  4. 删除：drop procedure procedureName

## 视图：对select语句进行封装，即存储在数据库中的一个虚拟表；(复杂的查询，多处使用，想更改很麻烦)

  1. 创建：create view view_name as select XX as 'XX', ... from tableName as 's'
  2. 查看：show tables
  3. 调用：select field from view_name;
  4. 删除：drop view view_name

## 事务：解决操作集合，如转帐，包含扣钱方 和 收钱方，整个操作是一体的，一个单元失败则会回滚
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

## 其他命令
1. status, help  === \? 也可以 help select
2. 退出当前数据库：\q
3. 用户select user()\g 或 select User, Host, Password from user
4. 取消执行的命令：select \c
5. select current_time();
6. select 算术运算
7. delimiter $$  ... end $$ delimiter ;  先定义结束符，再恢复。

## API

- 字符串

1. select concat('a','-','b') 字符串连接
2. concat_ws('||','a','-','b') 以||字符间隔连接
3. lower() / lcase(), upper()
4. left(), right() 获取左 或 右侧字符串
5. ltrim(), rtrim() 删除前导 或 后续空格
6. replace(str, '?', '-') 将?替换成-
7. substring(str, offset, length)
8. trim() 删除前后两边的空格，也可以删除指定前导 和 后续的字符串
  trim(leading'?', '??abc????') 删除前导?号
  trim(trailing'?', '??abc????') 删除后续?号
  trim(both'?', '??abc????') 删除两边?号
9. [not] like (% 代表0 或 多个任意字符，_任意一个字符)
10. escape
11. length()
12. instr(str, substr) 子串第一个出现的位置

- 数字

1. format(124567.7, 2) 保留两位小数，第三位一个逗号
2. ceil() 入，取整
3. floor() 舍，取整
4. div 整数除法，如：3 div 4 = 0；/是有小数的
5. mod 取余 与 % 一样
6. power(3, 4) 幂
7. round(3.1415, 4) 取余，四舍五入；总长度为4
8. truncate(3.1415, 2) 截断，不四舍五入；保留2位小数
9. rand()
10. least(v1, v2, ...); greatest(v1, v2, ...)
11. abs()

- 日期时间

1. now() 当前日期和时间
2. curdate() 当前日期
3. curtime() 当前时间
4. date_add('2016-6-6', interval 1 year) 日期和一段时间的和 或 week, month
5. datediff('2016-6-6','2015-6-6') 日期的差
6. date_format('2016-6-6', '%m/%d/%Y') 日期格式化
7. sysdate() 与 current_timestamp() 与 now()一样
8. dayname(date) 获取星期几
9. str_to_date('2017年1月10号 11时02分02秒', '%Y年%m月%d号 %h时%i分%s秒') %H为24小时制

- 比较

1. field is [not] null
2. value [not] / in(1,2,3,5,6)
3. value [not]between A and B;
4. = 与 <=> 判断等于null时结果不同
5. isnull(field)

- 数据库信息函数
1. select connection_id()
2. select database()
3. select last_insert_id()
4. version()
5. user()

- 聚合函数
1. round(avg(field), 3) as avg_field
2. count(field) as counts
3. max(field) as max_field; min
4. sum(field) as sum_field

- 语句
1. (case field when v then expr when v2 then expr2 else expr3 end) as field1
2. if(expr, expr2, expr3) if函数

- 加密函数
1. md5('')
2. password('')

- 并发控制(多个连接对记录进行修改时，保证数据的一致性与完整性，且锁系统来控制)

1. 共享锁(读锁)：同一时间内，多用户可以读取同一个资源，读取过程中不会发生任何变化。
2. 排他锁(写锁)：任何时间只能有一个用户写入资源，进行写锁时会阻塞其他读或写锁操作。
3. 锁的力度娘----表锁(开销最小)，行锁(开销最大，并行性最大)，开销与使用锁的个数有关。
4. 存储引擎：default-storage-engine = innoDB 或 create table table_name() engine = innoDB; 或 alter table tbl_name engine = innoDB;
