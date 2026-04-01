export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end()
  try {
    const r = await fetch("https://api.notion.com/v1/databases/05b14130-9028-4e55-9bb5-5af50051080e/query", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NOTION_TOKEN}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({ page_size: 100 })
    })
    const data = await r.json()
    const total = data.results?.length || 0
    const approved = data.results?.filter(p => p.properties?.Status?.select?.name === "Approved").length || 0
    const today = new Date().toISOString().split("T")[0]
    const todayCount = data.results?.filter(p => {
      const ts = p.properties?.Timestamp?.date?.start
      return ts && ts.startsWith(today)
    }).length || 0
    const sessions = new Set(data.results?.map(p => p.properties?.["Session ID"]?.rich_text?.[0]?.text?.content).filter(Boolean))
    return res.status(200).json({
      total,
      approved,
      todayCount,
      contributors: sessions.size,
    })
  } catch (e) {
    console.error(e)
    return res.status(200).json({ total: 0, approved: 0, todayCount: 0, contributors: 0 })
  }
}