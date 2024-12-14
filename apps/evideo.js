import plugin from '../../../lib/plugins/plugin.js';
import fetch from 'node-fetch'; // 导入 node-fetch 用于发起 HTTP 请求

let xjjurl = 'http://api.yujn.cn/api/xjj.php?type=video'; //备用api http://api.yujn.cn/api/zzxjj.php?type=video
let dxsurl = 'https://api.yujn.cn/api/nvda.php?type=video';
let hsurl = 'http://api.yujn.cn/api/heisis.php?type=video';
let bsurl = 'http://api.yujn.cn/api/baisis.php?type=video';
let yzurl = 'http://api.yujn.cn/api/jpmt.php?type=video';
let myurl = 'http://api.yujn.cn/api/manyao.php?type=video';
let ddurl = 'http://api.yujn.cn/api/diaodai.php?type=video';
let qcurl = 'http://api.yujn.cn/api/qingchun.php?type=video';
let cosurl = 'http://api.yujn.cn/api/COS.php?type=video';
let ngurl = 'http://api.yujn.cn/api/nvgao.php?type=video';
let llurl = 'http://api.yujn.cn/api/luoli.php?type=video';
let tmurl = 'http://api.yujn.cn/api/tianmei.php?type=video';

export class example extends plugin {
	constructor() {
		super({
			name: 'evideo',
			dsc: '逸燧插件视频',
			event: 'message',
			priority: 5000,
			rule: [
				{
					reg: '^e小姐姐$',
					fnc: 'evxjj'
				},
				{
					reg: '^e(女)?大学生$',
					fnc: 'evdxs'
				},
				{
					reg: '^e黑丝$',
					fnc: 'eheisi'
				},
				{
					reg: '^e白丝$',
					fnc: 'ebs'
				},
				{
					reg: '^e(玉足|狱卒)$',
					fnc: 'eyz'
				},
				{
					reg: '^e慢摇$',
					fnc: 'emy'
				},
				{
					reg: '^e吊带$',
					fnc: 'edd'
				},
				{
					reg: '^e清纯$',
					fnc: 'eqc'
				},
				{
					reg: '^ecos$',
					fnc: 'ecos'
				},
				{
					reg: '^e女高$',
					fnc: 'eng'
				},
				{
					reg: '^e萝莉$',
					fnc: 'ell'
				},
				{
					reg: '^e甜妹$',
					fnc: 'etm'
				}
			]
		});
	}

	async evxjj() {
		await this.sendVideo(xjjurl);
	}

	async evdxs() {
		await this.sendVideo(dxsurl);
	}

	async eheisi() {
		await this.sendVideo(hsurl);
	}

	async ebs() {
		await this.sendVideo(bsurl);
	}

	async eyz() {
		await this.sendVideo(yzurl);
	}

	async emy() {
		await this.sendVideo(myurl);
	}

	async edd() {
		await this.sendVideo(ddurl);
	}

	async eqc() {
		await this.sendVideo(qcurl);
	}

	async ecos() {
		await this.sendVideo(cosurl);
	}

	async eng() {
		await this.sendVideo(ngurl);
	}

	async ell() {
		await this.sendVideo(llurl);
	}

	async etm() {;
		await this.sendVideo(tmurl);
	}
	async sendVideo(url) {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error();
			}
			const arrayBuffer = await response.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			await this.reply(segment.video(buffer));
		} catch (error) {
			logger.error(error);
			await this.reply('访问失败，可能是视频api失效，请联系开发者解决');
		}
	}
}
