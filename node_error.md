1. process的错误事件

  - unhandledRejection
  - beforeExit
  - disconnect
  - exit
  - message
  - multipleResolves
  - rejectionHandled
  - uncaughtException
  - warning
  - 信号事件

2. child_process 方法

  - exec(command[,options][,callback]) 衍生一个shell，并运行命令，完成时将输出与错误传给回调函数
  - execFile(file[,args][,options][,callback])
  - fork(modulePath[,args][,options])  新的nodejs进程，IPX通信来调用指定模块，允许父进程与子进程之间发送消息
  - spawn(command[,args][,options]) options.detached, options.stdio  衍生子进程
  - 事件：'close', 'disconnect', 'error', 'exit', 'message'
  - 属性：subprocess.channel, subprocess.connected, subprocess.killed, subprocess.pid, subprocess.stderr, subprocess.stdin, subprocess.stdio, subprocess.stdout
  - 方法：subprocess.disconnect(), subprocess.kill([signal]), subprocess.ref(), subprocess.send(message[, sendHandle[, options]][, callback]), subprocess.unref()

