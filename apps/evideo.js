import plugin from '../../../lib/plugins/plugin.js';
import fetch from 'node-fetch'; // 导入 node-fetch 用于发起 HTTP 请求

let xjjurl = 'http://api.yujn.cn/api/xjj.php?type=video' //备用api http://api.yujn.cn/api/zzxjj.php?type=video
let dxsurl = 'https://api.yujn.cn/api/nvda.php?type=video'


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
			]
		});
	}

	async evxjj(e) {
		try {
			await this.e.reply(segment.video(xjjurl))
			return true;
		} catch (error) {
			console.error(error)
			await e.reply('访问失败，可能是视频api失效，请联系开发者解决')
		}
	}

	async evdxs(e) {
		try {
			await this.e.reply(segment.video(dxsurl))
			return true;
		} catch (error) {
			console.error(error)
			await e.reply('访问失败，可能是视频api失效，请联系开发者解决')
		}
	}

}
