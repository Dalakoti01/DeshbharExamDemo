// redux/storage.js
export const loadState = () => {
  if (typeof window === "undefined") return undefined;
  try {
    const serialized = localStorage.getItem("reduxState");
    return serialized ? JSON.parse(serialized) : undefined;
  } catch (err) {
    console.error("Failed to load state:", err);
    return undefined;
  }
};

export const saveState = (state) => {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem("reduxState", serialized);
  } catch (err) {
    console.error("Failed to save state:", err);
  }
};