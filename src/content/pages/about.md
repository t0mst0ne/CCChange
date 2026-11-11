---
title: 關於 CCChange
description: CCChange 追蹤 Claude Code 與 OpenAI Codex 的版本更新，提供繁體中文講義。
updated: 2026-11-11
---

CCChange 追蹤 [Claude Code](https://github.com/anthropics/claude-code) 與 [OpenAI Codex](https://learn.chatgpt.com/docs/changelog) 的更新，寫成繁體中文講義。兩個產品各有獨立的列表、封存與 RSS。

每則講義固定回答三件事：

1. 改了什麼：查證發佈時間，把穩定版、預覽版與不同產品介面的更新分清楚。
2. 為什麼要改：說明先前哪裡卡住，區分官方說法與作者判讀。
3. 對你的流程有什麼影響：列出具體操作，沒有需要做的事就說不用管。

文章標註來源是官方文件、社群評測，還是本機實測。沒有實測的行為會明說；查不到更新資訊時，也不會把它寫成「沒有新版」。

---

## 這個站怎麼運作

既有 Claude Code 流程每天 **08:00（Asia/Taipei）** 出刊：

- Claude Code 依排程讀取 upstream CHANGELOG，比對版本時間
- 產出講義草稿，開一支 `daily/YYYY-MM-DD` 分支並發 Pull Request
- GitHub Actions 跑 CI（frontmatter 檢查、Astro build、連結檢查）
- CI 全綠且 PR 由授權作者送出時，workflow 自動合併
- 合併進 `main` 後自動部署到 GitHub Pages

Codex 專區已提供獨立的撰稿 skill 與版本查詢指令，可手動執行；每日排程要另外設定。
Codex 內容 PR 使用 `codex-daily` 標籤，通過相同的 CI 與授權檢查後才會自動合併。

版面使用 [Lipi](https://github.com/thelocalhoststudio/lipi)，一個 typography-first 的 Astro 模板，由 The Localhost Studio 製作。
