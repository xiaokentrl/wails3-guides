declare module '*.css';
declare module '*?worker' {
  const workerConstructor: { new (): Worker };
  export default workerConstructor;
}
declare module '*.svg' {
  const src: string;
  export default src;
}
