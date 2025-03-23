import fs from 'fs'
import path from 'path'
import lodash from 'lodash'
import YamlReader from './YamlReader.js'
import { eCfgPath, eDefaultCfgPath } from '../lib/info.js'

/** 配置文件 */
class GuobaExampleConfig {
  constructor() {
    /** 默认配置 */
    this.defSet = {
      path: eDefaultCfgPath,
      reader: null,
    }
    /** 用户配置 */
    this.config = {
      path: eCfgPath,
      reader: null,
    }
    this.initConfig()
  }

  /** 初始化用户配置文件 */
  initConfig() {
    let isInit = false
    if (!fs.existsSync(this.config.path)) {
      isInit = true
      let configDir = path.dirname(this.config.path)
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir)
      }
      fs.copyFileSync(this.defSet.path, this.config.path)
    }
    try {
      this.defSet.reader = new YamlReader(this.defSet.path, false)
      this.config.reader = new YamlReader(this.config.path, true)
    } catch (error) {
      logger.error(`[esca-plugin] 配置文件格式错误! `, error)
      throw error
    }
    if (isInit) {
    }
    this.config.reader.watcher.on('change', () => {
      if (!this.config.reader.isSave) {
        logger.mark(`[esca-plugin] 配置文件重载成功, Ciallo～(∠・ω< )⌒☆`)
      }
    })
  }

  /** 合并默认配置和用户配置 */
  get merged() {
    return lodash.merge({}, this.defSet.reader.jsonData, this.config.reader.jsonData)
  }

  /** 通过配置路径获取值 */
  get(keyPath) {
    return lodash.get(this.merged, keyPath)
  }

  set(keyPath, value) {
    this.config.reader.set(keyPath, value)
  }

}

/** GuobaExample配置 */
export default new GuobaExampleConfig()
