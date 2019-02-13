create function generate_userId() returns bigint
  begin
    declare workerId bigint;
    declare datacenterId bigint;
    declare _sequence bigint;


    declare fixed_times bigint default 1288834974657;
    declare id bigint;
    declare workerIdBits bigint default 5;
    declare datacenterIdBits bigint default 5;
    declare maxWorkerId bigint default -1^(-1 << workerIdBits);
    declare maxDatacenterId bigint default -1^(-1 << datacenterIdBits);
    declare sequenceBits bigint default 12;
    declare squenceMask bigint default -1^(-1 << sequenceBits);
    declare workerIdShift bigint default sequenceBits;
    declare datacenterIdShift bigint default sequenceBits + workerIdBits;
    declare timestampLeftShift bigint default sequenceBits + workerIdBits + datacenterIdBits;
    declare lastTimestamp bigint default -1;
  end;

create function next_id() return bigint
  begin
    declare _now timestamp default now();
    if _now = lastTimestamp then
      set _sequence = (_sequence + 1) & squenceMask;
      if _sequence = 0 then
        set _now = update_time(lastTimestamp);
      end if
    else
      set _sequence = 0;
    end if
    set lastTimestamp = _now;
    -- 计算id
    return (_now - fixed_times) << timestampLeftShift | (datacenterId << datacenterIdShift) | (workerId << workerIdShift) | _sequence;
  end


create function  update_time(lastTimestamp bigint) returns bigint
  begin
    declare _curtime timestamp default now();
    while _curtime <= lastTimestamp do
      set _curtime = now();
    end while;
    return _curtime;
  end

insert into user (user_id, user_name, user_sex, user_age, user_password, user_avator_url, create_time, user_saved_num) (#{now()})
