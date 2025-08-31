/*
* 此配置文件为系统使用，请勿修改，否则可能无法正常使用
*
* 如需自定义配置请复制修改上一级help_default.js
*
* */
export const helpCfg = {
  title: '逸燧插件帮助',
  subTitle: 'TRSS-Yunzai && Esca-Plugin',
  columnCount: 3,
  colWidth: 265,
  theme: 'all',
  themeExclude: ['default'],
  style: {
    fontColor: '#ceb78b',
    descColor: '#eee',
    contBgColor: 'rgba(6, 21, 31, .5)',
    contBgBlur: 3,
    headerBgColor: 'rgba(6, 21, 31, .4)',
    rowBgColor1: 'rgba(6, 21, 31, .2)',
    rowBgColor2: 'rgba(6, 21, 31, .35)'
  }
}

export const helpList = [
  {
    "group": '查询功能',
    "list": [
      {
        "icon": 79,
        "title": 'e查询备案+<域名>',
        "desc": '查询指定域名的备案'
      },
      {
        "icon": 53,
        "title": 'e火车票[城市]到[城市]',
        "desc": '查询火车票'
      }
    ]
  },
  {
    group: '邮件功能',
    list: [
      {
        icon: 27,
        title: 'e发送邮件',
        desc: '发送自定义邮件'
      },
      {
        icon: 28,
        title: 'e邮件测试',
        desc: '测试邮件发送功能'
      }
    ]
  },
  {
    group: '合成功能',
    list: [
      {
        icon: 80,
        title: 'e手写+<文本（换行用“下斜杠n”）>',
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
        icon: 67,
        title: 'esese',
        desc: '少儿不宜，少冲延年益寿'
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
        icon: 24,
        title: 'e兽猫',
        desc: '返回兽猫酱表情包'
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
    group: '管理命令，仅管理员可用（请使用“锅巴插件”配置插件选项）', 
    auth: 'master', 
    list: [
      { 
        icon: 35, 
        title: 'e更新', 
        desc: '更新逸燧插件' 
      },
    ]
  }
]
export const isSys = true
