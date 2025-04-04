/* eslint-disable no-undef */
import fs from 'node:fs/promises';
import chalk from 'chalk';
import path from "path"
import { name, version, eCfgPath, eDefaultCfgPath } from './lib/info.js';
let AppName = "esca-plugin";
const moduleCache = new Map()
let loadedFilesCount = 0
let loadedFilesCounterr = 0
let apps
const startTime = Date.now()
try {
  await fs.access(eCfgPath)
} catch (error) {
  await fs.copyFile(eDefaultCfgPath, eCfgPath)
}
const { apps: loadedApps, loadedFilesCount: count, loadedFilesCounterr: counterr } = await appsOut({ AppsName: "apps" })
const endTime = Date.now()
apps = loadedApps
loadedFilesCount = count
loadedFilesCounterr = counterr
logger.info(chalk.bgGreen(`${name} ${version} 开始加载`))
logger.info(chalk.blue('⣿⣿⣿⠟⠛⠛⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⢋⣩⣉⢻'))
logger.info(chalk.blue('⣿⣿⣿⠀⣿⣶⣕⣈⠹⠿⠿⠿⠿⠟⠛⣛⢋⣰⠣⣿⣿⠀⣿'))
logger.info(chalk.blue('⣿⣿⣿⡀⣿⣿⣿⣧⢻⣿⣶⣷⣿⣿⣿⣿⣿⣿⠿⠶⡝⠀⣿'))
logger.info(chalk.blue('⣿⣿⣿⣷⠘⣿⣿⣿⢏⣿⣿⣋⣀⣈⣻⣿⣿⣷⣤⣤⣿⡐⢿'))
logger.info(chalk.blue('⣿⣿⣿⣿⣆⢩⣝⣫⣾⣿⣿⣿⣿⡟⠿⠿⠦⠀⠸⠿⣻⣿⡄⢻'))
logger.info(chalk.blue('⣿⣿⣿⣿⣿⡄⢻⣿⣿⣿⣿⣿⣿⣿⣿⣶⣶⣾⣿⣿⣿⣿⠇⣼'))
logger.info(chalk.blue('⣿⣿⣿⣿⣿⣿⡄⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⣰'))
logger.info(chalk.blue('⣿⣿⣿⣿⣿⣿⠇⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢀⣿'))
logger.info(chalk.blue('⣿⣿⣿⣿⣿⠏⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿'))
logger.info(chalk.blue('⣿⣿⣿⣿⠟⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⣿'))
logger.info(chalk.blue('⣿⣿⣿⠋⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⣿'))
logger.info(chalk.blue('⣿⣿⠋⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⢸'))
logger.info(chalk.bgGreen(`${name} ${version} 载入完成`))
logger.info(chalk.blue(`共加载了 ${loadedFilesCount} 个插件文件`))
if (loadedFilesCounterr > 0) {
  logger.info(chalk.red(`${loadedFilesCounterr} 个失败`))
}
logger.info(chalk.blue(`耗时 ${endTime - startTime} 毫秒`))
logger.info(chalk.blue(`发送'e帮助'获取指令`))
logger.info(chalk.blue(`---------------------`));
export { apps }
async function appsOut({ AppsName }) {
  const firstName = path.join('plugins', AppName);
  const filepath = path.resolve(firstName, AppsName);
  let loadedFilesCount = 0;
  let loadedFilesCounterr = 0;
  const apps = {};

  try {
    const jsFilePaths = await traverseDirectory(filepath);
    await Promise.all(jsFilePaths.map(async (item) => {
      try {
        const allExport = moduleCache.has(item)
          ? moduleCache.get(item)
          : await import(`file://${item}`);

        for (const key of Object.keys(allExport)) {
          if (typeof allExport[key] === 'function' && allExport[key].prototype) {
            let className = key;
            if (Object.prototype.hasOwnProperty.call(apps, className)) {
              let counter = 1;
              while (Object.prototype.hasOwnProperty.call(apps, `${className}_${counter}`)) {
                counter++;
              }
              className = `${className}_${counter}`;
              logger.info(`[esca-plugin] 类名 ${key} 重命名为 ${className} : ${item}`);
            }
            apps[className] = allExport[key];
            loadedFilesCount++;
          }
        }
      } catch (error) {
        logger.error(`[esca-plugin] 加载 ${item} 文件失败: ${error.message}`);
        loadedFilesCounterr++;
      }
    }));
  } catch (error) {
    logger.error('[esca-plugin] 读取插件目录失败:', error.message);
  }

  return { apps, loadedFilesCount, loadedFilesCounterr };
}


async function traverseDirectory(dir) {
  try {
    const files = await fs.readdir(dir, { withFileTypes: true })
    const jsFiles = []
    for await (const file of files) {
      const pathname = path.join(dir, file.name)
      if (file.isDirectory()) {
        jsFiles.push(...await traverseDirectory(pathname))
      } else if (file.name.endsWith(".js")) {
        jsFiles.push(pathname)
      }
    }
    return jsFiles
  } catch (error) {
    logger.error("[esca-plugin] 读取插件目录失败:", error.message)
    return []
  }
}
