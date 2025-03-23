import plugin from '../../../lib/plugins/plugin.js';
import { segment } from 'oicq';
import fetch from 'node-fetch';

const urlList = [
	'http://api.yujn.cn/api/xjj.php?type=video',//小姐姐 备用api http://api.yujn.cn/api/zzxjj.php?type=video
	'https://api.yujn.cn/api/nvda.php?type=video',//女大学生
	'http://api.yujn.cn/api/heisis.php?type=video',//黑丝
	'http://api.yujn.cn/api/baisis.php?type=video',//白丝
	'http://api.yujn.cn/api/jpmt.php?type=video',//玉足
	'http://api.yujn.cn/api/manyao.php?type=video',//慢摇
	'http://api.yujn.cn/api/diaodai.php?type=video',//吊带
	'http://api.yujn.cn/api/qingchun.php?type=video',//清纯
	'http://api.yujn.cn/api/COS.php?type=video',//cos
	'http://api.yujn.cn/api/nvgao.php?type=video',//女高
	'http://api.yujn.cn/api/luoli.php?type=video',//萝莉
	'http://api.yujn.cn/api/tianmei.php?type=video'//甜妹
]


export class esca_video extends plugin {
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
		await this.sendVideo(urlList[0]);
	}

	async evdxs() {
		await this.sendVideo(urlList[1]);
	}

	async eheisi() {
		await this.sendVideo(urlList[2]);
	}

	async ebs() {
		await this.sendVideo(urlList[3]);
	}

	async eyz() {
		await this.sendVideo(urlList[4]);
	}

	async emy() {
		await this.sendVideo(urlList[5]);
	}

	async edd() {
		await this.sendVideo(urlList[6]);
	}

	async eqc() {
		await this.sendVideo(urlList[7]);
	}

	async ecos() {
		await this.sendVideo(urlList[8]);
	}

	async eng() {
		await this.sendVideo(urlList[9]);
	}

	async ell() {
		await this.sendVideo(urlList[10]);
	}

	async etm() {;
		await this.sendVideo(urlList[11]);
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
