import c from 'picocolors'

type ColorFunc = (str: string | number) => string
export interface Framework {
  name: string
  display: string
  color: ColorFunc
  variants: FrameworkVariant[]
}
interface FrameworkVariant {
  name: string
  display: string
  color: ColorFunc
  customCommand?: string
}

export const FRAMEWORKS: Framework[] = [
  {
    name: 'vue',
    display: 'Vue',
    color: c.green,
    variants: [
      {
        name: 'vue-ts',
        display: 'TypeScript',
        color: c.blue,
      },
      // {
      //   name: 'custom-create-vue',
      //   display: 'Customize with create-vue ↗',
      //   color: c.green,
      //   customCommand: 'npm create vue@latest TARGET_DIR',
      // },
      // {
      //   name: 'custom-nuxt',
      //   display: 'Nuxt ↗',
      //   color: c.green,
      //   customCommand: 'npm exec nuxi init TARGET_DIR',
      // },
    ],
  },
  // {
  //   name: 'react',
  //   display: 'React',
  //   color: c.cyan,
  //   variants: [
  //     {
  //       name: 'react-swc-ts',
  //       display: 'TypeScript + SWC',
  //       color: c.blue,
  //     },
  //   ],
  // },
  // {
  //   name: 'others',
  //   display: 'Others',
  //   color: c.white,
  //   variants: [
  //     {
  //       name: 'create-vite-extra',
  //       display: 'create-vite-extra ↗',
  //       color: c.white,
  //       customCommand: 'npm create vite-extra@latest TARGET_DIR',
  //     },
  //   ],
  // },
]
