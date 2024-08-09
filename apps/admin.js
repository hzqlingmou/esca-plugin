import fs from 'node:fs';
import path from 'node:path';
import lodash from 'lodash';
import { App } from '../components/index.js';

// 定义配置文件路径
const configPath = path.resolve(process.cwd(), 'data', 'esca-plugin', 'config', 'config', 'img.json');
const defaultConfigPath = path.resolve(process.cwd(), 'data', 'esca-plugin', 'config', 'default_config', 'img.json');

// 初始化应用
let app = App.init({
  id: 'esca-admin',
  name: '逸燧插件设置',
  desc: '逸燧插件设置'
});

// 定义命令正则表达式
let toggleCfgReg = /^e切换$/;

// 注册命令
app.reg({
  toggleCfg: {
    rule: toggleCfgReg,
    fn: toggleCfg,
    desc: '【逸燧插件sese】切换配置'
  }
});

export default app;

/**
 * 检查是否有权限执行命令
 * @param {object} e - 消息事件对象
 * @returns {boolean} - 是否有权限
 */
const checkAuth = async function (e) {
  if (!e.isMaster) {
    await e.reply(`只有主人才能命令窝哦~\n(*/ω＼*)`);
    return false;
  }
  return true;
};

/**
 * 切换配置命令处理
 * @param {object} e - 消息事件对象
 * @returns {boolean}
 */
