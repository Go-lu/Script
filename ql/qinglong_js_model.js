/**
 * @name: xxx任务
 * @author: GOLU
 * @date: 2024-8-6 12:28:16
 * @description：xxx 签到
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
    sendTitle: "",  // 消息标题
    evnName: "", // 变量名，可自定义
    splitMethod: "\n".toString() // 分割方式，可自定义
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
 * @name: Axios请求配置
 * @param {*} action
 * @returns {*}
 */
const data = action => JSON.stringify({
    "id": "",
    "businessId": "SQxnxCl0THUq",
    "activityJoinSource": action,
    "shopId": -1
})

// 请求头传入token，Axios请求较为统一，此处抽离处理
/**
 * @name: 请求头
 * @param {*} token
 * @param action
 * @returns {*}
 * @description 此处请求仅为模板，实际使用中根据实际情况修改
 */
const config = (token, action) => {
    return {
        method: 'post',
        url: 'https://mimeng.feichi.cn/graphql',
        headers: {
            'Content-Length': '618',
            'x-provider-id': 'x9939a74ee8a8522a',
            'Authorization': `Bearer ${token}`,
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.43(0x18002b2e) NetType/4G Language/zh_TW',
            'Referer': 'https://servicewechat.com/wx9939a74ee8a8522a/13/page-frame.html',
            'Host': 'mimeng.feichi.cn',
            'Content-Type': 'application/json'
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

        // .... 此处已取出并遍历了token，此处可做业务逻辑处理
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
        let resp = await axios(config(token, 1));

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

