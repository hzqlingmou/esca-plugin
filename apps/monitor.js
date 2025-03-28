import plugin from '../../../lib/plugins/plugin.js';
import { MailSender } from '../lib/mailsender.js';
import { SettingsFunc } from '../lib/config.js';

const sender = new MailSender();
const settings = new SettingsFunc();

const config = await settings.loadConfig();

export class esca_monitor extends plugin {
    constructor() {
        super({
            name: 'esca_monitor',
            dsc: '逸燧监控',
            event: 'message',
            priority: 5000,
        });

        this.task = {
            name: 'esca_monitor',
            fnc: () => this.start(),
            cron: config.monitorConfig.interval,
        }
    }

    async start() {
        if (config.monitorConfig.isOpen.cpu) {
            
        }
        return true;
    }

}