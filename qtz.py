#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2022/3/8 12:03
# @Author  : 丿弑神丶惊雷 && GOLU
# @Site    :
# @File    : 趣躺转汇总.py
# @Software: PyCharm

"""
** 微信小程序---趣躺赚
** 教程：
** --- 抓包小程序，寻找域名 ‘wx.17u.cn’ 找结尾为 getRunData ，从host开始复制下面的全部header
** --- 并将所获得的header转换成json格式 填入变量 qtz_token 
** 青龙环境变量:
*** 账号ck
** export qtz_token='{"host":"xxx",...,"Referer":"xxxx"}'           ## 多账号请用 “ $ ” 分割

*** 开箱方式 3为运行一次脚本开一次箱子 一天需要设置脚本运行三次 1或其他数字为一次开启三个箱子，耗时较长，大概十分钟左右，每天只需要在23点前运行一次脚本即可
 -- 不设置或此变量为空时，默认为3，请注意设置脚本运行时间，建议在刷过步数后手动打开一次小程序再运行本脚本
** export qtz_method=''

** cron  一天三次：  32 9,15,22 * * *           一天一次： 11 23 * * *
"""

import requests #line:14
import os #line:15
import time #line:16
import json #line:17
import datetime #line:18
import logging #line:19
host ='https://wx.17u.cn/platformflowpool/{}'#line:22
try :#line:26
    from sendNotify import send #line:27
except ModuleNotFoundError :#line:28
    logging .info ('\n🚧🚧未在本脚本所在文件夹内找到 ‘sendNotify.py’文件！\n请将此文件复制到当前文件夹内，否则无法接收到消息推送！\n')#line:29
logger =logging .getLogger (__name__ )#line:33
logger .setLevel (logging .INFO )#line:34
logFormat =logging .Formatter ("%(message)s")#line:35
stream =logging .StreamHandler ()#line:38
stream .setFormatter (logFormat )#line:39
logger .addHandler (stream )#line:40
allMess =''#line:42
def notify (O0OO0OO00O0OOO0OO =None ):#line:45
    global allMess #line:46
    allMess =allMess +O0OO0OO00O0OOO0OO +'\n'#line:47
    logger .info (O0OO0OO00O0OOO0OO )#line:48
def c_ck (O0O0O0O0OO000O0O0 ):#line:53
    O00OO0OO0OO00O000 =[]#line:55
    OOOOO00OO0OOO00O0 =0 #line:56
    while OOOOO00OO0OOO00O0 <len (O0O0O0O0OO000O0O0 ):#line:58
        O00OOO00O0OO00OOO =O0O0O0O0OO000O0O0 [OOOOO00OO0OOO00O0 ]#line:60
        O0O00O00O0OO0OO0O =json .loads (O00OOO00O0OO00OOO )#line:61
        notify (f'\n🎊----【检查ck】开始检查第 {OOOOO00OO0OOO00O0 + 1} 个账号！----')#line:62
        if O0O00O00O0OO0OO0O !='':#line:64
            O0O00OOOOO00O0O00 =host .format ("user/checkSession")#line:66
            O0OOO00O000O0OOOO =requests .post (url =O0O00OOOOO00O0O00 ,headers =O0O00O00O0OO0OO0O ).json ()#line:67
            OO0O00O0O00OOOO0O =O0OOO00O000O0OOOO ["retCode"]#line:68
            if str (OO0O00O0O00OOOO0O )=='0':#line:69
                logger .info ('\n🎉登陆状态有效')#line:70
            else :#line:71
                notify (f'\n❌登陆状态失效,错误代码: {OO0O00O0O00OOOO0O}')#line:72
                O00OO0OO0OO00O000 .append (O00OOO00O0OO00OOO )#line:74
        else :#line:75
            notify ('\n🚨此账号为空！请检查后修改！')#line:76
            O00OO0OO0OO00O000 .append (O00OOO00O0OO00OOO )#line:78
        if len (O0O0O0O0OO000O0O0 )-(OOOOO00OO0OOO00O0 +1 )>0 :#line:80
            logger .info ('\n🕰️休息三秒后开始下一账号~~')#line:81
            time .sleep (3 )#line:83
        OOOOO00OO0OOO00O0 +=1 #line:84
    for O0O0OO0OOOO00OOO0 in O00OO0OO0OO00O000 :#line:86
        O0O0O0O0OO000O0O0 .remove (O0O0OO0OOOO00OOO0 )#line:88
    notify ('\n✅ck检验任务结束~~')#line:89
    return O0O0O0O0OO000O0O0 #line:91
