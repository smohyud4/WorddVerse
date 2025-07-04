import { useState, useEffect, useRef } from 'react';

export function useToast(guess, length) {
  const [toast, setToast] = useState("");
  const toastRef = useRef(null);

  useEffect(() => {
    if (!toast) return;
    const toastEl = toastRef.current;
    if (!toastEl) return;
    toastEl.classList.add("show");
    
    for (let i = 0; i < length; i++) {
      const charTag = document.getElementById(`${guess+1}${i}`);
      charTag.classList.add("invalid");
    }

    const timeout = setTimeout(() => {
      toastEl.classList.remove("show");
      for (let i = 0; i < length; i++) {
        const charTag = document.getElementById(`${guess + 1}${i}`);
        charTag.classList.remove("invalid");
      }
      
      setToast("");
    }, 1000);

    return () => clearTimeout(timeout);
  }, [guess, length, toast]);

  return { toast, toastRef, setToast };
};

