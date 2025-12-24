# 🧠 Wise Extractor

### Turn your PDFs into RAG-ready data (without breaking the bank)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-8E75B2?logo=google)
![License](https://img.shields.io/badge/License-MIT-green)

Ever tried building a RAG system and realized half your documents are full of charts, diagrams, and images that your text-based pipeline just... ignores? Yeah, me too.

**Wise Extractor** pulls images out of PDFs, feeds them through Gemini's vision API, and spits out rich text descriptions you can actually index. No more blind spots in your knowledge base.

---

## 🤔 What's the problem here?

Here's the thing — most RAG setups are text-only. When someone asks about "the revenue chart on page 12" or "that architecture diagram", your system draws a blank because images never made it into the index.

**The obvious fix?** Use a multimodal RAG with vision models. But here's where it gets ugly:

- GPT-4V, Claude Vision, Gemini Vision — they all charge per image, per query
- At $0.01-0.03 per image, running 1,000 queries on a doc with 50 images = 💸
- Your costs scale with *traffic*, not just data size

**The smarter approach:** Describe each image once during ingestion, store that text, and query it forever with your regular text embeddings.

That's exactly what this tool does.

---

## 💰 Let's talk numbers

I built this because I was tired of choosing between "ignore images" and "pay through the nose."

### Per-image costs with Wise Extractor:

| What you get | The math |
|--------------|----------|
| ~600 tokens per image analysis | Input + output combined |
| ~$0.0001 per image | Using Gemini 2.5 Flash |
| ~10,000 images per dollar | Seriously. |

### Compare that to multimodal RAG:

Say you've got 1,000 images across your docs.

| Approach | Upfront | Per query | 1K queries/month |
|----------|---------|-----------|------------------|
| Send images to vision API every query | $0 | $10-30 | **$10,000-30,000** |
| Pre-describe with Wise Extractor | $0.10 | $0 | **$0.10 total** |

The math speaks for itself.

---

## ✨ What it actually does

- **Extracts real images** — Not screenshots. Actual embedded JPEGs/PNGs from the PDF structure.
- **Sorts photos from icons** — Big images go to `/photos`, small graphics go to `/icons`. Automatically.
- **Generates dense descriptions** — Each image gets a paragraph of context + tags, optimized for embedding.
- **Exports clean JSON** — Ready to pipe into your vector DB of choice.
- **Runs in your browser** — Nothing leaves your machine except the API calls you choose to make.
- **Beautiful dark theme** — Premium glassmorphism UI with animated PixelSnow background.
- **Mobile responsive** — Works beautifully on all screen sizes.

---

## 🚀 Getting started

```bash
git clone https://github.com/iammagdy/wise-extractor.git
cd wise-extractor
npm install
npm run dev
```

Open `http://localhost:5173` and drop a PDF.

For AI features, grab a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey) and paste it in.

---

## 🔑 About the API key

**This tool is 100% free.** But the AI magic needs a Gemini API key — yours, not mine.

Good news: Google's free tier is pretty generous.

| Tier | Requests/min | Daily limit | Cost |
|------|--------------|-------------|------|
| **Free** | 15 RPM | 1,500/day | $0 |
| **Paid** | 2,000 RPM | Unlimited | Pennies |

The app auto-detects which tier you're on and throttles accordingly. If you hit rate limits, it backs off gracefully instead of crashing.

---

## 🔐 Privacy stuff

- All PDF parsing happens in your browser (PDF.js)
- Images never touch any server
- API calls go directly from your browser to Google
- I don't see your key, your files, or your data

---

## 🛠️ Built with

- **React 19** + **Vite 7** — Fast dev, fast builds
- **Tailwind CSS 4** — Modern utility-first CSS
- **Three.js** — Powering the animated PixelSnow background
- **PDF.js** — Mozilla's battle-tested PDF engine
- **JSZip** — Client-side ZIP generation
- **Gemini 2.5 Flash** — For the vision stuff

---

## 📁 What you get in the download

```
wise-extractor-output.zip
├── photos/
│   ├── revenue_chart_q3_2024.jpg
│   └── team_photo_annual_meetup.jpg
├── photos_metadata/
│   ├── revenue_chart_q3_2024.json    ← AI description, tags, dimensions
│   └── team_photo_annual_meetup.json
├── icons/
│   └── arrow_icon_blue.png
└── icons_metadata/
    └── arrow_icon_blue.json
```

Each JSON file looks something like:
```json
{
  "filename": "revenue_chart_q3_2024.jpg",
  "description": "Bar chart showing quarterly revenue from Q1-Q4 2024. Q3 shows highest at $4.2M...",
  "tags": ["chart", "revenue", "financial", "quarterly", "bar-graph"],
  "width": 1200,
  "height": 800
}
```

Dump those descriptions into your embeddings pipeline and you're done.

---

## 🤝 Contributing

Found a bug? Want to add something? PRs welcome.

1. Fork it
2. Make your changes
3. Open a PR

No complicated process. Just don't break things.

---

## 📝 License

MIT. Do whatever you want with it.

---

## � Who made this

**Magdy Saber**

I build tools that solve problems I actually have. This was one of them.

- [magdysaber.com](https://magdysaber.com)
- [@iammagdy](https://github.com/iammagdy)

---

<p align="center">
  <em>Stop ignoring the visuals. Start indexing them.</em>
</p>
