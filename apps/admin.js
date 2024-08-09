import fs from 'node:fs';
import path from 'node:path';
import lodash from 'lodash';
import { App } from '../components/index.js';

// 定义配置文件路径
const configPath = path.resolve(process.cwd(), 'config', 'config', 'img.json');
const defaultConfigPath = path.resolve(process.cwd(), 'config', 'default_config', 'img.json');

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
async function toggleCfg(e) {
  if (!await checkAuth(e)) {
    return true;
  }

  // 检查配置文件是否存在
  if (!fs.existsSync(configPath)) {
    // 如果不存在，从默认配置文件复制内容
    if (fs.existsSync(defaultConfigPath)) {
      fs.copyFileSync(defaultConfigPath, configPath);
    } else {
      // 如果默认配置文件也不存在，则创建一个空的配置文件
      fs.writeFileSync(configPath, JSON.stringify({ sese: false }, null, 2), 'utf8');
    }
  }

  // 读取配置文件
  let configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  // 切换 sese 的值
  configData.sese = !configData.sese;

  // 写入配置文件
  fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), 'utf8');

  // 通知用户配置已更新
  await e.reply(`配置 "sese" 已切换为 "${configData.sese}"`);

  return true;
}