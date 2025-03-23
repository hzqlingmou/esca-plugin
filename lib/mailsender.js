import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import path from 'path';
import fs from 'fs';
import { name, eResourcePath } from './info.js';
import { SettingsFunc } from './config.js';
import e from 'express';

const settings = new SettingsFunc();
const config = await settings.loadConfig();

export class MailSender {
    async CheckConfig() {
        if (!config.mailConfig.isOpen) {
            logger.error('[esca-plugin] 邮件发送功能未开启')
            return false;
        }
        if (config.mailConfig.from == '') {
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
     * 
     * @param {e} e 
     * @param {string} type 
     * @param {string | number} value 
     * @param {string} subject 
     * @param {string} filename 
     * @returns 
     */
    async SendMail(e, type, value, subject, filename ) {
        try {
            const CheckResult = await this.CheckConfig(e);
            if (CheckResult == false) {
                return false;
            }
            const variables = {
                value: value,
                name: name,
                type: type
            }
            let secure, requireTLS = false;
            if (config.mailConfig.secure == 'ssl') {
                secure = true;
            } else if (config.mailConfig.secure == 'tls') {
                secure = false;
                requireTLS = true
            }
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
            const compileTemplate = (variables) => {
                const templatePath = path.join(eResourcePath, 'mail' , filename)
                const htmlContent = fs.readFileSync(templatePath, 'utf8')
                return handlebars.compile(htmlContent)(variables)
            }
            const transporter = createTransporter()
            const html = compileTemplate(variables)
            await transporter.sendMail({
                from: config.mailConfig.from,
                to: config.mailConfig.to,
                subject: subject,
                html: html
            })
            return true;
        } catch (error) {
            logger.error(error);
            return false;
        }
    }
}