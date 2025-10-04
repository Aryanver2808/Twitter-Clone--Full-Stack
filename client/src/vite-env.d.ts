interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // add other VITE_ env variables here if you have them
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
