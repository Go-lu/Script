/**
 * @name: 茶百道签到任务
 * @author: GOLU
 * @date: 2024-8-6 12:28:16
 * @description：茶百道 签到  变量名：cbd_ck  多账号换行分割
 * @update: 2023/11/29 13:17
 */

/** =================== 依赖、模块引入 =========================== */
const axios = require('axios')
// const send = require("./sendNotify");


/** =================== 全局变量定义，包含持久化配置项 =====================================*/
const globalConfig = {
    // pushPlusToken: "000000000000"
    pushPlusToken: "", // pushPlus的token
    pushPlusUrl: "https://www.pushplus.plus/send",
    sendTitle: "茶百道签到",  // 消息标题
    evnName: "cbd_ck", // 变量名，此处脚本开发者配置，可自定义
    splitMethod: "\n".toString()
}

/** =================== 通用功能块 ========================================================== */
//日志及通知输出模块
let all_message = "";

function notify(content) {
    all_message = all_message + content + "\n";
    console.log(content);
}

//延时函数 await调用
let wait = ms => new Promise(resolve => setTimeout(resolve, ms));

//获取token、oid及uid
function get_msg() {
    // 此处从青龙中获取token, 分割方式根据实际情况修改
    return process.env.globalConfig['evnName'].split(globalConfig.splitMethod);
}

/**
 * 发送通知
 * @param title // 通知标题
 * @param content // 通知内容
 * @param url // 通知url
 * @param desp // 通知描述
 * @param retryTime // 重试计数，自传，递归计数
 * @returns {Promise<void>}
 */
const send = async (title, content, url, desp, retryTime = 0) => {
    console.log("\n\n === 开始发送通知 ===")
    try {
        let res = axios.post(globalConfig.pushPlusUrl, {
            "token": globalConfig.pushPlusToken,
            "title": title,
            "content": content
        });
        console.log("✅发送通知成功！");
    } catch (err) {
        console.log(`\n\n❌通知发送失败，三秒后重试，已重试 [${retryTime}] 次`)
        if (retryTime < 5) {
            // 在重试之前稍作延迟
            await wait(3000);
            // 递归调用，增加重试次数
            return await send(title, content, url, desp, retryTime + 1);
        } else {
            // 达到最大重试次数后记录最终错误
            console.log("❌发送通知失败，原因：");
            console.log(err);
        }
    }
}

/** ====================== 请求逻辑开始 ================================= */
// 请求体，由于较为统一，此处抽离处理
/**
 * @name: 请求体
 * @param {*} action
 * @returns {*}
 */
const data = action => JSON.stringify({
    "id": "",
    "businessId": "SQxnxCl0THUq",
    "activityJoinSource": action,
    "shopId": -1
})

// 请求头传入token，Axios请求配置较为统一，此处抽离处理
/**
 * @name: 请求头
 * @param {*} token
 * @param action // 活动id
 * @returns {*}
 * @description 此处请求仅为模板，实际使用中根据实际情况修改
 */
const config = (token, action) => {
    return {
        method: 'post',
        url: 'https://md-h5-gateway.shuxinyc.com/marketing/minip/activity/join/signIn',
        headers: {
            "Host": "md-h5-gateway.shuxinyc.com",
            "Connection": "keep-alive",
            "Content-Length": "72",
            "CSESSION": token,
            "xweb_xhr": "1",
            "versionCode": "33340",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090b13)XWEB/11065",
            "versionName": "3.3.340",
            "Content-Type": "application/json",
            "Accept": "*/*",
            "Sec-Fetch-Site": "cross-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            "Referer": "https://servicewechat.com/wx2804355dbf8d15c3/750/page-frame.html",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9"
        },
        data: data(action)
    }
}


/**
 * 主函数
 * @returns {Promise<void>}
 */
const run = async () => {
    // 获取token列表
    let tokenList = get_msg();

    if (tokenList.length <= 0) {
        notify("请先配置token!");
        return;
    }

    // 遍历token列表 并发起请求
    for (const token of tokenList) {
        const index = tokenList.indexOf(token)
        notify(`\n\n开始执行第 [${index + 1}] 个token:: ${token}`);

        // 签到处理
        await signed(index, token);
    }

}

/** ==================== 实际功能点 ============================ */
/**
 * 签到
 * @param index // 第几个token
 * @param token // token
 * @param retryTime // 重试计数，自传，递归计数
 * @returns {Promise<void>}
 */
const signed = async (index, token, retryTime = 0) => {
    notify(`\n\n第 [${index + 1}] 个token:: ${token} 开始签到`);

    try {
        let resp = await axios(config(token, 0));

        if (resp.data.data['activityPush'].code === 0) {
            notify(`\n✅第 [${index + 1}] 个token:: ${token} 签到成功`);
        } else {
            notify(`\n❎第 [${index + 1}] 个token:: ${token} --> ${resp.data.data['activityPush'].message}`);
        }
    } catch (error) {
        console.log(`\n❌第 [${index + 1}] 个token:: ${token} 签到失败，三秒后重试，已重试 [${retryTime}] 次`);

        if (retryTime < 5) {
            // 在重试之前稍作延迟
            await wait(3000);
            // 递归调用，增加重试次数
            await signed(index, token, retryTime + 1);
        } else {
            // 达到最大重试次数后记录最终错误
            notify(`\n❌第 [${index + 1}] 个token:: ${token} 签到最终失败`);
            console.log(error);
        }
    }
};

// run().then();

try {
    run().then(() => {
        send(globalConfig.sendTitle, all_message, '', "\n\n本通知 By GooLucky").then();
    });
} catch (e) {
    console.log("执行失败！原因：\n")
    console.log(e)
}

