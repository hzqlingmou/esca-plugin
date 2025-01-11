import plugin from '../../../lib/plugins/plugin.js';
import fs from 'fs/promises'; 
import yaml from 'js-yaml';
import path from "path";

let AppName = "esca-plugin";
const firstName = path.join('plugins', AppName);
const eCfgPath = path.resolve(firstName, 'config', 'config','config.yaml');
const eDefaultCfgPath = path.resolve(firstName, 'config','default_config', 'config.yaml');

export { eCfgPath, eDefaultCfgPath };

const checkAuth = async function (e) {
    if (!e.isMaster) {
        await e.reply(`只有主人才能命令窝哦~\n(*/ω＼*)`);
        return false;
    }
    return true;
};

export class esca_admin extends plugin {
    constructor() {
        super({
            name: '逸燧插件设置',
            dsc: 'esca-others',
            event: 'message',
            priority: -114514,
            rule: [
                {
                    reg: '^esese切换$',
                    fnc: 'eChange'
                },
                {
                    reg: '^e重置设置$',
                    fnc: 'eReset'
                }
            ]
        });
    }

    async loadConfig() {
        try {
            const fileContents = await fs.readFile(eCfgPath, 'utf8');
            return yaml.load(fileContents);
        } catch (error) {
            logger.error('[esca-plugin] 加载配置文件失败:', error);
            throw new Error('无法读取配置文件，请检查路径或文件权限');
        }
    }

    async saveConfig(config) {
        try {
            const updatedContents = yaml.dump(config);
            await fs.writeFile(eCfgPath, updatedContents);
        } catch (error) {
            logger.error('[esca-plugin] 保存配置文件失败:', error);
            throw new Error('无法保存配置文件，请检查路径或文件权限');
        }
    }

    async createConfigFromDefault() {
        try {
            await fs.copyFile(eDefaultCfgPath, eCfgPath);
            return '配置文件创建完成';
        } catch (error) {
            logger.error('[esca-plugin] 创建配置文件失败:', error);
            return '配置文件创建失败，请尝试手动创建';
        }
    }

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

    async toggleEsese(e) {
        try {
            let config = await this.loadConfig();

            // 切换 esese 的值
            if (typeof config.esese === 'boolean') {
                config.esese = !config.esese;
                await this.saveConfig(config);
                await e.reply(`涩涩功能已${config.esese ? '开启' : '关闭'}`);
            } else {
                await e.reply('esese 配置变量类错误，请使用“e重置设置”刷新配置文件');
            }
        } catch (error) {
            logger.error('[esca-plugin] 切换配置项失败:', error);
            await e.reply('修改配置错误，请重试或重置配置文件');
        }
    }

    async eChange(e) {
        // 检查主人权限
        if (!await checkAuth(e)) {
            return true;
        }

        // 确保配置文件存在
        if (!await this.ensureConfigExists(e)) {
            return true;
        }

        // 尝试切换 esese 配置项
        await this.toggleEsese(e);

        return true;
    }

    async eReset(e) {
        // 检查主人权限
        if (!await checkAuth(e)) {
            return true;
        }

        // 确保配置文件存在
        if (!await this.ensureConfigExists(e)) {
            return true;
        }

        // 尝试重置配置文件
        try {
            await fs.copyFile(eDefaultCfgPath, eCfgPath);
            await e.reply('配置文件已重置');
        } catch (error) {
            logger.error('[esca-plugin] 重置配置文件失败:', error);
            await e.reply('重置配置文件失败，请检查文件目录权限后尝试手动重置');
        }
    }
}