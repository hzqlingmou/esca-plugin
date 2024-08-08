import plugin from '../../../lib/plugins/plugin.js';

let url1 = 'https://api.yujn.cn/api/gzl_ACG.php?type=image&form=pc' 
let url2 = 'https://api.yujn.cn/api/long.php?type=image' 
let url3 = 'http://api.yujn.cn/api/chaijun.php'
let url4 = 'http://api.yujn.cn/api/yht.php?type=image'

export class example extends plugin {
	constructor() {
		super({
			name: 'evideo',
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
				}
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
}