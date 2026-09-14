import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(persist((set) => ({
  bagCount: 0,
  bagItems: [],
  wishlist: [],
  checkoutItems: [],

  addToBag: (product) => set((state) => {
    const size = product.size || 'M'
    const idx = state.bagItems.findIndex(i => i.name === product.name && i.size === size)
    const qty = product.quantity || 1
    
    if (idx >= 0) {
      const newItems = [...state.bagItems]
      newItems[idx] = { ...newItems[idx], count: newItems[idx].count + qty }
      return { bagItems: newItems, bagCount: state.bagCount + qty }
    } else {
      const newItems = [...state.bagItems, { name: product.name, price: product.price, image: product.image, size, count: qty }]
      return { bagItems: newItems, bagCount: state.bagCount + qty }
    }
  }),
  
  removeFromBagByNameAndSize: (name, size) => set((state) => {
    const item = state.bagItems.find(i => i.name === name && i.size === size)
    const countToRemove = item ? item.count : 0
    const newItems = state.bagItems.filter(i => !(i.name === name && i.size === size))
    return { bagItems: newItems, bagCount: Math.max(0, state.bagCount - countToRemove) }
  }),

  removeOneFromBagByKey: (name, size) => set((state) => {
    const idx = state.bagItems.findIndex(i => i.name === name && i.size === size)
    if (idx >= 0) {
      const newItems = [...state.bagItems]
      if (newItems[idx].count > 1) {
        newItems[idx] = { ...newItems[idx], count: newItems[idx].count - 1 }
        return { bagItems: newItems, bagCount: Math.max(0, state.bagCount - 1) }
      } else {
        newItems.splice(idx, 1)
        return { bagItems: newItems, bagCount: Math.max(0, state.bagCount - 1) }
      }
    }
    return state
  }),

  removeFromCheckoutByNameAndSize: (name, size) => set((state) => {
    return { checkoutItems: state.checkoutItems.filter(i => !(i.name === name && i.size === size)) }
  }),

  incrementInCheckout: (item) => set((state) => {
    const size = item.size || 'M'
    const idx = state.checkoutItems.findIndex(i => i.name === item.name && i.size === size)
    if (idx >= 0) {
      const newItems = [...state.checkoutItems]
      newItems[idx] = { ...newItems[idx], count: newItems[idx].count + 1 }
      return { checkoutItems: newItems }
    }
    return state
  }),

  decrementFromCheckoutByKey: (name, size) => set((state) => {
    const idx = state.checkoutItems.findIndex(i => i.name === name && i.size === size)
    if (idx >= 0) {
      const newItems = [...state.checkoutItems]
      if (newItems[idx].count > 1) {
        newItems[idx] = { ...newItems[idx], count: newItems[idx].count - 1 }
        return { checkoutItems: newItems }
      } else {
        newItems.splice(idx, 1)
        return { checkoutItems: newItems }
      }
    }
    return state
  }),

  setCheckoutItems: (items) => set({ checkoutItems: items }),

  toggleWishlist: (product) => set((state) => {
    const idx = state.wishlist.findIndex(p => p.name === product.name)
    if (idx >= 0) {
      const newWishlist = [...state.wishlist]
      newWishlist.splice(idx, 1)
      return { wishlist: newWishlist }
    } else {
      return { wishlist: [...state.wishlist, { name: product.name, price: product.price, image: product.image }] }
    }
  }),

  clearBag: () => set({ bagCount: 0, bagItems: [], checkoutItems: [] })
}), {
  name: 'luxe-clothing-storage'
}))

export const addToBag = (product) => useStore.getState().addToBag(product)
export const removeFromBag = (idx) => useStore.getState().removeFromBag(idx)
export const removeFromBagByName = (name) => useStore.getState().removeFromBagByName(name)
export const removeFromBagByNameAndSize = (name, size) => useStore.getState().removeFromBagByNameAndSize(name, size)
export const removeOneFromBag = (name) => useStore.getState().removeOneFromBag(name)
export const removeOneFromBagByKey = (name, size) => useStore.getState().removeOneFromBagByKey(name, size)
export const removeFromCheckout = (idx) => useStore.getState().removeFromCheckout(idx)
export const removeFromCheckoutByName = (name) => useStore.getState().removeFromCheckoutByName(name)
export const removeFromCheckoutByNameAndSize = (name, size) => useStore.getState().removeFromCheckoutByNameAndSize(name, size)
export const incrementInCheckout = (item) => useStore.getState().incrementInCheckout(item)
export const decrementFromCheckout = (name) => useStore.getState().decrementFromCheckout(name)
export const decrementFromCheckoutByKey = (name, size) => useStore.getState().decrementFromCheckoutByKey(name, size)
export const setCheckoutItems = (items) => useStore.getState().setCheckoutItems(items)
export const toggleWishlist = (product) => useStore.getState().toggleWishlist(product)
export const clearBag = () => useStore.getState().clearBag()
export const isWishlisted = (name) => useStore.getState().wishlist.some(p => p.name === name)

export const getBagCount = () => useStore.getState().bagCount
export const getBagItems = () => useStore.getState().bagItems
export const getWishlist = () => useStore.getState().wishlist
export const getCheckoutItems = () => useStore.getState().checkoutItems

export function showToast(msg) {
  window.dispatchEvent(new CustomEvent('toast-show', { detail: msg }))
}
