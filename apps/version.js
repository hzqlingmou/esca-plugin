import Help from './help/Help.js'
import { App } from '../components/index.js'

let app = App.init({
  id: 'help',
  name: '逸燧插件版本',
  desc: '逸燧插件版本'
})

app.reg({
  version: {
    rule: '^e版本$',
    fn: Help.version,
    desc: 'e版本'
  }
})

export default app