def sign (O00O0OOO00O0O00O0 ):#line:96
    OO0OO0OO000O000O0 =0 #line:97
    while OO0OO0OO000O000O0 <len (O00O0OOO00O0O00O0 ):#line:98
        OOOO0O0O00000000O =O00O0OOO00O0O00O0 [OO0OO0OO000O000O0 ]#line:99
        O000OOO00OOOOO0OO =json .loads (OOOO0O0O00000000O )#line:100
        notify (f'\n🎊----【每日签到】开始签到第 {OO0OO0OO000O000O0 + 1} 个账号！----')#line:101
        if O000OOO00OOOOO0OO !='':#line:102
            OOO000OO0OO00OO00 =host .format ("sign/sign")#line:103
            O00OO00OO000OO000 =requests .post (url =OOO000OO0OO00OO00 ,headers =O000OOO00OOOOO0OO ).json ()#line:104
            OO0O0000OOOOOOOOO =O00OO00OO000OO000 ['retCode']#line:106
            if str (OO0O0000OOOOOOOOO )=='0':#line:107
                O000O0OO0O0O0OO0O =O00OO00OO000OO000 ['content']['prize']['prizeName']#line:109
                notify (f'\n🎉恭喜您签到成功!  签到获得 {O000O0OO0O0O0OO0O} !')#line:110
            else :#line:111
                notify ('\n🚫签到失败！可能是今天已经签到过了~~')#line:112
        else :#line:114
            notify ('\n🚨该账号ck为空！请检查并修改！')#line:115
        if len (O00O0OOO00O0O00O0 )-(OO0OO0OO000O000O0 +1 )>0 :#line:116
            logger .info ('\n🕰️休息三秒后开始下一账号~~')#line:117
            time .sleep (3 )#line:118
        OO0OO0OO000O000O0 +=1 #line:119
    notify ('\n✅签到任务结束~~')#line:120
def helpcode (OO000O0000O0O0O0O ):#line:125
    O00O0000OOOOOOOO0 =host .format ("runData/getRunData")#line:126
    OOOO00O0OOO0O0000 =0 #line:127
    O0O0OO0OOO0000O0O =[]#line:128
    while OOOO00O0OOO0O0000 <len (OO000O0000O0O0O0O ):#line:129
        notify (f'\n🎊----【获取助力码】开始获取第 {OOOO00O0OOO0O0000 + 1} 个账号的助力码 ----')#line:130
        OO0000O00000O0000 =OO000O0000O0O0O0O [OOOO00O0OOO0O0000 ]#line:131
        O0O00OOO0O00OOO00 =json .loads (OO0000O00000O0000 )#line:132
        if O0O00OOO0O00OOO00 !='':#line:133
            O0O0000OOOOO00OO0 =requests .post (url =O00O0000OOOOOOOO0 ,headers =O0O00OOO0O00OOO00 ).json ()#line:134
            O0000OO0O000OO0O0 =O0O0000OOOOO00OO0 ["retCode"]#line:135
            if str (O0000OO0O000OO0O0 )=='0':#line:136
                OOOOO0O0OO0O0O000 =O0O0000OOOOO00OO0 ['content']['shareGuid']#line:137
                O0O0OO0OOO0000O0O .append (OOOOO0O0OO0O0O000 )#line:138
                logger .info (f'\n获取成功！ {OOOOO0O0OO0O0O000}')#line:139
            else :#line:142
                logger .info (f"\n❌获取失败~ 错误代码为: {O0000OO0O000OO0O0}")#line:143
        else :#line:144
            notify ('\n🚨该账号ck为空！请检查并修改！')#line:145
        if len (OO000O0000O0O0O0O )-(OOOO00O0OOO0O0000 +1 )>0 :#line:147
            logger .info ('\n🕰️休息三秒后开始获取下一账号~~')#line:148
            time .sleep (3 )#line:149
        OOOO00O0OOO0O0000 +=1 #line:150
    notify ('\n✅获取助力码任务结束~~')#line:152
    return O0O0OO0OOO0000O0O #line:153
