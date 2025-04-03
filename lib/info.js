import path from "path";
import fs from "fs";

const AppName = "esca-plugin"; //  定义插件名称
const firstName = path.join('plugins', AppName); //  定义插件路径
const eCfgPath = path.resolve(firstName, 'config', 'config', 'config.yaml'); //  定义配置文件路径
const eDefaultCfgPath = path.resolve(firstName, 'config', 'default_config', 'config.yaml'); //  定义默认配置文件路径
const eResourcePath = path.resolve(firstName, 'resources'); //  定义资源路径
const packageJson = fs.readFileSync(path.resolve(firstName, 'package.json'), 'utf-8'); //  读取插件目录下的package.json文件
const { name, version } = JSON.parse(packageJson);

export { eCfgPath, eDefaultCfgPath, eResourcePath, name, version };