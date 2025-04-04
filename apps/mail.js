import plugin from '../../../lib/plugins/plugin.js';
import { MailSender } from '../lib/mailsender.js'
import { SettingsFunc } from '../lib/config.js';

const settings = new SettingsFunc();
const sender = new MailSender();

let receiver = '';
let subject = '';
let content = '';

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
                    fnc: 'sendCustomMailOneLine'
                },
                {
                    reg: '^(#|e)发送邮件$',
                    fnc: 'sendCustomMail'
                }
            ]
        });
    }

    async checkMail(e) {
        const isMgr = await settings.checkAuth(e);
        if (!(isMgr)) return
        const MailSendStatus = await sender.SendMail(e, 'test', 'test', '[esca-plugin] 邮件测试', 'test.html');
        if (MailSendStatus) {
            e.reply('邮件发送成功');
            return true;
        } else {
            e.reply('邮件发送失败，请查看日志');
            return true;
        }
    }

    async sendCustomMailOneLine(e) {
        const isMgr = await settings.checkAuth(e);
        if (!(isMgr)) return
        const [fullMatch, prefix, onelineReceiver, onelineSubject, onelineContent] = e.msg.match(/^(#|e)发送邮件\s*([^\s:@]+@[^\s:@]+\.[^\s:@]+):([^:]+):([\s\S]+)/);
        const MailSendStatus = await sender.SendMail(e, 'custom', onelineContent, onelineSubject, 'custom.html', onelineReceiver);
        if (MailSendStatus) {
            e.reply('邮件发送成功');
            return true;
        } else {
            e.reply('邮件发送失败，请查看日志');
            return true;
        }
    }

    async sendCustomMail(e) {
        const isMgr = await settings.checkAuth(e);
        if (!(isMgr)) return
        try {
            receiver = '';
            subject = '';
            content = '';
            this.setContext('getReceiver')
            return e.reply('请输入收件人邮箱地址');
        } catch (error) {
            logger.error(error);
            return true;
        }
    }

    async getReceiver(e) {
        try {
            this.finish('getReceiver')
            receiver = this.e.msg;
            this.setContext('getSubject')
            return e.reply('请输入邮件主题');
        } catch (error) {
            logger.error(error);
            return true;
        }
    }

    async getSubject(e) {
        try {
            this.finish('getSubject')
            subject = this.e.msg;
            this.setContext('getContent')
            return e.reply('请输入邮件内容');
        } catch (error) {
            logger.error(error);
            return true;
        }
    }

    async getContent(e) {
        try {
            this.finish('getContent')
            content = this.e.msg;
            e.reply('正在发送邮件，请稍后...')
            const MailSendStatus = await sender.SendMail(e, 'custom', content, subject, 'custom.html', receiver);
            if (MailSendStatus) {
                e.reply('邮件发送成功');
                return true;
            } else {
                e.reply('邮件发送失败，请查看日志');
                return true;
            }
        } catch (error) {
            logger.error(error);
            return true;
        }
    }
}
