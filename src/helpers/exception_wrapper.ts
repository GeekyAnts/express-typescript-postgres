export const wrapper =
  (fn: Function) =>
  (...args: any) =>
    fn(...args).catch(args[2])
