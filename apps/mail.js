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
                }
            ]
        });
    }

    async checkMail(e) {
        const MailSendStatus = await sender.SendMail(e, 'test', 'test', '[esca-plugin] 邮件测试', 'test.html');
        if (MailSendStatus) {
            e.reply('[esca-plugin] 邮件发送成功');
            return true;
        } else {
            e.reply('[esca-plugin] 邮件发送失败，请查看日志');
            return true;
        }
    }
}