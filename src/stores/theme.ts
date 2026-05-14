import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  function init() {
    const stored = localStorage.getItem('theme')
    isDark.value = stored
      ? stored === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches
    applyClass()
  }

  function toggle() {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyClass()
  }

  function applyClass() {
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  return { isDark, init, toggle }
})
