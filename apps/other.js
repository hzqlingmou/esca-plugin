import plugin from '../../../lib/plugins/plugin.js';
import { segment } from 'oicq';
import fs from 'fs';
import fetch from 'node-fetch'; // Make sure to install node-fetch or another fetch polyfill for Node.js
import path from 'node:path';

const configPath = path.resolve(process.cwd(), 'data', 'esca-plugin', 'config', 'config', 'img.json');
const defaultConfigPath = path.resolve(process.cwd(), 'data', 'esca-plugin', 'config', 'default_config', 'img.json');

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
					fnc: 'esx'
				},
				{
					reg: '^e朋友圈文案$',
					fnc: 'ewa'
				},
				{
					reg: '^e切换$',
					fnc: 'admin'
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

	async esx(e) {
        try {
			this.e.reply('在写了在写了')

			const match = e.msg.match(/^e手写(.*)$/);

			if (!match) {
				await e.reply('请输入合成文本');
				return;
			}

			const shouxieTxt = match[1].trim();

			const shouxieimg = `http://api.yujn.cn/api/shouxie.php?text=${shouxieTxt}`;

			this.e.reply(segment.image(shouxieimg));
			return
			
		} catch (error) {
			logger.error(error);
			await e.reply('出错力');
			return
		}
    }

	async ewa(e) {
		try {
			const pyqwa = await fetch ('https://api.yujn.cn/api/pyq.php?type=json');
			const pyqwaData = await pyqwa.json();

			if ( pyqwaData.code !== 200 ) {
				await e.reply('访问出错，可能是api失效');
				return;
			}

			const { pyq } = pyqwaData;

			e.reply(pyq);

			return
		} catch {
			logger.error(error);
			await e.reply('出错力');
			return
		}
	}

	async admin(e) {
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
}
