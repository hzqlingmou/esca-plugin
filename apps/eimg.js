import fs from 'node:fs';
import path from 'node:path';
import plugin from '../../../lib/plugins/plugin.js';
import { segment } from 'oicq';
import lodash from 'lodash';
import fetch from 'node-fetch'; // Make sure to install node-fetch or another fetch polyfill for Node.js

// 定义配置文件路径
const configPath = path.resolve(process.cwd(), 'data', 'esca-plugin', 'config', 'config', 'img.json');
const defaultConfigPath = path.resolve(process.cwd(), 'data', 'esca-plugin', 'config', 'default_config', 'img.json');
function createDirectoryIfNotExists(directoryPath) {
	try {
	  	if (!fs.existsSync(directoryPath)) {
			fs.mkdirSync(directoryPath, { recursive: true });
			return;
	  	}
	} catch (error) {
	  	console.error('Error creating directory:', error);
	}
};
function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
};

let url1 = 'https://api.yujn.cn/api/gzl_ACG.php?type=image&form=pc' 
let url2 = 'https://api.yujn.cn/api/long.php?type=image' 
let url3 = 'http://api.yujn.cn/api/chaijun.php'
let url4 = 'http://api.yujn.cn/api/yht.php?type=image'
let url5 = 'http://api.yujn.cn/api/cxk.php?'
let url6 = 'http://api.yujn.cn/api/sese.php?'
let url7 = 'http://api.yujn.cn/api/smj.php?'

export class example extends plugin {
	constructor() {
		super({
			name: 'eimg',
			dsc: '逸燧插件图片',
			event: 'message',
			priority: 5000,
			rule: [
				{
					reg: '^(e)?饿了$',
					fnc: 'eimg'
				},
				{
					reg: '^(e)?龙图$',
					fnc: 'elt'
				},
				{
					reg: '^(e)?柴郡$',
					fnc: 'ecj'
				},
				{
					reg: '^(e)?诱惑图$',
					fnc: 'eyh'
				},
				{
					reg: '^(e)?(小黑子|鸽鸽|你干嘛)$',
					fnc: 'ecxk'
				},
				{
					reg: '^esese$',
					fnc: 'Ese'
				},
				{
					reg: '^(e)?兽猫$',
					fnc: 'esm'
				},
			]
		});
	}

    async eimg(e) {
		try {
			await this.e.reply(segment.image(url1));
			return true;
		} catch (error) {
			console.error(error);
			await e.reply('访问失败，可能是图片api失效，请联系开发者解决');
			return true;
		}
	}

	async elt(e) {
		try {
			await this.e.reply(segment.image(url2));
			return true;
		} catch (error) {
			console.error(error);
			await e.reply('访问失败，可能是图片api失效，请联系开发者解决');
			return true;
		}
	}

	async ecj(e) {
		try {
			await this.e.reply(segment.image(url3))
			return;
		} catch (error) {
			console.error(error);
			await e.reply('访问失败，可能是图片api失效，请联系开发者解决');
			return;
		}
	}

	async eyh(e) {
		try {
			const yht = [
				segment.image(url4)
			];
			const msg = await this.e.runtime.common.makeForwardMsg(e, yht, '');
			await this.e.reply(msg);
			return;
		} catch (error) {
			console.error(error);
			await e.reply('访问失败，可能是图片api失效，请联系开发者解决');
			return;
		}
	}

	async cxk(e) {
		try {
			await this.e.reply(segment.image(url5));
			return;
		} catch (error) {
			console.error(error);
			await e.reply('访问失败，可能是图片api失效，请联系开发者解决');
			return;
		}
	}

	async Ese(e) {
		try {
			createDirectoryIfNotExists(path.dirname(configPath));
    		createDirectoryIfNotExists(path.dirname(defaultConfigPath));
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
			const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
		
			// 获取'sese'布尔值
			const seseValue = configData.sese;
		
			// 根据'sese'的值发送不同的回复
			if (seseValue == true) {
			  const esetu = [
				segment.image(url6)
			  ]

			  const msg = await this.e.runtime.common.makeForwardMsg(e, esetu, '慢点冲哦❤~');
			  const res = await e.reply(msg);
			  const msg_id = res.message_id;
			  await wait(50000)
			  if (e.isGroup) {
				// 群聊场景
				await e.group.recallMsg(msg_id)
			  } else {
				// 好友场景
				await e.friend.recallMsg(msg_id)
			  }
			  await e.reply();
			  return;
			} else {
			  await e.reply('还没有开启涩涩功能哦，请使用“e切换”开启功能');
			  return;
			}
		} catch (error) {
			console.error('Error reading or writing the configuration file:', error);
			await e.reply('发生错误，请稍后再试。');
			return;
		}
	}

	async esm(e) {
		try {
			await this.e.reply(segment.image(url7));
			return true;
		} catch (error) {
			console.error(error);
			await e.reply('访问失败，可能是图片api失效，请联系开发者解决');
			return true;
		}
	}
}