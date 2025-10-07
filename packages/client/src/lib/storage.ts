import { STORAGE_KEY_CONFIG } from '@/constants/storage-key.config'

type StorageKey = keyof typeof STORAGE_KEY_CONFIG

const getItemFromStorage = (key: StorageKey): string | null => {
  const storageKey = STORAGE_KEY_CONFIG[key]
  return localStorage.getItem(storageKey)
}

const setItemToStorage = (key: StorageKey, value: string) => {
  const storageKey = STORAGE_KEY_CONFIG[key]
  localStorage.setItem(storageKey, value)
}

const removeItemFromStorage = (key: StorageKey) => {
  const storageKey = STORAGE_KEY_CONFIG[key]
  localStorage.removeItem(storageKey)
}

const clearAllItemsFromStorage = () => {
  localStorage.clear()
}

export { getItemFromStorage, setItemToStorage, removeItemFromStorage, clearAllItemsFromStorage }
