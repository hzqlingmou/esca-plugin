import path from 'path'
import lodash from 'lodash'
import cfg from "./models/cfg.js";
import { _paths } from "./models/paths.js";

// 支持锅巴
export function supportGuoba() {
  return {
    pluginInfo: {
      name: 'esca-plugin',
      title: '逸燧插件',
      description: '一个基于云崽的多功能插件',
      author: [
        '@逸燧'
      ],
      authorLink: [
        'https://escaped.icu',
      ],
      // 仓库地址
      link: 'https://github.com/hzqlingmou/esca-plugin',
      isV3: true,
      isV2: false,
      // 是否显示在左侧菜单，可选值：auto、true、false
      // 当为 auto 时，如果配置项大于等于 3 个，则显示在左侧菜单
      showInMenu: 'auto',
      // 显示图标，此为个性化配置
      // 图标可在 https://icon-sets.iconify.design 这里进行搜索
      icon: 'mdi:stove',
      // 图标颜色，例：#FF0000 或 rgb(255, 0, 0)
      iconColor: '#d19f56',
      // 如果想要显示成图片，也可以填写图标路径（绝对路径），可以使用静图和动图
      iconPath: path.join(_paths.pluginRoot, 'logo/1.png'),
    },
    // 配置项信息
    configInfo: {
      // 配置项 schemas
      schemas: [
        {
          label: '基础配置',
          // 第一个分组标记开始，无需标记结束
          component: 'SOFT_GROUP_BEGIN'
        },
        {
          field: 'esese',
          label: '启用涩涩功能',
          required: true,
          component: 'Switch'
        },
        {
          field: 'autoUpdate',
          label: '启用自动更新',
          required: true,
          component: 'Switch'
        },
        {
          label: '邮件配置',
          // 第二个分组标记开始
          component: 'SOFT_GROUP_BEGIN'
        },
        {
          field: 'mailConfig.isOpen',
          label: '启用邮件功能',
          component: 'Switch',
          required: true
        },
        {
          field: 'mailConfig.host',
          label: '邮件服务器主机名',
          bottomHelpMessage: '形如：smtp.qq.com',
          component: 'Input',
          componentProps: {
            placeholder: '请输入服务器地址'
          }
        },
        {
          field: 'mailConfig.port',
          label: '邮件服务器端口',
          component: 'InputNumber',
          componentProps: {
            min: 1,
            max: 65535,
            placeholder: '请输入监听端口号'
          }
        },
        {
          field: 'mailConfig.from',
          label: '发件人邮箱',
          component: 'Input',
          componentProps: {
            placeholder: '请输入发件人邮箱'
          }
        },
        {
          field: 'mailConfig.to',
          label: '默认收件人邮箱',
          component: 'Input',
          componentProps: {
            placeholder: '请输入默认收件人邮箱'
          }
        },
        {
          field: 'mailConfig.password',
          label: '密钥',
          helpMessage: '不是邮箱账户密码！！！',
          bottomHelpMessage: '填写smtp服务商给你的密钥或者密码，比如：wh5VgwAwbakCXK4UTaikPuqCq+CaeiwqDPhYujoN',
          component: 'Input',
          componentProps: {
            placeholder: '请输入密码/密钥'
          }
        },
        {
          field: 'mailConfig.secure',
          label: '加密方式',
          helpMessage: '请填写小写字母',
          bottomHelpMessage: '请填写ssl或者tls，暂不支持其他加密方式',
          component: 'Input',
          componentProps: {
            placeholder: '请输入加密方式'
          }
        },
      ],
      // 获取配置数据方法（用于前端填充显示数据）
      getConfigData() {
        return cfg.merged
      },
      // 设置配置的方法（前端点确定后调用的方法）
      setConfigData(data, { Result }) {
        let config = {}
        for (let [keyPath, value] of Object.entries(data)) {
          lodash.set(config, keyPath, value)
        }
        config = lodash.merge({}, cfg.merged, config)
        cfg.config.reader.setData(config)
        return Result.ok({}, '保存成功，Ciallo～(∠・ω< )⌒☆')
      },
    },
  }
}
