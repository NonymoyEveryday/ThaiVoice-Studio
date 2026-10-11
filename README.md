# ThaiVoice Studio 🎙️✨

**ThaiVoice Studio** เป็นเว็บแอปพลิเคชันสำหรับจัดการบทความภาษาไทย สรุปเนื้อหาด้วยปัญญาประดิษฐ์ แนะนำแท็กสำคัญ และสังเคราะห์ข้อความเป็นเสียงพูดภาษาไทยธรรมชาติ พัฒนาขึ้นเพื่อเป็น Mini Project AI สำหรับนักศึกษามหาวิทยาลัย โดยเชื่อมต่อกับ **AIForThai API** จริง (NECTEC/NSTDA) พร้อม UI/UX ระดับ Modern SaaS Application

---

## 🌟 ฟังก์ชันหลัก 5 ฟังก์ชัน (Core Features)

1. **Content Editor (ระบบเขียนและจัดการเนื้อหา)**
   - พื้นที่เขียน/วางข้อความภาษาไทย พร้อมตัวอย่างบทความสำหรับทดสอบ
   - ระบบนับจำนวนตัวอักษร และนับจำนวนคำภาษาไทยด้วย `Intl.Segmenter` (Thai Word Boundary มาตรฐานเบราว์เซอร์)
   - บันทึกฉบับร่างอัตโนมัติด้วย `localStorage`
   - คัดลอกเนื้อหา, ล้างข้อความ, และดาวน์โหลดเนื้อหาต้นฉบับเป็น `.txt`
   - ระบบแจ้งเตือนอัตโนมัติเมื่อเนื้อหาต้นฉบับถูกแก้ไขหลังจากประมวลผลแล้ว

2. **AI Summarizer (สรุปความเนื้อหาภาษาไทย)**
   - เชื่อมต่อ **AIForThai Text Summarize API** (`/textsummarize`) ด้วยโมเดล Deep Learning (GRU)
   - รองรับการปรับระดับการสรุปเนื้อหา 20%, 30%, และ 40%
   - ตรวจสอบเงื่อนไขความยาว 400 - 1,000 คำ พร้อมคำเตือนข้อจำกัดเฉพาะทาง (ด้านข่าวเศรษฐกิจ)
   - คัดลอกและส่งข้อความที่สรุปแล้วไปยังระบบสร้างเสียงพูดได้ในคลิกเดียว

3. **AI Tag Suggestion (ระบบแนะนำป้ายกำกับบทความ)**
   - เชื่อมต่อ **AIForThai Tag Suggestion API** (`/tagsuggestion`)
   - เลือกระบุจำนวนแท็กที่ต้องการ (3, 5, 8, 10 แท็ก)
   - แสดงผลลัพธ์เป็น Badge พร้อมค่าน้ำหนักความสำคัญ (Relevance Score)
   - คัดลอกรายการแท็กทั้งหมด และดาวน์โหลดเป็น `.txt` ได้ทันที

4. **AI Voice Generator (ระบบสังเคราะห์เสียงพูดภาษาไทย)**
   - เชื่อมต่อ **AIForThai VAJA Text-to-Speech API** (`/vaja`)
   - เลือกแหล่งข้อความได้อิสระ: ข้อความต้นฉบับ หรือ ข้อความสรุป
   - รองรับเสียงผู้พูดมากกว่า 15 เสียง (เช่น Nana, Noina, Farah, Prim, Poom, Doikham ฯลฯ)
   - เล่นและหยุดเสียงผ่าน Web Audio Player พร้อมดาวน์โหลดไฟล์ `.wav` จริง
   - ปลอดภัยด้วย Next.js Backend Audio Proxy (Stream ไฟล์เสียงโดยไม่เปิดเผย API Key สู่ภายนอก)

5. **English to Thai Translation (ระบบแปลภาษา เสี่ยวฟ่าน: Xiaofan)**
   - เชื่อมต่อ **AIForThai Xiaofan API** (`/xiaofan-en-th/en2th`)
   - ระบบแปลภาษาอังกฤษเป็นไทยด้วย Neural Machine Translation
   - รองรับข้อความยาวสูงสุด 1,000 ตัวอักษร
   - มีปุ่ม **"ส่งเข้า Editor เพื่อวิเคราะห์ต่อ"** นำคำแปลเข้าสู่ Editor ด้านซ้ายเพื่อนำไปสรุปความหรือสร้างเสียงพูดต่อได้ทันที

6. **Export Content Hub (ศูนย์ดาวน์โหลดข้อมูล)**
   - ดาวน์โหลดข้อความต้นฉบับ (`article_original.txt`)
   - ดาวน์โหลดข้อความสรุป (`article_summary.txt`)
   - ดาวน์โหลดแท็กและคะแนน (`suggested_tags.txt`)
   - ดาวน์โหลดไฟล์เสียงพูด (`.wav`)
   - ปุ่มดาวน์โหลดแสดงสถานะพร้อมใช้งานเฉพาะข้อมูลที่มีอยู่จริง

---

