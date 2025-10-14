import {generateFakeWebid, generateWebid} from "./utils";

export class Params {
    private params: Record<string, string>;

    constructor() {
        this.params = {};
    }

    /**
     * 添加平台相关参数
     * @returns 当前 Params 实例，支持链式调用
     */
    public with_platform(): this {
        const platformParams: Record<string, string> = {
            'device_platform': 'webapp',
            'aid': '6383',
            'channel': 'channel_pc_web',
            'pc_client_type': '1',
            'update_version_code': '170400',
            'version_code': '170400',
            'version_name': '17.4.0',
            'cookie_enabled': 'true',
            'screen_width': '1707',
            'screen_height': '960',
            'browser_language': 'zh-CN',
            'browser_platform': 'Win32',
            'browser_name': 'Edge',
            'browser_version': '125.0.0.0',
            'browser_online': 'true',
            'engine_name': 'Blink',
            'engine_version': '125.0.0.0',
            'os_name': 'Windows',
            'os_version': '10',
            'cpu_core_num': '32',
            'device_memory': '8',
            'platform': 'PC',
            'downlink': '10',
            'effective_type': '4g',
            'round_trip_time': '100',
        };

        this.params = { ...this.params, ...platformParams };
        return this;
    }

    /**
     * 批量更新参数
     * @param params 要添加的参数对象
     * @returns 当前 Params 实例，支持链式调用
     */
    public update_params(params: Record<string, string>): this {
        this.params = { ...this.params, ...params };
        return this;
    }

    /**
     * 添加 webid 参数
     * @param auth 认证信息
     * @param url URL地址
     * @param fake 是否使用伪造的webid
     * @returns 当前 Params 实例，支持链式调用
     */
    with_web_id(auth?: any, url: string = "", fake: boolean = false): this {
        const webid = fake ? generateFakeWebid() : generateWebid(auth, url);
        if (typeof webid === "string") {
            this.params['webid'] = webid;
        }
        return this;
    }
    //
    // /**
    //  * 添加 a_bogus 参数
    //  * @param data 数据对象
    //  * @returns 当前 Params 实例，支持链式调用
    //  */
    // with_a_bogus(data?: Record<string, string>): this {
    //     const query = splice_url(this.get());
    //     const dataStr = data ? splice_url(data) : '';
    //     const abogus = generate_a_bogus(query, dataStr);
    //     this.add_param('a_bogus', abogus);
    //     return this;
    // }
    //
    // /**
    //  * 添加 msToken 参数
    //  * @returns 当前 Params 实例，支持链式调用
    //  */
    // with_ms_token(): this {
    //     const msToken = generate_msToken();
    //     this.params['msToken'] = msToken;
    //     return this;
    // }

    /**
     * 添加单个参数
     * @param key 参数名
     * @param value 参数值
     * @returns 当前 Params 实例，支持链式调用
     */
    public add_param(key: string, value: string): this {
        this.params[key] = value;
        return this;
    }

    /**
     * 获取当前所有参数
     * @returns 参数对象
     */
    get(): Record<string, string> {
        return { ...this.params }; // 返回副本，防止外部直接修改
    }

    /**
     * 按照预定顺序排序参数
     */
    sort(): void {
        const order: string[] = [
            'device_platform', 'aid', 'channel', 'publish_video_strategy_type',
            'source', 'sec_user_id', 'personal_center_strategy', 'update_version_code',
            'pc_client_type', 'version_code', 'version_name', 'cookie_enabled',
            'screen_width', 'screen_height', 'browser_language', 'browser_platform',
            'browser_name', 'browser_version', 'browser_online', 'engine_name',
            'engine_version', 'os_name', 'os_version', 'cpu_core_num', 'device_memory',
            'platform', 'downlink', 'effective_type', 'round_trip_time', 'webid',
            'verifyFp', 'fp', 'msToken', 'a_bogus'
        ];

        // 按顺序添加参数
        const sortedParams: Record<string, string> = {};
        for (const key of order) {
            if (this.params.hasOwnProperty(key)) {
                sortedParams[key] = this.params[key];
            }
        }

        // 添加剩余参数
        for (const key of Object.keys(this.params)) {
            if (!sortedParams.hasOwnProperty(key)) {
                sortedParams[key] = this.params[key];
            }
        }

        this.params = sortedParams;
    }

    /**
     * 将参数转换为 URL 查询字符串格式
     * @returns URL查询字符串
     */
    toString(): string {
        return Object.entries(this.params)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
            .join('&');
    }
}
