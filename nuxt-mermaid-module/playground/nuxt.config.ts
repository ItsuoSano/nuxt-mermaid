import { defineNuxtConfig } from 'nuxt/config'
import NuxtMermaid from '..'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    NuxtMermaid
  ],
  routeRules: {
    '/': { static: true }
  }
})
