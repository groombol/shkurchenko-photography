const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: 'Method Not Allowed' };
  }

  const token  = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('[telegram.js] Env vars TELEGRAM_TOKEN / TELEGRAM_CHAT_ID are missing');
    return { statusCode: 500, headers: CORS_HEADERS, body: 'Server misconfiguration' };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers: CORS_HEADERS, body: 'Invalid JSON' };
  }

  const { contact = '—', type = '—', message = 'не указаны' } = body;

  const text =
    `📸 *Новая заявка с сайта*\n\n` +
    `📞 *Контакт:* ${contact}\n` +
    `🎬 *Тип съемки:* ${type}\n` +
    `💬 *Пожелания:* ${message}`;

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
      }
    );

    if (!tgRes.ok) {
      const errBody = await tgRes.text();
      console.error('[telegram.js] TG API error:', tgRes.status, errBody);
      return { statusCode: 502, headers: CORS_HEADERS, body: 'Telegram API error' };
    }

    return { statusCode: 200, headers: CORS_HEADERS, body: 'OK' };

  } catch (err) {
    console.error('[telegram.js] fetch failed:', err);
    return { statusCode: 500, headers: CORS_HEADERS, body: 'Internal error' };
  }
};
