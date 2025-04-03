import plugin from '../../../lib/plugins/plugin.js';
import { MailSender } from '../lib/mailsender.js'

const sender = new MailSender();

export class esca_mail extends plugin {
    constructor() {
        super({
            name: 'esca_mail',
            dsc: '逸燧插件-邮件类mail.js',
            event: 'message',
            priority: 5000,
            rule: [
                {
                    reg: '^(#|e)邮件测试$',
                    fnc: 'checkMail'
                },
                {
                    reg: /^(#|e)发送邮件\s*([^\s:@]+@[^\s:@]+\.[^\s:@]+):([^:]+):([\s\S]+)/,
                    fnc: 'sendCustomMail'
                },
            ]
        });
    }

    async checkMail(e) {
        const MailSendStatus = await sender.SendMail(e, 'test', 'test', '[esca-plugin] 邮件测试', 'test.html');
        if (MailSendStatus) {
            e.reply('邮件发送成功');
            return true;
        } else {
            e.reply('邮件发送失败，请查看日志');
            return true;
        }
    }

    async sendCustomMail(e) {
        const [fullMatch, prefix, receiver, subject, content] = e.msg.match(/^(#|e)发送邮件\s*([^\s:@]+@[^\s:@]+\.[^\s:@]+):([^:]+):([\s\S]+)/);
        const MailSendStatus = await sender.SendMail(e, 'custom', content, subject, 'custom.html', receiver);
        if (MailSendStatus) {
            e.reply('邮件发送成功');
            return true;
        } else {
            e.reply('邮件发送失败，请查看日志');
            return true;
        }
    }
}