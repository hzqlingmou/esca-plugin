import plugin from '../../../lib/plugins/plugin.js';
import fetch from 'node-fetch';
import { segment } from 'oicq';
import fs from 'fs';

const escaData = 'data/esca-plugin';
fs.mkdirSync(`${escaData}/temp`, { recursive: true });

export class example extends plugin {
    constructor() {
        super({
            name: '逸燧插件其他',
            dsc: 'esca-others',
            event: 'message',
            priority: -114514,
            rule: [
                {
                    reg: '^e查询备案(.*)$',
                    fnc: 'beian'
                },
                {
                    reg: '^e丁真说(.*)$',
                    fnc: 'Dz'
                },
				{
					reg: '^e手写(.*)$',
					fnc: 'sx'
				}
            ]
        });
    }

    async beian(e) {
        try {
			const match = e.msg.match(/^e查询备案(.*)$/);

			if (!match) {
				await e.reply('请输入要查询的域名');
				return;
			}

			const url = match[1];
			const apiUrl = `https://api.yujn.cn/api/beian.php?type=json&domain=${url}`;

			const response = await fetch(apiUrl);
			const responseData = await response.json();

			if (responseData.code !== 200 || !responseData.data) {
				await e.reply('格式错误或暂无备案信息QAQ');
				return;
			}

			const { domain, company, type, number, auditTime } = responseData.data;

			const msg = [
				`查询域名：`,
                domain,
                '\n',
				'域名所属:',
				company,
				'\n',
				'备案号:',
				number,
				'\n',
                '拥有者类型：',
                type,
                '\n',
				'备案时间:',
				auditTime
			];

			await e.reply(msg.join('')); 
		} catch (error) {
			console.error(error);
			await e.reply('查询错误');
		}
    }

    async Dz(e) {
        try {
			this.e.reply('等等哦，丁真在思考怎么说了~')

			const match = e.msg.match(/^e丁真说(.*)$/);

			if (!match) {
				await e.reply('请输入合成文本');
				return;
			}

			const txt = match[1].trim();

			const yuyin = await fetch(`https://qtkj.love/api/AI_Speaker/?speaker=dinzheng&message=${txt}`);
			const yuyinData = await yuyin.json();

			if (yuyinData.code !== 200 || !yuyinData.data) {
				await e.reply('合成出错，请检查说话内容中是否有特殊字符');
				return;
			}

			const { url } = yuyinData.data;

			this.e.reply(segment.record(url));
			return
			
		} catch (error) {
			logger.error(error);
			await e.reply('出错力');
			return
		}
    }

	async sx(e) {
        try {
            this.e.reply('正在生成手写图片，请稍候...');

            const match = e.msg.match(/^e手写(.*)$/);

            if (!match) {
                await e.reply('请输入要手写的文本');
                return;
            }

            const sxtxt = encodeURIComponent(match[1].trim());
            const imageUrl = `http://api.yujn.cn/api/shouxie.php?text=${sxtxt}`;
            const imagePath = `${escaData}/temp/handwritten-${Date.now()}.png`;

            const response = await fetch(imageUrl, { method: 'GET' });
            const buffer = await response.buffer();

            fs.writeFileSync(imagePath, buffer);

            await e.reply(segment.image(imagePath));
        } catch (error) {
            console.error(error);
            await e.reply('生成手写图片时出错');
        }
    }
}