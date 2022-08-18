import isDocumentVisible from "./isDocumentVisible";
import isOnline from "./isOnline";

const isBrowser = typeof window !== "undefined";

const listeners: any[] = [];

function subscribe(listener: () => void) {
  listeners.push(listener);
  return function unsubscribe() {
    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
  };
}

if (isBrowser) {
  const revalidate = () => {
    if (!isDocumentVisible() || !isOnline()) return;
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  };
  window.addEventListener("visibilitychange", revalidate, false);
  window.addEventListener("focus", revalidate, false);
}

export default subscribe;
