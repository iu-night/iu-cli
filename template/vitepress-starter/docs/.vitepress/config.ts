import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'VitepressStarter',
  description: 'description',

  // head: [['link', { rel: 'icon', type: 'image/svg+xml', href: 'logo.svg' }]],
  lastUpdated: true,
  themeConfig: {
    // logo: '/logo.svg',
    nav: [
      { text: 'Guide', link: '/guide/index', activeMatch: '/guide/' },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/iu-night' }],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present iu-night',
    },

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'index', link: '/guide/index.md' },
          ],
        },
        {
          text: 'UI',
          collapsible: true,
          items: [
            { text: 'record', link: '/guide/record.md' },
          ],
        },
        {
          text: 'Tools',
          collapsible: true,
          items: [
            { text: 'vue', link: '/guide/vue.md' },
          ],
        },
      ],
    },
  },

  vite: {
    server: {
      host: true,
      port: 3366,
    },
  },
})
