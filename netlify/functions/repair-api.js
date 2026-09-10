const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxZwfKxnEfDD3bCQkSNNXP89ysS4oj2kYyy454tAwLbNQcSm6Ioo3jMecClPvclYSJMfA/exec';

exports.handler = async function(event) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  };

  if (event.httpMethod === 'GET') {
    try {
      const res = await fetch(APPS_SCRIPT_URL, { method: 'GET', redirect: 'follow' });
      const text = await res.text();
      return { statusCode: res.ok ? 200 : 502, headers, body: text };
    } catch (err) {
      return { statusCode: 502, headers, body: JSON.stringify({ success:false, code:'PROXY_FETCH_FAILED', message:'Netlify không kết nối được Apps Script: ' + (err.message || String(err)) }) };
    }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ success:false, message:'Method not allowed' }) };
  }

  try {
    let rawBody = event.body || '{}';
    if (event.isBase64Encoded) rawBody = Buffer.from(rawBody, 'base64').toString('utf8');

    // Xác minh body là JSON trước khi chuyển tiếp để lỗi hiện rõ ở frontend.
    JSON.parse(rawBody || '{}');

    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: rawBody,
      redirect: 'follow'
    });
    const text = await res.text();

    if (!res.ok) {
      return { statusCode: 502, headers, body: JSON.stringify({ success:false, code:'APPS_SCRIPT_HTTP_' + res.status, message:'Apps Script HTTP ' + res.status, response:text.slice(0,500) }) };
    }

    // Apps Script phải trả JSON; nếu trả HTML thì biến thành lỗi JSON có mô tả.
    try {
      JSON.parse(text);
      return { statusCode: 200, headers, body: text };
    } catch (_) {
      return { statusCode: 502, headers, body: JSON.stringify({ success:false, code:'APPS_SCRIPT_NOT_JSON', message:'Apps Script không trả JSON. Kiểm tra deployment/quyền truy cập.', response:text.slice(0,500) }) };
    }
  } catch (err) {
    return { statusCode: 502, headers, body: JSON.stringify({ success:false, code:'PROXY_ERROR', message:err.message || String(err) }) };
  }
};
