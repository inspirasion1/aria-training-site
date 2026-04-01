export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()
  const { email, name, source } = req.body
  if (!email || !email.includes("@")) return res.status(400).json({ error: "Valid email required" })
  try {
    const r = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.raela_notion_key}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: "3b8084e6-86d9-443a-9fa7-9c1b5bb9d61e" },
        properties: {
          "Name": { title: [{ text: { content: name || email } }] },
          "Email": { email: email },
          "Source": { select: { name: source || "ARIA Site" } },
          "Status": { select: { name: "Active" } },
          "date:Signed Up:start": { date: { start: new Date().toISOString().split("T")[0] } }
        }
      })
    })
    if (!r.ok) {
      const err = await r.text()
      console.error("Notion error:", err)
      return res.status(500).json({ error: "Failed to subscribe" })
    }
    return res.status(200).json({ success: true })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: "Failed" })
  }
}