## 🛠️ สถาปัตยกรรมและเทคโนโลยีที่ใช้ (Tech Stack)

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Typography**: Google Fonts Prompt & Sarabun (ฟอนต์ภาษาไทยทันสมัย อ่านง่าย)
- **API Backend**: Next.js Route Handlers (Server-Side Proxy ไปยัง AIForThai)
- **Storage**: Client-side LocalStorage (ไม่ต้องพึ่งพา External Database)

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```
agv/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── audio-proxy/route.ts  # Proxy สตรีมไฟล์เสียง .wav ปลอดภัย
│   │   │   ├── health/route.ts       # ตรวจสอบสถานะการเชื่อมต่อ AIForThai
│   │   │   ├── summarize/route.ts    # เรียก AIForThai Text Summarize API
│   │   │   ├── tags/route.ts         # เรียก AIForThai Tag Suggestion API
│   │   │   └── tts/route.ts          # เรียก AIForThai VAJA TTS API
│   │   ├── globals.css               # สไตล์และฟอนต์ภาษาไทย
│   │   ├── layout.tsx                # โครงสร้าง Layout และ Metadata ภาษาไทย
│   │   └── page.tsx                  # หน้าจอหลัก Single-Page Dashboard
│   ├── components/
│   │   ├── ContentEditor.tsx         # Text Editor และตัวนับคำ/ตัวอักษร
│   │   ├── ExportPanel.tsx           # Hub ดาวน์โหลดไฟล์ TXT/WAV
│   │   ├── Navbar.tsx                # แถบเมนูพร้อมสถานะ API Real-time
│   │   ├── SummaryCard.tsx           # การ์ดแสดงผลการสรุปเนื้อหา
│   │   ├── TagCard.tsx               # การ์ดแสดงผลแท็กพร้อมคะแนน
│   │   ├── ToastContainer.tsx        # ระบบแจ้งเตือน Toast Feedback
│   │   └── VoiceCard.tsx             # เครื่องเล่นเสียงและเลือกผู้พูด VAJA
│   ├── lib/
│   │   └── thai-utils.ts             # ฟังก์ชันนับคำภาษาไทยและรายชื่อผู้พูด
│   └── types/
│       └── index.ts                  # TypeScript Interfaces ทั้งหมด
├── .env.example                      # ไฟล์ตัวอย่าง Environment Variables
├── .env.local                        # ไฟล์คีย์จริง (ไม่ถูก commit ขึ้น Git)
├── package.json
└── README.md
```

---

## 🚀 วิธีติดตั้งและรันโปรเจกต์ (Getting Started)

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า API Key

คัดลอกไฟล์ `.env.example` เป็น `.env.local`:

```bash
cp .env.example .env.local
```

เปิดไฟล์ `.env.local` แล้วใส่ API Key ที่ได้รับจาก AIForThai:

```env
AIFORTHAI_API_KEY=your_aiforthai_api_key_here
```

> **หมายเหตุความปลอดภัย:** API Key จะถูกเรียกใช้งานผ่าน Backend Route Handlers เท่านั้น จะไม่มีการส่งคีย์ออกไปยัง Browser Client ของผู้ใช้งาน

### 3. รัน Development Server

```bash
npm run dev
```

เปิดเว็บเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

### 4. Build สำหรับ Production

```bash
npm run build
npm start
```

---

## 📤 วิธีนำโปรเจกต์ขึ้น GitHub (Git Workflow)

```bash
# 1. ตรวจสอบสถานะไฟล์ (ตรวจดูว่า .env.local ไม่ได้ถูก track)
git status

# 2. เพิ่มไฟล์ทั้งหมดเข้า Staging
git add .

# 3. บันทึก Commit
git commit -m "feat: ThaiVoice Studio full-stack mini project with AIForThai integration"

# 4. ตั้งค่า Remote Repository และ Push ขึ้น GitHub
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/thaivoice-studio.git
git push -u origin main
```

---

## 🎓 คำแนะนำสำหรับการอัดคลิปนำเสนอ Mini Project

1. **เปิดหน้าแรกของเว็บ:** ชี้ให้เห็นการออกแบบสไตล์ Modern SaaS ที่สะอาดตา โทนสี Indigo/Blue และ Badge สถานะ API สีเขียว "พร้อมใช้งาน"
2. **สาธิต Content Editor:** กดใส่ "บทความตัวอย่าง" ชี้ให้เห็นตัวนับจำนวนตัวอักษร และตัวนับคำที่ใช้ฟังก์ชัน `Intl.Segmenter` ภาษาไทยจริง
3. **สาธิต AI Summarizer:** เลือกระดับการสรุป (20%-40%) แล้วกด "เริ่มสรุปเนื้อหา" แสดงผลลัพธ์ที่ตอบกลับจากโมเดล Deep Learning (GRU)
4. **สาธิต Tag Suggestion:** เลือกจำนวนแท็กแล้วกด "ดึงแท็กแนะนำ" แสดงคะแนนความสอดคล้อง (Relevance Score)
5. **สาธิต VAJA TTS:** กดปุ่ม "ส่งไปอ่านเสียง" จากสรุป หรือเลือกข้อความสั้น เลือกเสียงผู้พูด (เช่น นานา, น้อยหน่า, ดอยคำ) แล้วกดเล่นเสียงจริง พร้อมดาวน์โหลด `.wav`
6. **สาธิต Export Content Hub:** แสดงการดาวน์โหลดผลลัพธ์แยกตามประเภทไฟล์ (.txt และ .wav)

---

&copy; ThaiVoice Studio &bull; พัฒนาโดย Senior Full-Stack Developer สำหรับโครงงานการศึกษา
