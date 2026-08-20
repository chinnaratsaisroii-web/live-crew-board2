// ═══ บันทึกข้อมูลกลับขึ้น GitHub (ทำงานบน Vercel) ═══
// ต้องตั้งค่า Environment Variables ใน Vercel ก่อน:
//   GITHUB_TOKEN   = Personal Access Token ของ GitHub
//   GITHUB_REPO    = ชื่อผู้ใช้/ชื่อ-repo   เช่น somchai/live-crew
//   EDIT_PASSWORD  = รหัสผ่านสำหรับคนที่แก้ไขได้
//   GITHUB_BRANCH  = main   (ไม่ใส่ก็ได้)
//   DATA_PATH      = data.json   (ไม่ใส่ก็ได้)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "รองรับเฉพาะ POST" });
  }

  const TOKEN  = process.env.GITHUB_TOKEN;
  const REPO   = process.env.GITHUB_REPO;
  const PASS   = process.env.EDIT_PASSWORD;
  const BRANCH = process.env.GITHUB_BRANCH || "main";
  const PATH   = process.env.DATA_PATH || "data.json";

  if (!TOKEN || !REPO || !PASS) {
    return res.status(500).json({ error: "ยังไม่ได้ตั้งค่า Environment Variables ใน Vercel" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const { password, data } = body;

  if (password !== PASS) {
    return res.status(401).json({ error: "รหัสผ่านไม่ถูกต้อง" });
  }
  if (!data || !Array.isArray(data.points) || !data.points.length) {
    return res.status(400).json({ error: "รูปแบบข้อมูลไม่ถูกต้อง" });
  }

  const api = `https://api.github.com/repos/${REPO}/contents/${encodeURIComponent(PATH)}`;
  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "crew-board",
    "Content-Type": "application/json"
  };

  try {
    // 1) ขอ sha ของไฟล์เดิม (ถ้ามี)
    let sha;
    const cur = await fetch(`${api}?ref=${BRANCH}`, { headers });
    if (cur.ok) sha = (await cur.json()).sha;

    // 2) เขียนทับด้วยข้อมูลชุดใหม่
    const content = Buffer.from(JSON.stringify(data, null, 2), "utf8").toString("base64");
    const stamp = new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });

    const put = await fetch(api, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `อัปเดตรายชื่อผู้ประจำจุด ${stamp}`,
        content,
        branch: BRANCH,
        ...(sha ? { sha } : {})
      })
    });

    if (!put.ok) {
      const detail = (await put.text()).slice(0, 300);
      return res.status(502).json({ error: "GitHub ปฏิเสธการบันทึก", detail });
    }

    const json = await put.json();
    return res.status(200).json({
      ok: true,
      commit: json.commit?.sha?.slice(0, 7) || "",
      at: stamp
    });
  } catch (e) {
    return res.status(500).json({ error: "เกิดข้อผิดพลาด: " + String(e) });
  }
}
