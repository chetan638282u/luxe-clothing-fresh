import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(persist((set) => ({
  bagCount: 0,
  bagItems: [],
  wishlist: [],
  checkoutItems: [],

  addToBag: (product) => set((state) => {
    const newItems = [...state.bagItems, { name: product.name, price: product.price, image: product.image }]
    return { bagItems: newItems, bagCount: state.bagCount + 1 }
  }),
  
  removeFromBag: (index) => set((state) => {
    const newItems = [...state.bagItems]
    newItems.splice(index, 1)
    return { bagItems: newItems, bagCount: Math.max(0, state.bagCount - 1) }
  }),

  removeFromBagByName: (name) => set((state) => {
    const newItems = state.bagItems.filter(i => i.name !== name)
    return { bagItems: newItems, bagCount: newItems.length }
  }),

  removeOneFromBag: (name) => set((state) => {
    const idx = state.bagItems.findIndex(i => i.name === name)
    if (idx >= 0) {
      const newItems = [...state.bagItems]
      newItems.splice(idx, 1)
      return { bagItems: newItems, bagCount: Math.max(0, state.bagCount - 1) }
    }
    return state
  }),

  removeFromCheckout: (index) => set((state) => {
    const newItems = [...state.checkoutItems]
    newItems.splice(index, 1)
    return { checkoutItems: newItems }
  }),

  removeFromCheckoutByName: (name) => set((state) => {
    return { checkoutItems: state.checkoutItems.filter(i => i.name !== name) }
  }),

  incrementInCheckout: (item) => set((state) => {
    return { checkoutItems: [...state.checkoutItems, { name: item.name, price: item.price, image: item.image }] }
  }),

  decrementFromCheckout: (name) => set((state) => {
    const idx = state.checkoutItems.findIndex(i => i.name === name)
    if (idx >= 0) {
      const newItems = [...state.checkoutItems]
      newItems.splice(idx, 1)
      return { checkoutItems: newItems }
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
export const removeOneFromBag = (name) => useStore.getState().removeOneFromBag(name)
export const removeFromCheckout = (idx) => useStore.getState().removeFromCheckout(idx)
export const removeFromCheckoutByName = (name) => useStore.getState().removeFromCheckoutByName(name)
export const incrementInCheckout = (item) => useStore.getState().incrementInCheckout(item)
export const decrementFromCheckout = (name) => useStore.getState().decrementFromCheckout(name)
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
