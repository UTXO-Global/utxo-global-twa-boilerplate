export const LocalStorage = {
  getItem: async (key: string) => {
    const data = localStorage.getItem(key);
    try {
      if (data) {
        const jsonData = JSON.parse(data);
        return jsonData;
      }
    } catch (e) {
      return data;
    }
  },
  setItem: async (key: string, val: any) => {
    try {
      return localStorage.setItem(key, JSON.stringify(val));
    } catch (_e) {
      return localStorage.setItem(key, val);
    }
  },
  removeItem: async (key: string) => {
    return localStorage.removeItem(key);
  },
};
