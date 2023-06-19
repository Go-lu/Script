/**
 * @name: get_status
 * @author: GOLU
 * @date: 2023/6/16 0:49
 * @description：get_status
 * @update: 2023/6/16 0:49
 */
/**
 * openFrp 节点状态监控
 * 请安装nodejs模块 --  axios
 * 在源码第一行 “自定义邮件通知处配置邮件服务”
 * 环境变量填入 变量名称 ofrp 账号-密码  例：1234567@qq.com-pwd1234
 * 多账号-- 使用回车或 & 分割账号
 * 例1 123@qq.com-pwd123&456@qq.com-pwd456
 * 例2 123@qq.com-pwd123
 *     456@qq.com-pwd456
 * 
 * cron 11 12 * * *
 * **/
// 自定义邮件通知
const emailInformations = {
	// 发件人的邮箱地址 或 昵称
	from: "",
	// 收件人的邮箱地址
	to: "",
	// 你的SMTP服务器主机名或IP地址
	host: "smtp.office365.com",
	// 你的SMTP服务器端口号  微软的为587
	// 请根据实际情况修改
	port: 587,
	// 发件人的邮箱账号
	user: "",
	// 发件人的邮箱密码或授权码
	pass: ""
};

const axios = require('axios');
// const send = require("./sendNotify");
const fs = require("fs");
const nodemailer = require("nodemailer")


const URL = "https://console.openfrp.net";
let all_message = "";

//日志及通知输出模块
async function notify(content) {
	all_message = all_message + content + "\n";
	console.log(content);
}

// 邮箱发送提醒信息
async function sendEmail(subject, html) {
	try {
		const transporter = nodemailer.createTransport({
			host: emailInformations.host, // 你的SMTP服务器主机名或IP地址
			port: emailInformations.port, // 你的SMTP服务器端口号
			secureConnection: true, // 使用TLS加密连接
			auth: {
				user: emailInformations.user, // 发件人的邮箱账号
				pass: emailInformations.pass // 发件人的邮箱密码或授权码
			}
		});

		const mailOptions = {
			from: emailInformations.from, // 发件人的邮箱地址
			to: emailInformations.to, // 收件人的邮箱地址
			subject: subject, // 邮件主题
			html: html // 邮件正文
		};

		const info = await transporter.sendMail(mailOptions);
		console.log('Email sent: ' + info.response);
		return "ok";
	} catch (error) {
		console.error(error);
		return Promise.reject(new Error("failed"));
	}
}

// // 调用示例
// sendEmail(
//     'Hello from Node.js', // 邮件主题
//     'This is a test email sent from Node.js.' // 邮件正文
// );

//延时函数 await调用
let wait = ms => new Promise(resolve => setTimeout(resolve, ms));

//获取账号密码 并随机返回一个
function get_accounts() {
	let accounts = process.env.ofrp;
	let accounts_list = [];
	if (accounts.indexOf('\n') !== -1) {
		accounts_list = accounts.split('\n');
	} else if (accounts.indexOf('&') !== -1) {
		accounts_list = accounts.split('&');
	} else {
		accounts_list = [accounts];
	}
	const randomIndex = Math.floor(Math.random() * accounts_list.length);
	return accounts_list[randomIndex];
	// return process.env.bjqcToken.split("\n");
}

// 检测token有效性
async function check_token(token, session) {
	const response = await axios.post(
		`${URL}/web/frp/api/getUserInfo`,
		{
			session
		},
		{
			headers: {
				'Host': 'console.openfrp.net',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0',
				'Accept': 'application/json, text/plain, */*',
				'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
				'Accept-Encoding': 'gzip, deflate, br',
				'Content-Type': 'application/json',
				'Authorization': token,
				// 'Content-Length': 46,
				'Origin': 'https://console.openfrp.net',
				'Connection': 'keep-alive',
				'Referer': 'https://console.openfrp.net/home/dashboard',
				'Sec-Fetch-Dest': 'empty',
				'Sec-Fetch-Mode': 'cors',
				'Sec-Fetch-Site': 'same-origin',
				'TE': 'trailers'
			}
		}
	);
	return {
		flag: response.data.flag,
		msg: response.data.msg
	}
}

// 写入 & 更新本地token
async function get_update_token() {
	try {
		// 读取本地token文件
		const token = JSON.parse(fs.readFileSync("openFrpToken.json"), "utf8");
		// 验证token有效性
		const { flag, msg } = await check_token(token.openToken, token.openSession);
		// 如果失效则重新发请求获取
		if (!flag) {
			const account = get_accounts();
			const { session, authorization } = await getSessionAndAuthorization(account.split('-')[0], account.split('-')[1]);
			fs.writeFileSync(
				"openFrpToken.json",
				JSON.stringify({
					openToken: authorization,
					openSession: session
				}, null, 2),
				"utf8"
			);
		}
		return "ok";
	} catch (error) {
		const account = get_accounts();
		const { session, authorization } = await getSessionAndAuthorization(account.split('-')[0], account.split('-')[1]);
		fs.writeFileSync(
			"openFrpToken.json",
			JSON.stringify({
				openToken: authorization,
				openSession: session
			}, null, 2),
			"utf8"
		);
		return "ok";
	}
}

