import plugin from '../../../lib/plugins/plugin.js';
import { MailSender } from '../lib/mailsender.js'
import { SettingsFunc } from '../lib/config.js';

const settings = new SettingsFunc();
const sender = new MailSender();

let receiver = '';
let subject = '';
let content = '';
let isMass = false;

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
                    reg: '^(#|e)(默认群发|群发|发送)邮件$',
                    fnc: 'sendCustomMail'
                },
            ]
        });
    }

    async checkMail(e) {
        const isMgr = await settings.checkAuth(e);
        if (!(isMgr)) return
        const MailSendStatus = await sender.SendMail('test', 'test', '[esca-plugin] 邮件测试', 'test.html');
        if (MailSendStatus) {
            e.reply('邮件发送成功');
            return true;
        } else {
            e.reply('邮件发送失败，可能是未开启邮件功能或配置错误，请查看日志');
            return true;
        }
    }

    async sendCustomMailOneLine(e) {
        const isMgr = await settings.checkAuth(e);
        if (!(isMgr)) return
        const [fullMatch, prefix, onelineReceiver, onelineSubject, onelineContent] = e.msg.match(/^(#|e)发送邮件\s*([^\s:@]+@[^\s:@]+\.[^\s:@]+):([^:]+):([\s\S]+)/);
        const MailSendStatus = await sender.SendMail('custom', onelineContent, onelineSubject, 'custom.html', onelineReceiver);
        if (MailSendStatus) {
            e.reply('邮件发送成功');
            return true;
        } else {
            e.reply('邮件发送失败，可能是未开启邮件功能或配置错误，请查看日志');
            return true;
        }
    }

    async sendCustomMail(e) {
        const isMgr = await settings.checkAuth(e);
        if (!(isMgr)) return
        try {
            isMass = false;
            receiver = '';
            subject = '';
            content = '';
            if (this.e.msg.includes('默认群发')) {
                isMass = true;
                this.getReceiver(e);
                return
            }
            this.setContext('getReceiver')
            if (this.e.msg.includes('群发')) {
                return e.reply('请发送收件人邮箱地址（多个地址请用英文逗号隔开，发送cancel取消操作')
            } else {
                return e.reply('请发送收件人邮箱地址（发送cancel取消操作）');
            }
        } catch (error) {
            logger.error(error);
            e.reply('邮件发送失败，请查看日志');
            return true;
        }
    }

    async getReceiver(e) {
        try {
            if (!isMass) {
                this.finish('getReceiver')
                if (this.e.msg == 'cancel') {
                    e.reply('操作已取消');
                    return true
                }
                receiver = this.e.msg;
            }
            this.setContext('getSubject')
            return e.reply('请发送邮件主题（发送cancel取消操作）');
        } catch (error) {
            logger.error(error);
            e.reply('邮件发送失败，请查看日志');
            return true;
        }
    }

    async getSubject(e) {
        try {
            this.finish('getSubject')
            if (this.e.msg == 'cancel') {
                e.reply('操作已取消');
                return true
            }
            subject = this.e.msg;
            this.setContext('getContent')
            return e.reply('请发送邮件内容（发送cancel取消操作）');
        } catch (error) {
            logger.error(error);
            e.reply('邮件发送失败，请查看日志');
            return true;
        }
    }

    async getContent(e) {
        try {
            this.finish('getContent')
            if (this.e.msg == 'cancel') {
                e.reply('操作已取消');
                return true
            }
            content = this.e.msg;
            e.reply('正在发送邮件，请稍后...')
            if (isMass) {
                const MailSendStatus = await sender.SendMassMail(e, content, subject)
                if (MailSendStatus) {
                    e.reply('邮件发送成功');
                    return true;
                } else {
                    e.reply('邮件发送失败，请查看日志');
                    return true;
                }
            } else {
                const MailSendStatus = await sender.SendMail('custom', content, subject, 'custom.html', receiver);
                if (MailSendStatus) {
                    e.reply('邮件发送成功');
                    return true;
                } else {
                    e.reply('邮件发送失败，请查看日志');
                    return true;
                }
            }
        } catch (error) {
            e.reply('邮件发送失败，请查看日志');
            logger.error(error);
            return true;
        }
    }
}
