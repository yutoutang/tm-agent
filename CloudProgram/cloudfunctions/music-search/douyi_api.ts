import {DouyinAuth} from "./auth";
import {Header, HeaderBuilder, HeaderType} from "./header";
import {Params} from "./params";
import axios from "axios";

export class DouyinApi {
    private static douyin_url: string = 'https://www.douyin.com'

    static async get_user_work_info(
        auth: DouyinAuth,
        userUrl: string,
        maxCursor: string,
        ...kwargs: any[]
    ): Promise<Record<string, any>> {
        const api = "/aweme/v1/web/aweme/post/";

        // 从用户URL中提取user_id
        const userId = userUrl.split("/").pop()?.split("?")[0] || "";

        // 构建请求头
        const headers: Header = HeaderBuilder.build(HeaderType.GET);
        headers.set_header("referer", userUrl);

        // 构建请求参数
        const params = new Params()
        params.add_param("device_platform", "webapp");
        params.add_param("aid", "6383");
        params.add_param("channel", "channel_pc_web");
        params.add_param("sec_user_id", userId);
        params.add_param("max_cursor", maxCursor);
        params.add_param("locate_query", "false");
        params.add_param("show_live_replay_strategy", "1");
        params.add_param("need_time_list", maxCursor === "0" ? "1" : "0");
        params.add_param("time_list_query", "0");
        params.add_param("whale_cut_token", "");
        params.add_param("cut_version", "1");
        params.add_param("count", "18");
        params.add_param("publish_video_strategy_type", "2");
        params.add_param("update_version_code", "170400");
        params.add_param("pc_client_type", "1");
        params.add_param("version_code", "290100");
        params.add_param("version_name", "29.1.0");
        params.add_param("cookie_enabled", "true");
        params.add_param("screen_width", "1707");
        params.add_param("screen_height", "960");
        params.add_param("browser_language", "zh-CN");
        params.add_param("browser_platform", "Win32");
        params.add_param("browser_name", "Edge");
        params.add_param("browser_version", "125.0.0.0");
        params.add_param("browser_online", "true");
        params.add_param("engine_name", "Blink");
        params.add_param("engine_version", "125.0.0.0");
        params.add_param("os_name", "Windows");
        params.add_param("os_version", "10");
        params.add_param("cpu_core_num", "32");
        params.add_param("device_memory", "8");
        params.add_param("platform", "PC");
        params.add_param("downlink", "10");
        params.add_param("effective_type", "4g");
        params.add_param("round_trip_time", "100");
        params.with_web_id(auth, userUrl);
        params.add_param("verifyFp", auth.get_cookie()['s_v_web_id'] || "");
        params.add_param("fp", auth.get_cookie_str()['s_v_web_id'] || "");
        params.add_param("msToken", auth.get_ms_token());

        // 发送请求
        headers.set_header("Cookie", auth.get_cookie_str())
        try {
            console.log(`${this.douyin_url}${api}`)
            console.log(JSON.stringify(headers.get()))
            console.log(JSON.stringify(params.get()))
            const response = await axios.get(`${this.douyin_url}${api}`, {
                params: params.get(),
                headers: headers.get(),
                // 禁用 SSL 验证（与 verify=False 对应）
                httpsAgent: new (require('https').Agent)({
                    rejectUnauthorized: false
                })
            });
            console.log(JSON.stringify(response.data))
            return response.data;
        } catch (error) {
            console.error("请求失败:", error);
            throw error;
        }
    }
}