def get_coin (O0O0O00000OO000OO ):#line:158
    O0OO00O000OO00O00 =host .format ("homepage/info")#line:159
    O0O0O0O0O00O0OOOO =0 #line:160
    while O0O0O0O0O00O0OOOO <len (O0O0O00000OO000OO ):#line:161
        notify (f'\n🎊----【资产查询】开始查询第 {O0O0O0O0O00O0OOOO + 1} 个账号！----')#line:162
        O0O0OOOO000OOOOOO =O0O0O00000OO000OO [O0O0O0O0O00O0OOOO ]#line:163
        OOOOOO0O00OOO0000 =json .loads (O0O0OOOO000OOOOOO )#line:164
        if OOOOOO0O00OOO0000 !='':#line:165
            OOO00OOO0OO0O0O00 =requests .post (url =O0OO00O000OO00O00 ,headers =OOOOOO0O00OOO0000 ).json ()#line:166
            O00OOOOOO00OO0OOO =OOO00OOO0OO0O0O00 ["retCode"]#line:167
            if str (O00OOOOOO00OO0OOO )=='0':#line:168
                O0OO0OOO0OO0OO0O0 =OOO00OOO0OO0O0O00 ['content']['goldsAmount']#line:169
                O0O0O000OOO00O0OO =OOO00OOO0OO0O0O00 ['content']['goldsCashAmount']#line:170
                notify (f"\n💰您的金砖为: {O0OO0OOO0OO0OO0O0}\n💴折合人民币: {O0O0O000OOO00O0OO} 元")#line:171
                if O0O0O000OOO00O0OO >=1 :#line:173
                    notify ('\n🎉🎉【提现提醒：】你已经达到了一元人民币的巨资！快去‘趣躺赚’小程序提现吧！')#line:174
            else :#line:175
                logger .info (f"\n❌查询失败！ 错误代码为: {O00OOOOOO00OO0OOO}")#line:176
        else :#line:177
            notify ('\n🚨该ck未空！请检查后修改！')#line:178
        if len (O0O0O00000OO000OO )-(O0O0O0O0O00O0OOOO +1 )>0 :#line:179
            logger .info ('\n🕰️休息三秒后开始下一账号~~')#line:180
            time .sleep (3 )#line:181
        O0O0O0O0O00O0OOOO +=1 #line:182
    notify ('\n✅查询任务完成~~')#line:183
def exchange (OO00OO0OO0OO0O0OO ):#line:188
    OOOO00O0000000000 ={"step":100 }#line:189
    O0000OO0O000O0O0O =host .format ("runData/exchange")#line:190
    OOOOOOOOO0OOO0OO0 =0 #line:191
    while OOOOOOOOO0OOO0OO0 <len (OO00OO0OO0OO0O0OO ):#line:192
        notify (f'\n🎊----【步数换金砖】开始兑换第 {OOOOOOOOO0OOO0OO0 + 1} 个账号！----')#line:193
        O0OOO00OOO0OO00O0 =OO00OO0OO0OO0O0OO [OOOOOOOOO0OOO0OO0 ]#line:194
        O0OO00OO0000OOOO0 =json .loads (O0OOO00OOO0OO00O0 )#line:195
        if O0OO00OO0000OOOO0 !='':#line:196
            while True :#line:198
                OOOO0000O00OOO0OO =requests .post (url =O0000OO0O000O0O0O ,headers =O0OO00OO0000OOOO0 ,json =OOOO00O0000000000 ).json ()#line:199
                OOOOOOO0O000OO0O0 =OOOO0000O00OOO0OO ["retCode"]#line:200
                if str (OOOOOOO0O000OO0O0 )=='0':#line:201
                    OOOOO0OO0OOO00O00 =OOOO0000O00OOO0OO ["content"]["exchangeCoin"]#line:202
                    notify (f"\n💰您兑换的金砖数量为: {OOOOO0OO0OOO00O00}")#line:203
                    return OOOOO0OO0OOO00O00 #line:204
                else :#line:205
                    notify (f"\n❌兑换失败: {OOOO0000O00OOO0OO['retMsg']}")#line:206
                    break #line:208
        else :#line:209
            notify ('\n🚨该账号ck为空！请检查后修改！')#line:210
        if len (OO00OO0OO0OO0O0OO )-(OOOOOOOOO0OOO0OO0 +1 )>0 :#line:211
            logger .info ('\n🕰️休息三秒后开始下一账号~~')#line:212
            time .sleep (3 )#line:213
        OOOOOOOOO0OOO0OO0 +=1 #line:214
    notify ('\n✅兑换任务完成~~')#line:215
