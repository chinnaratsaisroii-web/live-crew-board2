# ผังรายชื่อผู้ประจำจุด — วิธีติดตั้ง

เว็บนี้ไม่มีฐานข้อมูล แต่เก็บข้อมูลไว้ในไฟล์ `data.json` บน GitHub
เมื่อกดบันทึกในหน้าเว็บ ระบบจะเขียนไฟล์นั้นทับให้อัตโนมัติ

## ไฟล์ในโปรเจกต์
| ไฟล์ | หน้าที่ |
|---|---|
| `index.html` | หน้าเว็บ |
| `data.json` | รายชื่อทั้งหมด (ไฟล์นี้คือฐานข้อมูล) |
| `api/save.js` | ตัวเขียนข้อมูลกลับขึ้น GitHub (ทำงานบน Vercel) |

---

## ขั้นที่ 1 — อัปขึ้น GitHub
1. เข้า github.com กด **+ → New repository** ตั้งชื่อเช่น `live-crew` เลือก **Private** ก็ได้ (Vercel เข้าถึงได้)
2. กด **Add file → Upload files** ลากไฟล์ทั้งหมดเข้าไป **โดยต้องคงโฟลเดอร์ `api` ไว้**
   (ถ้าลากโฟลเดอร์ไม่ได้ ให้อัป `index.html` กับ `data.json` ก่อน แล้วกด **Add file → Create new file**
   พิมพ์ชื่อไฟล์ว่า `api/save.js` แล้ววางโค้ดจากไฟล์ `api/save.js` ลงไป)
3. กด **Commit changes**

## ขั้นที่ 2 — สร้าง Token ของ GitHub
1. ไปที่ **Settings ของบัญชี → Developer settings → Personal access tokens → Fine-grained tokens**
2. กด **Generate new token** ตั้งชื่ออะไรก็ได้ เลือกอายุ 1 ปี
3. **Repository access** เลือก **Only select repositories** แล้วเลือก repo ที่เพิ่งสร้าง
4. **Permissions → Repository permissions → Contents** ตั้งเป็น **Read and write**
5. กด Generate แล้ว **คัดลอกโทเคนเก็บไว้** (แสดงครั้งเดียว)

## ขั้นที่ 3 — ขึ้น Vercel
1. เข้า vercel.com กด **Sign up with GitHub**
2. กด **Add New → Project** เลือก repo ที่สร้างไว้ กด **Import**
3. ก่อนกด Deploy ให้เปิดหัวข้อ **Environment Variables** แล้วใส่ 3 ตัวนี้

| Key | Value |
|---|---|
| `GITHUB_TOKEN` | โทเคนจากขั้นที่ 2 |
| `GITHUB_REPO` | `ชื่อผู้ใช้/ชื่อ-repo` เช่น `somchai/live-crew` |
| `EDIT_PASSWORD` | รหัสผ่านที่ตั้งเอง สำหรับคนที่มีสิทธิ์แก้ไข |

4. กด **Deploy** รอประมาณ 1 นาที จะได้ลิงก์ `https://ชื่อโปรเจกต์.vercel.app`

## ขั้นที่ 4 — ใช้งาน
1. เปิดลิงก์ Vercel กด **✏️ แก้ไขรายชื่อ**
2. พิมพ์ชื่อ กรอกรหัสผ่านในแถบล่าง แล้วกด **☁️ บันทึกขึ้น GitHub**
3. ไฟล์ `data.json` ใน GitHub จะถูกอัปเดต และ Vercel จะ deploy ใหม่เองใน 1-2 นาที

---

## หมายเหตุ
- คนที่ไม่มีรหัสผ่านจะแก้ไขไม่ได้ ทำได้แค่ดูและกดโทร
- โทเคนถูกเก็บไว้ที่ Vercel เท่านั้น ไม่ได้อยู่ในหน้าเว็บ จึงไม่รั่วให้คนอื่นเห็น
- ปุ่ม **💾 บันทึกเป็นไฟล์** ไว้ดาวน์โหลด `data.json` เก็บสำรอง หรือใช้ตอนเน็ตล่ม แล้วค่อยอัปทับใน GitHub ทีหลัง
- ประวัติการแก้ไขทุกครั้งดูย้อนหลังได้ในแท็บ **Commits** ของ GitHub และกู้คืนได้
