import Previewer from 'vite-plugin-vue-component-preview/client'
import { type UserModule } from '@/types'

export const install: UserModule = ({ app }) => {
  app.use(Previewer)
}