def open_box (O000O0OOOOOOO0O0O ,OO00OOOO000000OO0 ):#line:220
    O0OO0O00OO00O0OOO =host .format ("runData/getGiftBoxRunData")#line:221
    notify ('\n🛴🛴 -------- 即将开始开箱任务，此任务较为耗时，大约需要十分钟，请耐心等待~~ --------')#line:222
    OOO0O0000O0OO00O0 =0 #line:223
    OOOOO00O000OOOO0O =1 #line:224
    if OO00OOOO000000OO0 !='3':#line:226
        notify ('\n🛴当前开箱模式为一次性开箱，脚本只需在23点运行一次即可~ 一次性开箱耗时较久 请耐心等待~')#line:227
    while OOOOO00O000OOOO0O <=3 :#line:228
        notify (f'\n🎊🎊------- 开始开第 {OOOOO00O000OOOO0O} 个箱子 -------')#line:229
        while OOO0O0000O0OO00O0 <len (O000O0OOOOOOO0O0O ):#line:230
            notify (f'\n🎊---- 开始开箱第 {OOO0O0000O0OO00O0 + 1} 个账号！----')#line:231
            OOO00OO000O0O0O00 =O000O0OOOOOOO0O0O [OOO0O0000O0OO00O0 ]#line:232
            O0OO00OOOO0000000 =json .loads (OOO00OO000O0O0O00 )#line:233
            if O0OO00OOOO0000000 !='':#line:234
                OO00OO0000OO00O00 =requests .post (url =O0OO0O00OO00O0OOO ,headers =O0OO00OOOO0000000 ).json ()#line:235
                OOOOO00OOOOOO000O =OO00OO0000OO00O00 ["retCode"]#line:236
                if str (OOOOO00OOOOOO000O )=='0':#line:237
                    OO0OO0OOOO00OO0OO =OO00OO0000OO00O00 ["content"]["totalCount"]#line:238
                    O0OO00OOO0OOOOOO0 =OO00OO0000OO00O00 ["content"]["receivedCount"]#line:239
                    O0OOOO0000OO0O0OO =OO00OO0000OO00O00 ["content"]["receiveStep"]#line:240
                    OOOO0OOO0O00OO000 =OO00OO0000OO00O00 ["content"]["nextReceiveDate"]#line:241
                    notify (f'\n🎁总计开启次数: {OO0OO0OOOO00OO0OO}\n🎁已开启次数: {O0OO00OOO0OOOOOO0}\n🎁兑换步数: {O0OOOO0000OO0O0OO}\n🎁下次开箱时间: {OOOO0OOO0O00OO000}')#line:242
                else :#line:244
                    logger .info (f"\n❌🎁开箱失败: {OO00OO0000OO00O00['retMsg']}")#line:245
            else :#line:246
                notify ('\n🚨该账号ck为空！请检查后修改！')#line:247
            if len (O000O0OOOOOOO0O0O )-(OOO0O0000O0OO00O0 +1 )>0 :#line:248
                logger .info ('\n🕰️休息三秒后开始下一账号~~')#line:249
                time .sleep (3 )#line:250
            OOO0O0000O0OO00O0 +=1 #line:251
        if str (OO00OOOO000000OO0 )=='3':#line:252
            notify ('\n✈️当前开箱模式为单次开箱~~ 需要脚本每天运行三次')#line:253
            break #line:254
        if OOOOO00O000OOOO0O <3 :#line:255
            logger .info ('\n🕰️🕰️🕰️休息3分钟后开始开启下一个宝箱~')#line:256
            time .sleep (180 )#line:257
        OOOOO00O000OOOO0O +=1 #line:258
    notify ('\n✅已完成开箱任务！')#line:259
