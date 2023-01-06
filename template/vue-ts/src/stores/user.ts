import { defineStore } from 'pinia'

interface UserState {
  token: string
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
  }),

  getters: {
    getToken(): string {
      return this.token
    },
  },

  actions: {
    setToken(token: string): void {
      this.token = token
    },
  },
})
