/**
 * AI 助手 API
 *
 * 调用外部 OpenAI 兼容接口 (支持 DeepSeek / OpenAI 等)
 */

export interface AIChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

const AI_CONFIG_KEY = 'ai-assistant-config';

const DEFAULT_CONFIG: AIConfig = {
  apiKey: '',
  baseUrl: 'https://api.deepseek.com/v1',
  model: 'deepseek-chat',
};

export function getAIConfig(): AIConfig {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(AI_CONFIG_KEY);
    if (saved) {
      try {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      } catch {}
    }
  }
  return { ...DEFAULT_CONFIG };
}

export function saveAIConfig(config: AIConfig): void {
  localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(config));
}

export async function sendChatMessage(
  messages: AIChatMessage[],
  onStream?: (chunk: string) => void,
): Promise<string> {
  const config = getAIConfig();

  if (!config.apiKey) {
    throw new Error('请先配置 API Key');
  }

  const url = `${config.baseUrl.replace(/\/+$/, '')}/chat/completions`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: 'system',
          content:
            '你是一个专业的数据平台AI助手。你擅长帮助用户分析数据、生成SQL查询、解读数据质量报告、提供ETL建议、排查数据问题。请用简洁专业的中文回答。',
        },
        ...messages,
      ],
      stream: !!onStream,
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(
      `API 请求失败 (${response.status}): ${errorBody || response.statusText}`,
    );
  }

  if (onStream && response.body) {
    // 流式响应
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));

      for (const line of lines) {
        const data = line.slice(6).trim();
        if (data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content || '';
          if (content) {
            fullContent += content;
            onStream(content);
          }
        } catch {}
      }
    }

    return fullContent;
  } else {
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }
}
