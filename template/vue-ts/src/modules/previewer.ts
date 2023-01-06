import Previewer from 'virtual:vue-component-preview'
import { type UserModule } from '@/types'

export const install: UserModule = ({ app }) => {
  app.use(Previewer)
}
