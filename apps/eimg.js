import plugin from '../../../lib/plugins/plugin.js';
import fetch from 'node-fetch';
import { segment } from 'oicq';
import { SettingsFunc } from '../lib/config.js';

const settings = new SettingsFunc();

function wait(ms) {
	return new Promise(resolve => setTimeout(() => resolve(), ms));
};

const urlList = [
	'https://api.yujn.cn/api/gzl_ACG.php?type=image&form=pc',//url1
	'https://api.yujn.cn/api/long.php?type=image',//url2
	'http://api.yujn.cn/api/chaijun.php',//url3
	'http://api.yujn.cn/api/yht.php?type=image',//url4
	'https://api.lolicon.app/setu/v2?r18=1',//url6
	'http://api.yujn.cn/api/smj.php?',//url7
]

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

	async eimg() {
		await this.sendimg(urlList[0]);
	}

	async elt() {
		await this.sendimg(urlList[1]);
	}

	async ecj() {
		await this.sendimg(urlList[2]);
	}

	async eyh(e) {
		try {
			const yht = [
				segment.image(urlList[3])
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
			const config = await settings.loadConfig();

			// 检查 config 是否为 undefined
			if (config === undefined) {
				await e.reply('加载配置文件发生错误，请删除配置文件后重启');
				return false;
			}

			// 检查 esese 是否存在
			if (!('esese' in config)) {
				await e.reply('esese 配置项不存在或未定义，请检查配置文件');
				return false;
			} else if (config.esese == true) {
				// 根据'esese'的值发送不同的回复
				const infoJson = await fetch(urlList[4]);
				const infoData = await infoJson.json();
				const { title, author, urls } = infoData.data[0];
				const original = urls.original;
				const esetu = [
					`标题：${title}`,
					`作者：${author}`,
					segment.image(original)
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
			return;
		}
	}

	async esm() {
		await this.sendimg(urlList[5]);
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