import fs from 'node:fs/promises';
import chalk from 'chalk';
import path from "path"
import { Version } from './components/index.js';
import { eCfgPath, eDefaultCfgPath } from './apps/admin.js';
import yaml from 'js-yaml';
let AppName = "esca-plugin";
const moduleCache = new Map()
let loadedFilesCount = 0
let loadedFilesCounterr = 0
let apps
const startTime = Date.now()
const configStatus = await configInit()
const { apps: loadedApps, loadedFilesCount: count, loadedFilesCounterr: counterr } = await appsOut({ AppsName: "apps" })
const endTime = Date.now()
apps = loadedApps
loadedFilesCount = count
loadedFilesCounterr = counterr
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
logger.info(chalk.blue(`逸燧插件${Version.version}载入成功`))
logger.info(chalk.blue(`共加载了 ${loadedFilesCount} 个插件文件`))
logger.info(chalk.red(`${loadedFilesCounterr} 个失败`))
logger.info(chalk.blue(`耗时 ${endTime - startTime} 毫秒`))
logger.info(chalk.blue(`发送e帮助获取指令`))
logger.info(chalk.blue(`---------------------`));
export { apps, configStatus }
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

async function configInit() {
  let config = {};
  let checkFile = false;
  let checkDefaultFile = false;
  try {
    await fs.access(eCfgPath);
    checkFile = true;
  } catch (error) {
    logger.info(chalk.red("[esca-plugin] 配置文件不存在，开始创建配置文件"));
    try {
      await fs.access(eDefaultCfgPath);
      checkDefaultFile = true;
    } catch (error) {
      logger.info(chalk.red("[esca-plugin] 默认配置文件不存在或无权限，请尝试重新拉取插件"), error);
    }
  }

  if (checkFile == true) {
    //开始读取配置文件
    try { config = yaml.load(await fs.readFile(eCfgPath, 'utf-8')); } catch (error) {
      logger.error('[esca-plugin] 读取配置文件失败，请检查权限', error)
      return false;
    };
    //开始检查配置文件
    if (config == undefined) {
      config = {};
    }
    if (!('esese' in config) || typeof 'esese' != 'boolean') {
      config.esese = false;
    }
    if (!('autoUpdate' in config) || typeof 'autoUpdate' != 'boolean') {
      config.autoUpdate = true;
    }
    try {
      const updatedContents = yaml.dump(config);
      await fs.writeFile(eCfgPath, updatedContents);
    } catch (error) {
      logger.error('[esca-plugin] 保存配置文件失败:', error);
    }
    return true;
  } else if (checkFile == false) {
    if (checkDefaultFile == true) {
      try {
        await fs.copyFile(eDefaultCfgPath, eCfgPath);
        logger.info(chalk.green("[esca-plugin] 配置文件创建成功"));
        return true;
      } catch (error) {
        logger.error('[esca-plugin] 创建配置文件失败', error);
        return false;
      }
    }
  }
}