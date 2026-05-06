import { useEffect, useState, useCallback } from "react";

const KEY = "myTaskIds";

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function emit() {
  window.dispatchEvent(new Event("myTasks:changed"));
}

export function useMyTasks() {
  const [ids, setIds] = useState<string[]>(read);

  useEffect(() => {
    const handler = () => setIds(read());
    window.addEventListener("myTasks:changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("myTasks:changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const add = useCallback((id: string) => {
    const cur = read();
    if (cur.includes(id)) return;
    const next = [...cur, id];
    localStorage.setItem(KEY, JSON.stringify(next));
    emit();
  }, []);

  const remove = useCallback((id: string) => {
    const next = read().filter((x) => x !== id);
    localStorage.setItem(KEY, JSON.stringify(next));
    emit();
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, add, remove, has };
}
