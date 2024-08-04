import { useEffect } from "react";

export const useScrollTop = (...dep: any) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [...dep]);
};
