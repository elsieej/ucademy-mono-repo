import { STORAGE_KEY_CONFIG } from '@/constants/storage-key.config'

type StorageKey = keyof typeof STORAGE_KEY_CONFIG

const getItemFromStorage = (key: StorageKey) => {
  return localStorage.getItem(key)
}

const setItemToStorage = (key: StorageKey, value: string) => {
  localStorage.setItem(key, value)
}

const removeItemFromStorage = (key: StorageKey) => {
  localStorage.removeItem(key)
}

const clearAllItemsFromStorage = () => {
  localStorage.clear()
}

export { getItemFromStorage, setItemToStorage, removeItemFromStorage, clearAllItemsFromStorage }
