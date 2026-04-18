declare module "@sentry/nextjs" {
  export function init(options: any): void;
  export function replayIntegration(options?: any): any;
  export function browserProfilingIntegration(): any;
}