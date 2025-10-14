import {generateMsToken} from "./utils";

export class DouyinAuth {
  private cookie: Record<string, string>
  private cookie_str: string
  private msToken: string

  constructor(cookie: string) {
    this.cookie = this.trans_cookies(cookie)
    this.cookie_str = cookie;

    if (this.cookie["msToken"]) {
      this.msToken = this.cookie["msToken"]
    } else  {
      this.msToken = generateMsToken()
    }

    this.cookie_str = Object.keys(this.cookie)
      .map(key => `${key}=${this.cookie[key]}`)
      .join('; ');
  }

  trans_cookies(cookiesStr: string): Record<string, string> {
    const cookies: Record<string, string> = {};

    // 分割cookie字符串并遍历每个cookie
    for (const cookie of cookiesStr.split('; ')) {
      try {
        // 找到第一个等号的位置
        const eqIndex = cookie.indexOf('=');
        if (eqIndex === -1) {
          continue; // 没有等号的情况跳过
        }

        // 分割键和值
        const key = cookie.substring(0, eqIndex);
        const value = cookie.substring(eqIndex + 1);

        cookies[key] = value;
      } catch (error) {
        // 处理可能的错误，继续下一个cookie
        continue;
      }
    }

    return cookies;
  }

  public get_cookie(): Record<string, string> {
    return this.cookie
  }

  public get_cookie_str():string {
    return this.cookie_str
  }

  public get_ms_token(): string {
    return this.msToken
  }
}

