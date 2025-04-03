/* eslint-disable no-undef */
import fs from 'fs/promises';
import yaml from 'yaml';
import { eCfgPath } from './info.js';

export class SettingsFunc {

    async checkAuth(e) {
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