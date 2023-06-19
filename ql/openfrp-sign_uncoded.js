/**
 * openFrp签到
 * 环境变量填入 变量名称 ofrp 账号-密码  例：1234567@qq.com-pwd1234
 * 多账号-- 使用回车或 & 分割账号  
 * 例1 123@qq.com-pwd123&456@qq.com-pwd456
 * 例2 123@qq.com-pwd123
 *     456@qq.com-pwd456
 *  
 * cron 11 12 * * *
 * **/

const axios = require('axios');
const send = require("./sendNotify");
// const fs = require("fs")
let all_message = "";

//日志及通知输出模块
async function notify(content){
    all_message = all_message + content + "\n";
    console.log(content);
}

//延时函数 await调用
let wait = ms => new Promise(resolve => setTimeout(resolve, ms));

//获取账号密码
async function get_accounts() {
    let accounts = process.env.ofrp;
    if (accounts.indexOf('\n')!==-1) {
        return accounts.split('\n');
    } else if (accounts.indexOf('&') !== -1) {
        return accounts.split('&');
    } else {
        return [accounts];
    }
    // return process.env.bjqcToken.split("\n");
}

// 获取session和authorization参数的函数
async function getSessionAndAuthorization(usr, pwd) {
    const response = await axios.post(
        'https://console.openfrp.net/web/user/login',
        {
            user: usr,
            password: pwd,
        },
        {
            headers: {
                'Host': 'console.openfrp.net',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
                'Accept-Encoding': 'gzip, deflate, br',
                'Content-Type': 'application/json',
                // 'Content-Length': '51',
                'Origin': 'https://console.openfrp.net',
                'Connection': 'keep-alive',
                'Referer': 'https://console.openfrp.net/login',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'TE': 'trailers',
            },
        }
    );
    return {
        msg: response.data.msg,
        session: response.data.data,
        authorization: response.headers.authorization,
    };
}

// 签到的函数
async function userSign(session, authorization) {
    const response = await axios.post(
        'https://console.openfrp.net/web/frp/api/userSign',
        {
            session: session,
        },
        {
            headers: {
                'Host': 'console.openfrp.net',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
                'Accept-Encoding': 'gzip, deflate, br',
                'Content-Type': 'application/json',
                'Authorization': authorization,
                // 'Content-Length': '46',
                'Origin': 'https://console.openfrp.net',
                'Connection': 'keep-alive',
                'Referer': 'https://console.openfrp.net/home/user',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'TE': 'trailers',
            },
        }
    );
    return response.data.data;
}


async function run() {
    let accounts_arr = await get_accounts();
    await notify("检测到 " + accounts_arr.length + " 个账号····");
    for (let i = 0; i < accounts_arr.length; i++){
        await notify("\n🚩------开始运行第 " + (i + 1) + " 个账号-------");
        let user = accounts_arr[i].split('-')[0];
        let pwd = accounts_arr[i].split('-')[1];
        const { msg, session, authorization } = await getSessionAndAuthorization(user, pwd);
        if (msg.indexOf("登录成功") !== -1) {
            await notify("\n✅登录成功！开始签到···");
            const result = await userSign(session, authorization);
            if (result.indexOf("成功")!== -1) {
                await notify(`\n✅${result}`);
            }else {
                await notify("\n❌签到失败！原因：" + result);
            }
            if ((i+1) < accounts_arr.length) {
                console.log("\n-------休息三秒开始下一个账号-------")
                await wait(3000);
            }
        } else {
            await notify("\n❌登录失败！msg:" + msg);
            return;
        }
    }
}

// 主函数
(async () => {
    try {
        await run();
        await send.sendNotify("OpenFrp签到", all_message, '', "\n\n本通知 By GooLucky");
        return;
    } catch (error) {
        console.error(error);
        return;
    }
})();
