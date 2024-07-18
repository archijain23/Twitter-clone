declare global {
  interface Window {
    process: any;
    Buffer: typeof Buffer;
  }
}

export {};
