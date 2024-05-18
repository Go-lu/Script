/**
 * @name: 米萌岛任务
 * @author: GOLU
 * @date: 2023/11/29 13:17
 * @description：米萌岛 签到 看视频任务
 * @update: 2023/11/29 13:17
 */
const axios = require('axios')
// const send = require("./sendNotify");


const globalConfig = {
    // pushPlusToken: "000000000000"
    pushPlusToken: "",
    pushPlusUrl: "https://www.pushplus.plus/send",
}

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
    return process.env.mimenToken.split("\n");
}

// action为活动id， 1签到 2看视频
const data = action => JSON.stringify({
    "query": "\n                        mutation activity($activity_id: Int!) {\n                            activityPush(id: $activity_id) {\n                                code\n                                message\n                                reward_log {\n                                    action\n                                    reward_type\n                                    amount\n                                    balance\n                                }\n                            }\n                        }\n                    ",
    "variables": {
        "activity_id": action
    },
    "operationName": "activity"
})

// 请求头 传入token
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
    lab:for (const token of tokenList) {
        const index = tokenList.indexOf(token)
        notify(`\n\n开始执行第 [${index + 1}] 个token:: ${token}`);

        // 签到
        await signed(index, token);

        // 等待60秒
        await wait(60000);

        // 看视频3次
        for (let i = 0; i < 3; i++) {
            // 看广告
            if (await watchAD(index, token, i) === 'ok') continue lab;
        }

    }

}

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

const watchAD = async (index, token, i, retryTime = 0) => {
    notify(`\n\n第 [${index + 1}] 个token:: ${token} 开始看视频第 [${i + 1}] 次`);
    try {
        let res = await axios(config(token, 2));

        if (res.data.data['activityPush'].code === 0) {
            notify(`\n✅第 [${index + 1}] 个token:: ${token} 观看视频成功`);
        } else {
            notify(`\n❎第 [${index + 1}] 个token:: ${token} --> ${res.data.data['activityPush'].message}`);
            if (res.data.data['activityPush'].message == "任务已完成") return 'ok'
        }
    } catch (e) {
        console.log(`\n❌第 [${index + 1}] 个token:: ${token} 看视频失败，三秒后重试，已重试 [${retryTime}] 次`)
        if (retryTime < 5) {
            // 在重试之前稍作延迟
            await wait(3000);
            // 递归调用，增加重试次数
            return await watchAD(index, token, i, retryTime + 1);
        } else {
            // 达到最大重试次数后记录最终错误
            notify(`\n❌第 [${index + 1}] 个token:: ${token} 看第${i + 1}个视频最终失败`);
            console.log(e);
        }
        // notify(`\n❌第 [${index + 1}] 个token:: ${token} 看视频失败`);
        console.log(e);
    }

    if (i < 2) {
        // 等待60秒
        await wait(60000);
    }
};

/**
 * 发送通知
 * @param title
 * @param content
 * @param url
 * @param desp
 * @param retryTime
 * @returns {Promise<*|undefined>}
 */
const send = async (title, content, url, desp, retryTime=0) => {
    console.log("\n\n === 开始发送通知 ===")
    try {
        let res = await axios.post(globalConfig.pushPlusUrl, {
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

// run().then();

try {
    run().then(() => {
        send("米萌岛", all_message, '', "\n\n本通知 By GooLucky").then();
    });
} catch (e) {
    console.log("执行失败！原因：\n")
    console.log(e)
}

