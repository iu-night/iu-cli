import { resolve } from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Markdown from 'vite-plugin-vue-markdown'
import LinkAttributes from 'markdown-it-link-attributes'
import Shiki from 'markdown-it-shiki'
import Unocss from 'unocss/vite'
import Inspector from 'vite-plugin-vue-inspector'
import Preview from 'vite-plugin-vue-component-preview'
import VueMacros from 'unplugin-vue-macros/vite'

// import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@/': `${resolve(__dirname, 'src')}/`,
    },
  },

  plugins: [
    Preview(),

    VueMacros({
      plugins: {
        vue: Vue({
          include: [/\.vue$/, /\.md$/],
          reactivityTransform: true,
        }),
      },
    }),

    Inspector({
      toggleButtonVisibility: 'never',
    }),

    Unocss(),

    Pages({
      extensions: ['vue', 'md'],
    }),

    Layouts(),

    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue/macros',
        '@vueuse/head',
        '@vueuse/core',
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/stores',
      ],
      resolvers: [
      ],
      vueTemplate: true,
    }),

    Components({
      extensions: ['vue'],
      dts: 'src/components.d.ts',
      resolvers: [
      ],
    }),

    Markdown({
      wrapperClasses: 'prose prose-sm m-auto text-left',
      headEnabled: true,
      markdownItSetup(md) {
        // https://prismjs.com/
        md.use(Shiki, {
          theme: {
            light: 'vitesse-light',
            dark: 'vitesse-dark',
          },
        })
        md.use(LinkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })
      },
    }),

    // VitePWA(),
  ],

  // ssgOptions: {
  //   script: 'async',
  //   formatting: 'minify',
  // },

  server: {
    host: true,
    port: 3366,
  },
})
