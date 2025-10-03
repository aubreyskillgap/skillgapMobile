export class Logger {
  static error(...args: any[]) {
    const date = Date();
    console.error(date, " (ERROR) :", ...args);
  }

  static info(...args: any[]) {
    const date = Date();
    console.log(date, " (INFO) : ", ...args);
  }
}
