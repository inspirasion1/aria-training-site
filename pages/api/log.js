export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()
  const { userMessage, ariResponse, sessionId } = req.body
  if (!userMessage || !ariResponse) return res.status(400).json({ error: "Missing fields" })
  try {
    const body = {
      parent: { database_id: "05b14130-9028-4e55-9bb5-5af50051080e" },
      properties: {
        "Interaction Title": { title: [{ text: { content: userMessage.slice(0,100) } }] },
        "User Message": { rich_text: [{ text: { content: userMessage.slice(0,2000) } }] },
        "AI Response": { rich_text: [{ text: { content: ariResponse.slice(0,2000) } }] },
        "Status": { select: { name: "Pending" } },
        "Source": { select: { name: "Public Training Site" } },
        "Session ID": { rich_text: [{ text: { content: sessionId || "" } }] },
        "Timestamp": { date: { start: new Date().toISOString().split("T")[0] } }
      }
    }
    console.log("Sending to Notion:", JSON.stringify(body))
    const r = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.raela_notion_key}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify(body)
    })
    const data = await r.json()
    if (!r.ok) {
      console.error("Notion full error:", JSON.stringify(data))
      return res.status(500).json({ error: "Notion error", detail: data })
    }
    res.status(200).json({ success: true })
  } catch (e) {
    console.error("Log exception:", e.message)
    res.status(500).json({ error: "Failed" })
  }
}