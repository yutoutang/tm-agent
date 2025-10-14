import {DouyinAuth} from "./auth";
import {HeaderBuilder, HeaderType} from "./header";
import axios from "axios";

export function generateMsToken(): string {
    let randomlength: number = 107
    let randomStr = '';
    const baseStr = 'ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz0123456789=';
    const length = baseStr.length - 1;

    for (let i = 0; i < randomlength; i++) {
        // 生成0到length之间的随机整数（包含两端）
        const randomIndex = Math.floor(Math.random() * (length + 1));
        randomStr += baseStr[randomIndex];
    }

    return randomStr;
}


export function generateFakeWebid(): string {
    let randomLength: number = 19
    const baseStr = '0123456789';
    let randomStr = '';
    const length = baseStr.length - 1;

    for (let i = 0; i < randomLength; i++) {
        // 生成0到length之间的随机整数（包含首尾）
        const randomIndex = Math.floor(Math.random() * (length + 1));
        randomStr += baseStr[randomIndex];
    }

    return randomStr;
}


export async function generateWebid(auth?: DouyinAuth, url: string = ""): Promise<string> {
    // 如果未提供URL，使用默认URL
    if (!url) {
        url = "https://www.douyin.com/discover?modal_id=7376449060384935209";
    }

    try {
        // 构建请求头
        const headers = HeaderBuilder.build(HeaderType.DOC);

        // 设置Cookie（如果提供了auth信息）
        if (auth) {
            headers.set_header('cookie', auth.get_cookie_str());
        }

        // 设置升级不安全请求的头
        headers.set_header("upgrade-insecure-requests", "1");

        // 发送请求（禁用SSL验证）
        const response = await axios.get(url, {
            headers: headers.get(),
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) // 禁用SSL验证
        });

        // 从响应文本中提取user_unique_id作为webid
        const resText = response.data;
        const match = resText.match(/"user_unique_id":"(.*?)"/);

        if (match && match[1]) {
            return match[1];
        } else {
            // 如果未找到匹配，生成伪造的webid
            return generateFakeWebid();
        }
    } catch (error) {
        // 发生任何错误时，生成伪造的webid
        console.error("获取webid失败，使用伪造的webid:", error);
        return generateFakeWebid();
    }
}