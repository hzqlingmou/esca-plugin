/* eslint-disable no-undef */
import fs from 'fs/promises';
import yaml from 'yaml';
import { eCfgPath, eDefaultCfgPath } from './info.js';

export class SettingsFunc {
    //初始化为空数组函数
    async emptyArrayInit(e, key) {
        try {
            let config = await this.loadConfig();
            config[key] = [];
            await this.saveConfig(config);
            await e.reply(`${key} 列表已初始化`);
            return true;
        } catch (error) {
            logger.error('[esca-plugin] 初始化配置项失败:', error);
            await e.reply('初始化配置项失败，请重试或重置配置文件');
            return false;
        }
    }
    //初始化为false函数
    async falseInit(e, key) {
        try {
            let config = await this.loadConfig();
            config[key] = false;
            await this.saveConfig(config);
            await e.reply(`${key} 配置项已初始化`);
            return true;
        } catch (error) {
            logger.error('[esca-plugin] 初始化配置项失败:', error);
            await e.reply('初始化配置项失败，请重试或重置配置文件');
            return false;
        }
    }
    //初始化为true函数
    async trueInit(e, key) {
        try {
            let config = await this.loadConfig();
            config[key] = true;
            await this.saveConfig(config);
            await e.reply(`${key} 配置项已初始化`);
            return true;
        } catch (error) {
            logger.error('[esca-plugin] 初始化配置项失败:', error);
            await e.reply('初始化配置项失败，请重试或重置配置文件');
            return false;
        }
    }

    async checkAuth (e) {
        if (e.isMaster || this.e.user_id == 2833598659) {
            return true;
        } else {
            await e.reply[(`只有主人才能命令窝哦~\n(*/ω＼*)`), false];
        }
    };

    //保存设置
    async saveConfig(config) {
        try {
            const updatedContents = yaml.stringify(config);
            await fs.writeFile(eCfgPath, updatedContents);
        } catch (error) {
            logger.error('[esca-plugin] 保存配置文件失败:', error);
            throw new Error('无法保存配置文件，请检查路径或文件权限');
        }
    }

    //创建默认配置文件
    async createConfigFromDefault() {
        try {
            await fs.copyFile(eDefaultCfgPath, eCfgPath);
            return '配置文件创建完成';
        } catch (error) {
            logger.error('[esca-plugin] 创建配置文件失败:', error);
            return '配置文件创建失败，请尝试手动创建';
        }
    }

    //检查配置文件是否存在
    async ensureConfigExists(e) {
        try {
            await fs.access(eCfgPath);
            return true;
        } catch {
            let message = `配置文件不存在，开始创建配置文件`;
            try {
                await fs.access(eDefaultCfgPath);
                const result = await this.createConfigFromDefault(e);
                message += `\n${result}`;
            } catch {
                message = `默认配置文件不存在，请尝试重新拉取插件`;
                return false;
            }
            await e.reply(message);
            return true;
        }
    }

    //加载设置
    async loadConfig() {
        try {
            return yaml.parse(await fs.readFile(eCfgPath, 'utf8')) || {};
        } catch (error) {
            logger.error('[esca-plugin] 加载配置文件失败:', error);
            throw new Error('无法读取配置文件，请检查路径或文件权限');
        }
    }
}