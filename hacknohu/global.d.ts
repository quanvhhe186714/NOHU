// Very lightweight type shims so that .tsx files compile without installing full @types packages.

declare module "react" {
  // Basic React types we actually use
  export type FC<P = any> = (props: P) => any;
  export type FormEvent = any;

  export function useState<T = any>(
    initialState: T
  ): [T, (value: T | ((prev: T) => T)) => void];
  export function useEffect(
    effect: (...args: any[]) => any,
    deps?: any[]
  ): void;

  const React: any;
  export default React;
}

declare module "react/jsx-runtime" {
  const content: any;
  export = content;
}

declare module "react-icons/fi" {
  const content: any;
  export = content;
}

declare module "framer-motion" {
  export const motion: any;
  export const AnimatePresence: any;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}



