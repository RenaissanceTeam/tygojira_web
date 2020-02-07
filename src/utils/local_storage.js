
export function setWithExpiry(key, value, ttl) {
  if (ttl < 0) throw new Error("ttl cannot be negative");
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + Number(ttl)
  };
  localStorage.setItem(key, JSON.stringify(item))
}

export function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key);

  if (!itemStr) {
    throw new Error(`${key} doesn't exists`)
  }
  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    throw new Error(`${key} has expired`)
  }
  return item.value
}

export function deleteWithExpiry(key) {
  const itemStr = localStorage.getItem(key);

  if (itemStr) localStorage.removeItem(key);
}