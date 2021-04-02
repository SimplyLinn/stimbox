import { createContext, useContext } from 'react';

export const initialRenderContext = createContext(true);

export default function useInitialRender(): boolean {
  return useContext(initialRenderContext);
}