// 获取session和authorization参数的函数
async function getSessionAndAuthorization(usr, pwd) {
	const response = await axios.post(
		`${URL}/web/user/login`,
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

// 获取所有节点状态
async function get_all_servery_status(token) {
	const response = await axios.get(
		`${URL}/web/frp/api/getNodeStatus`,
		{
			headers: {
				'Host': 'console.openfrp.net',
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0',
				'Accept': 'application/json, text/plain, */*',
				'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
				'Accept-Encoding': 'gzip, deflate, br',
				'Authorization': token,
				'Content-Type': 'application/json',
				'Alt-Used': 'console.openfrp.net',
				// 'Content-Length': '51',
				// 'Origin': 'https://console.openfrp.net',
				'Connection': 'keep-alive',
				'Referer': 'https://console.openfrp.net/home/nodestatus',
				'Sec-Fetch-Dest': 'empty',
				'Sec-Fetch-Mode': 'cors',
				'Sec-Fetch-Site': 'same-origin',
				'TE': 'trailers',
			}
		}
	);
	return {
		flag: response.data.flag,
		nodeData: response.data.data
	}
}


async function run() {
	let token = ""
	// 确保本地有且存储的token有效
	const statu = await get_update_token();
	if (statu === "ok") {
		// 读取本地token
		token = JSON.parse(fs.readFileSync("openFrpToken.json"), "utf8").openToken;
	}
	if (token !== "") {
		let logs = "";
		// 是否有空余节点
		let freeNode = false;
		// 节点状态
		let nodeStatus = true;
		// 空闲余量
		let freeNum = 0;
		// 构建的邮件内容
		let htmlMsg = "";
		const { flag, nodeData } = await get_all_servery_status(token);
		if (flag) {
			nodeData.forEach(item => {
				if (item.name === "十堰电信-1") {
					if (item.status === 200) {
						// 将当前所有在线类型数量转换成json对象
						let proxy_type_count = JSON.parse(item.proxy_type_count);
						// 解构出所有的隧道类型
						let {tcp='——',udp='——',http='——',https='——',stcp='——'} = proxy_type_count;
						let counts_list = [tcp,udp,http,https,stcp];
						// 计算出所有类型在线数量之和
						let nowonline = 0;
						for(let count of counts_list){
							if(count!=='——'){
								nowonline += count;
							}
						}
						// 空闲余量计算
						freeNum = item.maxonline - nowonline;
						logs = `\n统计：{\n	负载总量: ${item.maxonline}\n	当前负载: ${nowonline}\n	剩余负载: ${freeNum}\n     }\n`;
						// 如果在线数量总和小于最大在线数 既有空余节点
						if (nowonline < item.maxonline) {
							freeNode = true;
							htmlMsg = `<body><table align="center" style="border-collapse:collapse;border:1px solid #87ceeb;text-align:center;background-color:#ebf3ff"><caption><h3>十堰电信-1 -- 节点状态</h3></caption><tr><th style="border:1px solid #87ceeb;padding:10px">隧道类型</th><th style="border:1px solid #87ceeb;padding:10px">在线数量</th><th style="border:1px solid #87ceeb;padding:10px">在线合计</th><th style="border:1px solid #87ceeb;padding:10px">节点容量</th><th style="border:1px solid #87ceeb;padding:10px">剩余容量</th></tr><tr><td style="border:1px solid #87ceeb;padding:10px">TCP</td><td style="border:1px solid #87ceeb;padding:10px">${tcp}</td><td style="border:1px solid #87ceeb;padding:10px" rowspan="3">${nowonline}</td><td style="border:1px solid #87ceeb;padding:10px" rowspan="3">${item.maxonline}</td><td style="border:1px solid #87ceeb;padding:10px" rowspan="3" class="free">${freeNum}</td></tr><tr><td style="border:1px solid #87ceeb;padding:10px">UDP</td><td style="border:1px solid #87ceeb;padding:10px">${udp}</td></tr><tr><td style="border:1px solid #87ceeb;padding:10px">HTTP</td><td style="border:1px solid #87ceeb;padding:10px">${http}</td></tr><tr><td style="border:1px solid #87ceeb;padding:10px">HTTPS</td><td style="border:1px solid #87ceeb;padding:10px">${https}</td><td style="border:1px solid #87ceeb;padding:10px" rowspan="2"><h3>节点状态</h3></td><td style="border:1px solid #87ceeb;padding:10px;font-size:20px;color:#328b20" rowspan="2" colspan="2">${nodeStatus} -> ${item.status}</td></tr><tr><td style="border:1px solid #87ceeb;padding:10px">STCP</td><td style="border:1px solid #87ceeb;padding:10px">${stcp}</td></tr></table><h1 style="color:red;margin:50px auto;text-align:center">冲冲！！！冲冲冲！！</h1><h1 style="color:red;margin:50px auto;text-align:center">冲冲冲！！！冲冲冲冲！！</h1><h1 style="color:red;margin:50px auto;text-align:center">冲冲冲冲！！！再不冲就没了！！</h1></body>`
						}
					} else {
						nodeStatus = false;
					}
				}
			});
		}
		if (nodeStatus) {
			if (freeNode) {
				console.log(logs+"\n✅当前节点有空余！！正在发送通知邮件~~");
				sendEmail(
					'十堰电信-1监控提醒  By Golu', // 邮件主题
					'目前该节点有空余！余量：' + freeNum.toString // 邮件正文
				).then(() => {
					console.log("\n📧✅邮件发送成功！");
				}).catch(error => {
					console.log("\n📧❌邮件发送失败！！\n原因：" + error);
				});
			}else{
				console.log(logs+"\n当前节点满载！");
			}
		}else{
			console.log("\n当前节点已宕机！");
		}
	}
}

// 主函数
(async () => {
	try {
		await run();
		// await send.sendNotify("OpenFrp签到", all_message, '', "\n\n本通知 By GooLucky");
		return;
	} catch (error) {
		console.error(error);
		return;
	}
})();
