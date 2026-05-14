/**
 * 百度云内容安全审核工具模块
 * 使用你在控制台申请的 API Key 和 Secret Key
 */

const API_KEY = 'ciCXad9TUoRtpmoBwysXQmr'; 
const SECRET_KEY = 'KlVlgYRoywQePMsMnTLK0YdXNRVR6aPu'; 

/**
 * 1. 获取 Access Token
 * 通过 Vite 代理 /baidu-api 解决跨域问题
 */
async function getAccessToken() {
  const url = `/baidu-api/oauth/2.0/token?grant_type=client_credentials&client_id=${API_KEY}&client_secret=${SECRET_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.access_token) {
      return data.access_token;
    } else {
      console.error('Token 获取失败，请检查 API Key:', data);
      return null;
    }
  } catch (err) {
    console.error('获取 Token 请求异常:', err);
    return null;
  }
}

/**
 * 2. 文本审核主函数
 * @param {string} text 需要审核的内容（建议标题+描述+选项合并）
 * @returns {Object} { safe: boolean, msg: string }
 */
export async function checkTextSafe(text) {
  try {
    const token = await getAccessToken();
    if (!token) return { safe: true, msg: '鉴权失败，跳过审核' };

    // 百度云文本审核接口地址
    const url = `/baidu-api/rest/2.0/solution/v1/img_conf/v1/text_censor/v1/user_defined?access_token=${token}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ text })
    });
    
    const result = await response.json();
    
    // 💡 调试利器：在控制台打印原始返回，解决“报表 0”但显示违规的疑惑
    console.log("--- 百度云 AI 审核返回数据 ---");
    console.log(result);
    console.log("---------------------------");

    /**
     * conclusionType 判定逻辑:
     * 1: 合规
     * 2: 不合规
     * 3: 疑似（建议人工复审，此处为了安全设为不通过）
     */
    if (result.conclusionType === 1) {
      return { safe: true };
    } else {
      // 提取百度返回的具体违规信息，例如“存在政治敏感”或“存在垃圾广告”
      const errorMsg = result.data?.[0]?.msg || '包含敏感内容，请修改后重试';
      return { safe: false, msg: errorMsg };
    }
  } catch (error) {
    console.error('审核服务通信异常:', error);
    // 接口异常（如网络问题或代理失效）时默认放行，确保用户能完成创建
    return { safe: true, msg: '服务响应超时，暂予放行' };
  }
}