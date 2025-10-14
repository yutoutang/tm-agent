// 对应 Python 的 HeaderType 枚举，限定请求头类型
export enum HeaderType {
    POST = "POST",     // JSON 格式的 POST 请求
    FORM = "FORM",     // 表单格式的 POST 请求
    PROTOBUF = "PROTOBUF", // Protobuf 格式请求
    GET = "GET",       // GET 请求
    DOC = "DOC"        // 文档（如 HTML）请求（需特殊头）
}

// 对应 Python 的 Header 类，封装请求头的操作
export class Header {
    // 存储请求头的键值对（键：头名称，值：头内容）
    public headers: Record<string, string>;

    constructor() {
        this.headers = {}; // 初始化空请求头
    }

    /**
     * 设置单个请求头（覆盖已有同名头）
     * @param key 请求头名称（如 "user-agent"）
     * @param value 请求头内容
     */
    public set_header(key: string, value: string): void {
        this.headers[key] = value;
    }

    /**
     * 批量更新请求头（合并新头，覆盖同名旧头）
     * @param newHeaders 待合并的请求头对象
     */
    public updateHeaders(newHeaders: Record<string, string>): void {
        this.headers = { ...this.headers, ...newHeaders };
    }

    public get() {
        return this.headers;
    }
}

export class HeaderBuilder {
    // 静态属性：User-Agent（与 Python 一致，使用 Firefox 117.0 的 UA）
    public static readonly ua: string =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0";

    /**
     * 静态方法：根据请求类型构建对应的请求头
     * @param headerType 请求头类型（由 HeaderType 枚举限定）
     * @returns 构建好的 Header 对象
     */
    public static build(headerType: HeaderType): Header {
        const header = new Header();

        // 1. 通用请求头（所有类型共用，除 DOC 外）
        header.set_header("user-agent", HeaderBuilder.ua);
        header.set_header("cache-control", "no-cache");
        header.set_header("pragma", "no-cache");
        header.set_header("sec-ch-ua", '"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"');
        header.set_header("sec-ch-ua-mobile", "?0");
        header.set_header("sec-ch-ua-platform", '"Windows"');
        header.set_header("sec-fetch-dest", "empty");
        header.set_header("sec-fetch-mode", "cors");
        header.set_header("sec-fetch-site", "same-origin");
        header.set_header("priority", "u=1, i");
        header.set_header("accept-language", "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6");

        // 2. 按请求类型补充/覆盖特殊请求头
        switch (headerType) {
            case HeaderType.POST:
                // JSON 格式的 POST 请求
                header.set_header("accept", "*/*");
                header.set_header("content-type", "application/json; charset=UTF-8");
                break;

            case HeaderType.FORM:
                // 表单格式的 POST 请求
                header.set_header("accept", "application/json, text/plain, */*");
                header.set_header("content-type", "application/x-www-form-urlencoded; charset=UTF-8");
                break;

            case HeaderType.PROTOBUF:
                // Protobuf 格式请求
                header.set_header("accept", "application/x-protobuf");
                header.set_header("content-type", "application/x-protobuf");
                break;

            case HeaderType.GET:
                // GET 请求
                header.set_header("accept", "application/json, text/plain, */*");
                break;

            case HeaderType.DOC:
                // 文档请求（特殊逻辑：重新初始化 Header + 批量设置头）
                const docHeaders: Record<string, string> = {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                    "cache-control": "no-cache",
                    "cookie": "", // 初始为空，使用时需根据需求赋值
                    "pragma": "no-cache",
                    "priority": "u=0, i",
                    "sec-ch-ua": '"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": '"Windows"',
                    "sec-fetch-dest": "document",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "none",
                    "sec-fetch-user": "?1",
                    "upgrade-insecure-requests": "1",
                    "user-agent": HeaderBuilder.ua
                };
                // 重新初始化 Header（对齐 Python 的 header = Header()）
                header.headers = {};
                // 批量更新 DOC 专用头
                header.updateHeaders(docHeaders);
                break;
        }

        return header;
    }
}