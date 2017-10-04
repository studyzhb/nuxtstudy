let { resolve } = require('path');

let r = (url) => resolve(__dirname, url);

let baseLogPath = r('../logs');

//错误日志目录名
let errorPath = '/error';
let errorFileName = 'error';
let errorLogPath = baseLogPath + errorPath + '/' + errorFileName;

//响应日志
let responsePath = '/response';
let responseFileName = 'response';
let responseLogPath = baseLogPath + responsePath + '/' + responseFileName;

// module.exports = {
//     "appenders": [
//         {
//             "category": "errorLogger",             //logger名称
//             "type": "dateFile",                   //日志类型
//             "filename": errorLogPath,             //日志输出位置
//             "alwaysIncludePattern": true,          //是否总是有后缀名
//             "pattern": "-yyyy-MM-dd-hh.log",      //后缀，每小时创建一个新的日志文件
//             "path": errorPath                     //自定义属性，错误日志的根目录
//         },
//         {
//             "category": "resLogger",             //logger名称
//             "type": "dateFile",                   //日志类型
//             "filename": responseLogPath,             //日志输出位置
//             "alwaysIncludePattern": true,          //是否总是有后缀名
//             "pattern": "-yyyy-MM-dd-hh.log",      //后缀，每小时创建一个新的日志文件
//             "path": responsePath                     //自定义属性，错误日志的根目录
//         }
//     ],
//     "levels": {
//         'errorLogger': 'ERROR',
//         'resLogger': 'ALL'
//     },
//     "baseLogPath": baseLogPath
// }

module.exports = {
    appenders: {
        errorLogger: {
            type: 'file',
            filename: errorLogPath,
            "alwaysIncludePattern": true,          //是否总是有后缀名
            "pattern": "-yyyy-MM-dd-hh.log",      //后缀，每小时创建一个新的日志文件
            "path": errorPath
        },
        resLogger: {
            type: 'file',
            filename: responseLogPath,
            "alwaysIncludePattern": true,          //是否总是有后缀名
            "pattern": "-yyyy-MM-dd-hh.log",      //后缀，每小时创建一个新的日志文件
            "path": responsePath
        }
    },
    categories: {
        errorLogger: { appenders: ['errorLogger'], level: 'error' },
        resLogger: { appenders: ['resLogger'], level: 'ALL' },
        default: { appenders: ['errorLogger', 'resLogger'], level: 'trace' }
    },
    "baseLogPath": baseLogPath
}
