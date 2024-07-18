/// <reference types="vite/client" />

interface ImportMeta {
  env: {
    VITE_APP_TITLE: string;
    RAZORPAY_KEY_ID: string;
    // Add other environment variables as needed
  };
}

declare module "buffer" {
  export const Buffer: any;
}

declare module "process" {
  global {
    var process: any;
  }
}
