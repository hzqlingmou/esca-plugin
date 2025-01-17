import fs from 'fs/promises';
import yaml from 'js-yaml';
import plugin from '../../../lib/plugins/plugin.js';
import { segment } from 'oicq';
import fetch from 'node-fetch'; // Make sure to install node-fetch or another fetch polyfill for Node.js
import { eCfgPath } from './admin.js';

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

export class esca_img extends plugin {
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

	async loadConfig() {
		try {
			const fileContents = await fs.readFile(eCfgPath, 'utf8');
			return yaml.load(fileContents);
		} catch (error) {
			logger.error('加载配置文件失败:', error);
			throw new Error('无法读取配置文件，请检查路径或文件权限');
		}
	}

	async eimg() {
		await this.sendimg(url1);
	}

	async elt() {
		await this.sendimg(url2);
	}

	async ecj() {
		await this.sendimg(url3);
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

	async Ese(e) {
		try {
			const config = await this.loadConfig();

			// 根据'esese'的值发送不同的回复
			if (config.esese == true) {
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
				return;
			} else {
				if (typeof config.esese === 'boolean') {
					await e.reply('还没有开启涩涩功能哦，请使用“esese切换”开启功能');
					return;
				} else {
					await e.reply('esese 配置变量类错误，请使用“esese初始化”刷新');
					return;
				}
			}
		} catch (error) {
			logger.error('[esca-plugin] esese发送图片异常', error);
			await e.reply('发生错误，请使用“e重置设置”刷新配置文件');
			return;
		}
	}

	async esm() {
		await this.sendimg(url7);
	}

	async sendimg(url) {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error();
			}
			const arrayBuffer = await response.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			await this.reply(segment.image(buffer));
		} catch (error) {
			logger.error(error);
			await this.reply('访问失败，可能是图片api失效，请联系开发者解决');
		}
	}
}