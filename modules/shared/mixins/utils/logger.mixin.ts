import { Constructor } from "../constructor.type.ts";

export function LoggerMixin<TBase extends Constructor>(Base: TBase) {
  return class Logger extends Base {
    static disableLogging = false;

    public static log(...messages: any[]): void {
      if (!this.disableLogging) {
        console.log(...messages);
      }
    }

    public static warn(...messages: any[]): void {
      if (!this.disableLogging) {
        console.warn(...messages);
      }
    }

    public static error(...messages: any[]): void {
      if (!this.disableLogging) {
        console.error(...messages);
      }
    }
  };
}