def helpother (O0OOO0OOO00O0O0O0 ,OO0OOOO0O00O0O000 ):#line:264
    O00OO0O0OOO00O0OO =host .format ("runData/getHelpRunData")#line:265
    O00O0000O0O000OOO =0 #line:266
    while O00O0000O0O000OOO <len (O0OOO0OOO00O0O0O0 ):#line:267
        O0OO00OOO0O0OOO00 =O0OOO0OOO00O0O0O0 [O00O0000O0O000OOO ]#line:268
        for OO00O000OOO0000O0 in OO0OOOO0O00O0O000 :#line:269
            O0O000OO0OO0O0OOO ={"shareGuid":OO00O000OOO0000O0 ,"helpHeadImgUrl":"https://thirdwx.qlogo.cn/mmopen/vi_32" "/BhiaaKibHCGAwSRkYo3jkqrIZ1IMsUORZwrACDtib8Ou12ED9bcWxuasRqnrmQV3ymEbdTufj0H0Etqe0ib3mAoCibw/132 "}#line:274
            OOO0O0OO00OOO00O0 =requests .post (url =O00OO0O0OOO00O0OO ,headers =O0OO00OOO0O0OOO00 ,json =O0O000OO0OO0O0OOO ).json ()#line:275
            OOO0O0O00OO0O0O0O =OOO0O0OO00OOO00O0 ["retCode"]#line:276
            if str (OOO0O0O00OO0O0O0O )=='0':#line:277
                logger .info ('\n✅助力成功')#line:279
            else :#line:280
                logger .info ('\n助力失败',OOO0O0OO00OOO00O0 ['retMsg'])#line:281
    logger .info ('\n✅助力任务已完成！')#line:282
def helper (O0OO0O0O0OO000O00 ):#line:286
    O0O0OO00O0OOO0000 =helpcode (O0OO0O0O0OO000O00 )#line:288
    if len (O0O0OO00O0OOO0000 )>1 :#line:290
        helpother (O0OO0O0O0OO000O00 ,O0O0OO00O0OOO0000 )#line:291
    else :#line:292
        logger .info ('\n💨助力码过少！不进行助力活动！')#line:293
def run (O00O000O0O0O0OO00 ,OOO0OO00O0OOO0OO0 ):#line:297
    sign (O00O000O0O0O0OO00 )#line:302
    helper (O00O000O0O0O0OO00 )#line:304
    open_box (O00O000O0O0O0OO00 ,OOO0OO00O0OOO0OO0 )#line:306
    exchange (O00O000O0O0O0OO00 )#line:308
    get_coin (O00O000O0O0O0OO00 )#line:310
    try :#line:313
        OO000O00OO0OOO0O0 =datetime .datetime .now ().replace (microsecond =0 )#line:314
        send ('🛌 趣躺赚 🛌',allMess +'\n\n\n'+'本通知by  GOLU 【趣躺赚】\n'+str (OO000O00OO0OOO0O0 ))#line:315
    except NameError :#line:316
        logger .info ('\n🔕消息发送失败~~ 可能是因为未找到 ‘sendNotify.py’文件！')#line:317
if __name__ =='__main__':#line:320
    begin =time .time ()#line:322
    notify ('🌞----【趣躺赚脚本】开始执行~ ----')#line:323
    logger .info ('\n🍩温馨提示：\n设置环境变量 qtz_method 可控制开箱方式，\n变量值为3 则是每次脚本运行只开箱一次，变量为其他数字则为一次性开三个箱子，具体请看脚本注释！')#line:324
    try :#line:325
        head =os .environ ['qtz_token']#line:326
        try :#line:327
            meth =os .environ ['qtz_method']#line:328
            if meth =='':#line:329
                meth ='3'#line:330
        except KeyError :#line:331
            meth ='3'#line:332
        ck_l =head .split ('$')#line:333
        notify (f'\n✨检测到 【{str(len(ck_l))} 个账号】！')#line:334
        if len (ck_l )>0 :#line:336
            run (ck_l ,meth )#line:337
        else :#line:338
            notify ('\n🚨变量为空！请填写变量后运行！')#line:339
    except KeyError :#line:341
        notify ('\n🚨未在环境变量中找到ck，请在环境变量填写ck后运行！')#line:342
    end =time .time ()#line:344
    r_t =end -begin #line:345
    logger .info (f'\n🔔【趣躺赚】运行完成~~   ⏱：{str(r_t)}秒')#line:346

