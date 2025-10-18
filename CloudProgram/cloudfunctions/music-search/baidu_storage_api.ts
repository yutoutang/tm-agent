import axios from "axios";

const access_token = "123.1b9153ec9fd4169f7d2cc49fdf6f4971.YnuNQAAsjhwcVwwr9UfCfs7TlB5M_dAaqjr1qU5.rUt6EQ"

const base_api = "https://pan.baidu.com";

const baidu_storage_search_api = "/xpan/unisearch";

const baidu_storage_get_file_api = "/rest/2.0/xpan/multimedia"

export class BaiduStorageApi {

    public static async search_file(value: string) {
        const query_param = {
            "access_token": access_token,
            "num": 5,
            "scene": "mcpserver",
            "query": value
        }

        const body_param = {}

        let resp = await axios.post(base_api + baidu_storage_search_api, body_param, {
            params: query_param  // 通过params配置传递查询参数
        });

        let res = []
        let fids = [];
        if (resp.data.data && resp.data.data instanceof Array) {
            resp.data.data.forEach(item => {
                console.log(item)
                if (item.list instanceof Array) {
                    let fileInfo = item.list[0];
                    fids.push(fileInfo.fsid)
                }
            })
        }

        let file_resp = await this.get_file(fids);

        if (file_resp.data && file_resp.data.list instanceof Array) {
            file_resp.data.list.forEach(item => {
                let file_info = {
                    "name": item.filename,
                    "dlink": item.dlink,
                    "image": item.thumbs.url4, // 这里取最大尺寸的缩略图
                    "path": item.path
                }
                res.push(file_info)
            })
        }
   
        return res;
    }

    private static async get_file(fsid: string[]) {
        let api = base_api + baidu_storage_get_file_api + "?method=filemetas&access_token=" + access_token + "&thumb=1&dlink=1&extra=1&needmedia=1&detail=1&fsids=" + JSON.stringify(fsid)
        return await axios.get(api);
    }
}

