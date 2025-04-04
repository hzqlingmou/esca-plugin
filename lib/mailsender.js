import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import path from 'path';
import fs from 'fs';
import { eResourcePath } from './info.js';
import { SettingsFunc } from './config.js';

const settings = new SettingsFunc();

export class MailSender {
    async CheckConfig(isCustom) {
        const config = await settings.loadConfig();
        if (!config.mailConfig.isOpen) {
            logger.error('[esca-plugin] 邮件发送功能未开启')
            return false;
        }
        if (config.mailConfig.from == '' && isCustom == false ) {
            logger.error('[esca-plugin] 发件人邮箱未配置')
            return false;
        }
        if (config.mailConfig.to == '') {
            logger.error('[esca-plugin] 收件人邮箱未配置')
            return false;
        }
        if (config.mailConfig.password == '') {
            logger.error('[esca-plugin] 邮箱密码未配置')
            return false;
        }
        if (config.mailConfig.host == '') {
            logger.error('[esca-plugin] 邮箱服务器未配置')
            return false;
        }
        if (!(config.mailConfig.port == 465 || config.mailConfig.port == 587)) {
            logger.error('[esca-plugin] 邮箱服务器端口配置错误')
            return false;
        }
        if (!(config.mailConfig.secure == 'ssl' || config.mailConfig.secure == 'tls')) {
            logger.error(`[esca-plugin] 加密协议配置错误：读取到的值为 ${config.mailConfig.secure}`)
            return false;
        }
        return true;
    }

    /**
     * @param {string} type 
     * @param {string | number} value 
     * @param {string} subject 
     * @param {string} filename 
     * @param {string} receiver
     * @returns 
     */
    async SendMail(type, value, subject, filename, receiver) {
        const config = await settings.loadConfig();
        try {
            // 判断自定义
            let isCustom;
            if (type == 'custom') {
                isCustom = true;
            } else {
                isCustom = false;
                receiver = config.mailConfig.to;
            }
            //检查邮件配置是否正确
            const CheckResult = await this.CheckConfig(isCustom);
            if (CheckResult == false) {
                return false;
            }
            //传参
            const variables = {
                value: value,
                type: type,
                subject: subject
            }
            let secure, requireTLS = false;
            if (config.mailConfig.secure == 'ssl') {
                secure = true;
            } else if (config.mailConfig.secure == 'tls') {
                secure = false;
                requireTLS = true
            }
            //发件服务器鉴权
            const createTransporter = () => {
                return nodemailer.createTransport({
                    host: config.mailConfig.host,
                    port: config.mailConfig.port,
                    secure: secure,
                    requireTLS: requireTLS,
                    auth: {
                        user: config.mailConfig.from,
                        pass: config.mailConfig.password,
                    }
                });
            }
            //编译模板
            const compileTemplate = (variables) => {
                const templatePath = path.join(eResourcePath, 'mail', filename)
                const htmlContent = fs.readFileSync(templatePath, 'utf8')
                return handlebars.compile(htmlContent)(variables)
            }
            const transporter = createTransporter()
            const html = compileTemplate(variables)
            await transporter.sendMail({
                from: config.mailConfig.from,
                to: receiver,
                subject: subject,
                html: html
            })
            return true;
        } catch (error) {
            logger.error(error);
            return false;
        }
    }

    /**
     * @param {e} e //消息支持
     * @param {string} value 
     * @param {string} subject 
     * @returns 
     */
    async SendMassMail(e, value, subject) {
        const config = await settings.loadConfig();
        try {
            //检查邮件配置是否正确
            const CheckResult = await this.CheckConfig(true);
            if (CheckResult == false) {
                return false;
            }
            //检查是否开启群发功能
            if (!(config.massMail.isOpen)) {
                logger.error('[esca-plugin] 群发邮件功能未开启');
                return false;
            }
            //检查收件人列表
            if (!Array.isArray(config.massMail.list) || config.massMail.list.length == 0) {
                logger.error('[esca-plugin] 收件人列表有问题或为空');
                return false;
            }
            //传参
            const variables = {
                value: value,
                subject: subject
            }
            let secure, requireTLS = false;
            if (config.mailConfig.secure == 'ssl') {
                secure = true;
            } else if (config.mailConfig.secure == 'tls') {
                secure = false;
                requireTLS = true
            }
            //发件服务器鉴权
            const createTransporter = () => {
                return nodemailer.createTransport({
                    host: config.mailConfig.host,
                    port: config.mailConfig.port,
                    secure: secure,
                    requireTLS: requireTLS,
                    auth: {
                        user: config.mailConfig.from,
                        pass: config.mailConfig.password,
                    }
                });
            }
            //编译模板
            const compileTemplate = (variables) => {
                const templatePath = path.join(eResourcePath, 'mail', 'custom.html')
                const htmlContent = fs.readFileSync(templatePath, 'utf8')
                return handlebars.compile(htmlContent)(variables)
            }
            const transporter = createTransporter()
            const html = compileTemplate(variables)
            for (let i = 0; i < config.massMail.list.length; i++) {
                await e.reply('正在发送第'+ (i+1) + '封邮件');
                await transporter.sendMail({
                    from: config.mailConfig.from,
                    to: config.massMail.list[i],
                    subject: subject,
                    html: html
                })
                await this.wait(2000);
            }
            return true;
        } catch (error) {
            logger.error(error);
            return false;
        }
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    };
}