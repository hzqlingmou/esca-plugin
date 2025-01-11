import plugin from '../../../lib/plugins/plugin.js';
import { segment } from 'oicq';
import fetch from 'node-fetch'; // Make sure to install node-fetch or another fetch polyfill for Node.js

export class esca_other extends plugin {
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
					reg: '^e手写(.*)$',
					fnc: 'esx'
				},
				{
					reg: '^e朋友圈文案$',
					fnc: 'ewa'
				},
				{
					reg: "^e火车票(.*)到(.*)$",  // 匹配“火车票[城市]到[城市]”格式的消息
					fnc: 'queryTickets' //作者：通义千问  嘎嘎厉害，快去使用  首发群695596638 经作者同意转载
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

	async esx(e) {
        try {
			this.e.reply('在写了在写了')

			const match = e.msg.match(/^e手写(.*)$/);

			if (!match) {
				await e.reply('请输入合成文本');
				return;
			}

			const shouxieTxt = match[1].trim();

			const shouxieimg = `http://api.yujn.cn/api/shouxie.php?text=${encodeURI(shouxieTxt)}`;

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

			return;
		} catch (error) {
			logger.error(error);
			await e.reply('出错力');
			return
		}
	}

    async queryTickets(e) {
        const match = e.msg.match(this.rule[5].reg);  // 使用正则表达式匹配消息

        if (!match) {
            console.error('无法解析火车票查询命令');
            await e.reply('无法识别您的查询，请输入正确的格式，例如：“火车票北京到长沙”。', true);
            return;
        }

        const departure = match[1].trim();
        const arrival = match[2].trim();

        console.log(`火车票查询请求: 从 ${departure} 到 ${arrival}`);

        let apiUrl = `https://api.lolimi.cn/API/hc/api.php?time=&arrival=${encodeURIComponent(arrival)}&departure=${encodeURIComponent(departure)}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.text();

            if (!data) {
                await e.reply("获取火车票信息失败，请稍后重试。", true);
                return;
            }

            let bot = {
                nickname: e.sender.nickname,
                user_id: e.user_id
            };

            let MsgList = [];
            const ticketList = data.split('\n');
            const firstLine = ticketList[0];
            const remainingLines = ticketList.slice(2);
            const chunkSize = 7;  // 默认每8行作为一个转发消息
            let start = 0;  // 当前处理的位置

            // 处理第一行
            MsgList.push({
                message: [
                    firstLine
                ],
                ...bot,
            });

            while (start < remainingLines.length) {
                let end = start + chunkSize;

                // 如果剩余的行数不够chunkSize，或者这一组包含“无座”，则增加一行
                if (end > remainingLines.length || remainingLines.slice(start, end).join('\n').includes('无座')) {
                    end++;
                }

                const chunk = remainingLines.slice(start, end);
                const chunkText = chunk.join('\n');
                MsgList.push({
                    message: [
                        chunkText
                    ],
                    ...bot,
                });

                start = end;  // 更新开始位置
            }

            const msg = await e.reply([await e.group.makeForwardMsg(MsgList)]);
            if (!msg) {
                console.log("消息发送失败");
                return false;
            }
            return true;
        } catch (error) {
            console.error(`获取火车票信息时出错：${error}`);
            await e.reply("获取火车票信息失败，请稍后重试。", true);
            return false;
        }
    }
}
