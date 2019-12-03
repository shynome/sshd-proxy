struct Monit {
  // The number of bytes the process is using.
  1: i32 memory
  // The percent of CPU being used by the process at the moment.
  2: i32 cpu
}

// The list of path variables in the process’s environment
struct Pm2Env {
  // The working directory of the process.
  1: string pm_cwd
  // The stdout log file path.
  2: string pm_out_log_path
  // The stderr log file path.
  3: string pm_err_log_path
  // The interpreter used.
  4: string exec_interpreter
  // The uptime of the process.
  5: i32 pm_uptime
  // The number of unstable restarts the process has been through.
  6: i32 unstable_restarts
  // 
  7: i32 restart_time
  // 'online' | 'stopping' | 'stopped' | 'launching' | 'errored' | 'one-launch-status'
  8: string status
  // The number of running instances.
  9: i32 instances
  // The path of the script being run in this process.
  10: string pm_exec_path
}

struct ProcessDescription {
  // The name given in the original start command.
  1: string name
  // The pid of the process.
  2: i32 pid
  // The pid for the pm2 God daemon process.
  3: i32 pm_id
  4: Monit monit
  5: Pm2Env pm2_env
}

struct Command {
  1: bool locked
  2: string metadata
  3: string started_at
  4: string finished_at
  5: string error
}

struct Proc {
  1: string name
  2: bool vizion
  3: bool autorestart
  4: string exec_mode
  5: string exec_interpreter
  6: string pm_exec_path
  7: string pm_cwd
  8: i32 instances
  9: list<string> node_args
  10: string pm_out_log_path
  11: string pm_err_log_path
  12: string pm_pid_path
  13: string status
  14: i32 pm_uptime
  15: bool vizion_running
  16: i32 created_at
  17: i32 pm_id
  18: i32 restart_time
  19: i32 unstable_restarts
  20: bool started_inside
  21: Command command
  22: i32 exit_code
}

struct ListParams {
  1: i32 pm_id
}

service PM2Svc {
  Proc AddProxy(1: string rule)
  Proc DelProxy(1: string rule)
  list<ProcessDescription> List(1: ListParams params)
}
