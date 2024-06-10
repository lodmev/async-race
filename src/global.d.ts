declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module globalThis {
  function sayToast(msg: unknown, isError?: boolean): void;
}
