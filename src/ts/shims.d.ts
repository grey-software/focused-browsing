declare global {
  interface Document {
    isFocusScriptInjected?: boolean;
  }
}

declare module '*.html' {
  const content: string;
  export default content;
}

export {};