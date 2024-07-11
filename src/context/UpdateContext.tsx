import { createContext } from 'react';

export const UpdateContext = createContext({
  isUpdate: false,
  setIsUpdate: (value: boolean) => {}
});