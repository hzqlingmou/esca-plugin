import { logger } from 'handlebars';
import os from 'os';

export class getState {
    async getMemory() {
        try {
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usage = parseFloat(((1 - freeMem / totalMem) * 100).toFixed(2));            return usage;
        } catch (error) {
            logger.error('获取内存信息失败', error);
            return false;
        }
    }

    async getCpu() {
        try {
            const start = os.sumCpuTimes(os.cpus());

            await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒

            // 第二次采样
            const end = os.sumCpuTimes(os.cpus());

            // 计算整体使用率
            const totalDiff = end.total - start.total;
            const idleDiff = end.idle - start.idle;
            const usage = parseFloat(((totalDiff - idleDiff) / totalDiff * 100).toFixed(2));
            return usage;
        } catch (error) {
            logger.error('获取CPU信息失败', error);
            return false;
        }
    }
}