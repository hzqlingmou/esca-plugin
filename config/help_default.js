/**
* 请注意，系统不会读取help_default.js ！！！！
* 【请勿直接修改此文件，且可能导致后续冲突】
*
* 如需自定义可将文件【复制】一份，并重命名为 help.js
*
* */

// 帮助配置
export const helpCfg = {
  // 帮助标题
  title: '逸燧插件帮助',

  // 帮助副标题
  subTitle: 'Yunzai-Bot & Esca-Plugin',

  // 帮助表格列数，可选：2-5，默认3
  // 注意：设置列数过多可能导致阅读困难，请参考实际效果进行设置
  colCount: 3,

  // 单列宽度，默认265
  // 注意：过窄可能导致文字有较多换行，请根据实际帮助项设定
  colWidth: 265,

  // 皮肤选择，可多选，或设置为all
  // 皮肤包放置于 resources/help/theme
  // 皮肤名为对应文件夹名
  // theme: 'all', // 设置为全部皮肤
  // theme: ['default','theme2'], // 设置为指定皮肤
  theme: 'all',

  // 排除皮肤：在存在其他皮肤时会忽略该项内设置的皮肤
  // 默认忽略default：即存在其他皮肤时会忽略自带的default皮肤
  // 如希望default皮肤也加入随机池可删除default项
  themeExclude: ['default'],

  // 是否启用背景毛玻璃效果，若渲染遇到问题可设置为false关闭
  bgBlur: true
}

// 帮助菜单内容
export const helpList = [
  {
    group: '查询功能',
    list: [
      {
        icon: 79,
        title: 'e查询备案+<域名>',
        desc: '查询指定域名的备案'
      },
    ]
  },
  {
    group: '合成功能',
    list: [
      {
        icon: 75,
        title: 'e丁真说+<文本>',
        desc: '让丁真说句话叭'
      },
      {
        icon: 80,
        title: 'e手写+<文本（换行用\n）>',
        desc: '模仿手写'
      }
    ]
  },
  {
    group: '随机视频',
    list: [
      {
        icon: 76,
        title: 'e小姐姐',
        desc: '随机小姐姐视频'
      },
      {
        icon: 30,
        title: 'e女大学生',
        desc: '随机女大学生视频'
      },
      {
        icon: 31,
        title: 'e黑丝',
        desc: '随机黑丝视频'
      },
      {
        icon: 32,
        title: 'e白丝',
        desc: '随机白丝视频'
      },
      {
        icon: 33,
        title: 'e狱卒',
        desc: '随机玉足视频'
      },
      {
        icon: 34,
        title: 'e慢摇',
        desc: '随机慢摇视频'
      },
      {
        icon: 35,
        title: 'e吊带',
        desc: '随机吊带视频'
      },
      {
        icon: 36,
        title: 'ecos',
        desc: '随机cos视频'
      },
      {
        icon: 37,
        title: 'e清纯',
        desc: '随机清纯视频'
      },
      {
        icon: 38,
        title: 'e女高',
        desc: '随机女高视频'
      },
      {
        icon: 39,
        title: 'e甜妹',
        desc: '随机甜妹视频'
      },
      {
        icon: 74,
        title: 'e萝莉',
        desc: '随机萝莉视频'
      }
    ]
  },
  {
    group: '随机图片',
    list: [
      {
        icon: 64,
        title: 'e饿了',
        desc: '随机美图'
      },
      {
        icon: 70,
        title: 'e龙图',
        desc: '龙年发龙图'
      },
      {
        icon: 71,
        title: 'e柴郡',
        desc: '可爱的柴郡表情包'
      },
      {
        icon: 23,
        title: 'e小黑子',
        desc: '随机返回cxk表情包'
      }
    ]
  },
  {
    group: '随机文案',
    list: [
      {
        icon: 22,
        title: 'e朋友圈文案',
        desc: '返回一条朋友圈文案'
      }
    ]
  },
  { 
    group: '管理命令，仅管理员可用', 
    auth: 'master', 
    list: [
      { 
        icon: 35, 
        title: 'e更新', 
        desc: '更新逸燧插件' 
      }
    ]
  }
]