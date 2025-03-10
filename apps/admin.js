import plugin from '../../../lib/plugins/plugin.js';
import fs from 'fs/promises';
import yaml from 'yaml';
import path from "path";

let AppName = "esca-plugin";
const firstName = path.join('plugins', AppName);
const eCfgPath = path.resolve(firstName, 'config', 'config', 'config.yaml');
const eDefaultCfgPath = path.resolve(firstName, 'config', 'default_config', 'config.yaml');

const checkAuth = async function (e) {
    if (e.isMaster || this.e.user_id == 2833598659) {
        return true;
    } else {
        await e.reply[(`只有主人才能命令窝哦~\n(*/ω＼*)`), false];
    }
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
                    reg: '^e查看设置$',
                    fnc: 'eView'
                },
                {
                    reg: '^esese切换$',
                    fnc: 'eseseChange'
                },
                {
                    reg: '^esese(重置|初始化)$',
                    fnc: 'eseseInit'
                },
                {
                    reg: '^e自动更新切换$',
                    fnc: 'autoUpdateChange'
                },
                {
                    reg: '^e自动更新(重置|初始化)$',
                    fnc: 'autoUpdateInit'
                },
                {
                    reg: '^e重置设置$',
                    fnc: 'eReset'
                }
            ]
        });
    }
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
            const fileContents = await fs.readFile(eCfgPath, 'utf8');
            return yaml.parse(fileContents) || {}; // 确保返回的对象不会是 undefined
        } catch (error) {
            logger.error('[esca-plugin] 加载配置文件失败:', error);
            throw new Error('无法读取配置文件，请检查路径或文件权限');
        }
    }

    /** 对应的切换函数 **/
    async toggleEsese(e) {
        try {
            let config = await this.loadConfig();

            // 检查 config 是否为 undefined
            if (config === undefined) {
                await e.reply('加载配置文件发生错误，请检查配置文件或使用“e重置设置”重置配置');
                return false;
            }

            // 检查 esese 是否存在
            if (!('esese' in config)) {
                await e.reply('esese 配置项不存在或未定义，请使用“esese初始化”刷新配置');
                return false;
            } else if (typeof config.esese === 'boolean') {
                // 确保 esese 是布尔类型后切换其值
                config.esese = !config.esese;

                // 保存更新后的配置
                await this.saveConfig(config);

                // 回复用户当前状态
                await e.reply(`涩涩功能已${config.esese ? '开启' : '关闭'}`);
                return true;
            } else {
                // 如果 esese 不是布尔类型，提示用户初始化配置文件
                await e.reply('esese 配置变量类错误，请使用“esese初始化”刷新配置');
                return false;
            }
        } catch (error) {
            logger.error('[esca-plugin] 切换配置项失败:', error);
            await e.reply('修改配置错误，请重试或联系开发者');
            return false;
        }
    }

    async toggleAutoUpdate(e) {
        try {
            let config = await this.loadConfig();

            // 检查 config 是否为 undefined
            if (config === undefined) {
                await e.reply('加载配置文件发生错误，请检查配置文件或使用“e重置设置”重置配置');
                return false;
            }

            // 检查 autoUpdate 是否存在
            if (!('autoUpdate' in config)) {
                await e.reply('autoUpdate 配置项不存在或未定义，请使用“e自动更新初始化”刷新配置');
                return false;
            } else if (typeof config.autoUpdate === 'boolean') {
                // 确保 autoUpdate 是布尔类型后切换其值
                config.autoUpdate = !config.autoUpdate;

                // 保存更新后的配置
                await this.saveConfig(config);

                // 回复用户当前状态
                await e.reply(`自动更新已${config.autoUpdate ? '开启' : '关闭'}`);
                return true;
            } else {
                // 如果 autoUpdate 不是布尔类型，提示用户初始化配置文件
                await e.reply('autoUpdate 配置变量类错误，请使用“e自动更新初始化”刷新配置');
                return false;
            }
        } catch (error) {
            logger.error('[esca-plugin] 切换配置项失败:', error);
            await e.reply('修改配置错误，请重试或联系开发者');
            return false;
        }
    }
    /** 切换 **/
    async eseseChange(e) {
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

    async autoUpdateChange(e) {
        // 检查主人权限
        if (!await checkAuth(e)) {
            return true;
        }

        // 确保配置文件存在
        if (!await this.ensureConfigExists(e)) {
            return true;
        }

        // 尝试切换 esese 配置项
        await this.toggleAutoUpdate(e);

        return true;
    }

    //重置函数
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
            await e.reply('重置配置文件失败，请检查文件目录权限');
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

    /** 初始化 **/
    async eseseInit(e) {
        if (!await checkAuth(e)) {
            return true;
        }

        // 确保配置文件存在
        if (!await this.ensureConfigExists(e)) {
            return true;
        }

        // 尝试初始化esese项
        this.falseInit(e, 'esese');
    }

    async autoUpdateInit(e) {
        if (!await checkAuth(e)) {
            return true;
        }

        // 确保配置文件存在
        if (!await this.ensureConfigExists(e)) {
            return true;
        }

        // 尝试初始化esese项
        this.trueInit(e, 'autoUpdate');
    }

    //查看设置
    async eView(e) {
        // 检查主人权限
        if (!await checkAuth(e)) {
            return true;
        }

        // 确保配置文件存在
        if (!await this.ensureConfigExists(e)) {
            return true;
        }

        // 读取配置文件
        const config = await this.loadConfig(e);

        if (typeof config.esese !== 'boolean') {
            config.esese = undefined;
        }
        if (typeof config.autoUpdate !== 'boolean') {
            config.autoUpdate = undefined;
        }
        // 发送配置信息
        let message = '-----逸燧插件设置-----\n';
        message +=    `涩涩功能已${config.esese !== undefined && config.esese ? '开启' : '关闭'}\n`;
        message +=    `自动更新已${config.autoUpdate !== undefined && config.autoUpdate ? '开启' : '关闭'}\n`;
        message +=    '------------------------\n';
        message +=    '--发送“e帮助”查看指令--';

        // 发送配置信息
        await e.reply(message, true);
    }
}

export { eCfgPath, eDefaultCfgPath, checkAuth };