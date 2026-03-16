
<div align="center">

<a href="https://github.com/Artin-cell/coloring-Todoist-tasks-in-the-calendar/blob/main/README.md">
  <img src="https://img.shields.io/badge/🇷🇺_Русский-181717?style=for-the-badge&logo=github&logoColor=white">
</a>
<a href="https://github.com/Artin-cell/coloring-Todoist-tasks-in-the-calendar/blob/main/README(EN).md">
  <img src="https://img.shields.io/badge/🇬🇧_English-181717?style=for-the-badge&logo=github&logoColor=white">
</a>

</div>

# 🌈 Todoist to Google Calendar Color Sync

Automatically colors Google Calendar events based on Todoist task sections. Project consists of two Google Apps Script files.

## 📁 Project Structure

### `main.gs` - Main Script
- Configuration for Todoist and Google Calendar connections
- Core color synchronization logic
- Web interface for manual triggering

### `getTodoistSections.gs` - Helper Script
- Retrieves Todoist section IDs
- Displays section list in console

## 🚀 Quick Start

### 1. Setup Todoist API Token
1. Go to [Todoist Settings](https://todoist.com/app/settings/integrations)
2. Navigate to **Developer** section
3. Copy your **API token**
4. Paste into `main.gs`:
```javascript
const CONFIG = {
  todoist: {
    apiToken: 'YOUR_TOKEN_HERE' // ← Paste here
  }
}
```

### 2. Get Calendar ID
1. Open [Google Calendar](https://calendar.google.com)
2. Find target calendar in left sidebar
3. Click ⋮ → **Settings and sharing**
4. Copy **Calendar ID**
5. Paste into `main.gs`:
```javascript
calendar: {
  id: 'COPIED_ID@group.calendar.google.com'
}
```

### 3. Get Todoist Section IDs
1. In Apps Script editor, select `printTodoistSections` function
2. Click **Run** (▶️)
3. Open **Execution log** (🐞 → Logs)
4. Copy section IDs like: `"Work" -> ID: 123456789`

### 4. Configure Color Mapping
In `main.gs` replace example placeholders with your real section IDs:
```javascript
sectionColors: {
  '123456789': '7',  // Work → Peacock
  '987654321': '1',  // Personal → Lavender
  '456789123': '5'   // Projects → Banana
}
```

## 🎨 Google Calendar Color Palette

| ID | Color | Name |
|----|-------|------|
| 1 | 🟣 | Lavender |
| 2 | 🟢 | Sage |
| 3 | 🟣 | Grape |
| 4 | 🔴 | Flamingo |
| 5 | 🟡 | Banana |
| 6 | 🟠 | Tangerine |
| 7 | 🔵 | Peacock |
| 8 | ⚫ | Graphite |
| 9 | 🔵 | Blueberry |
| 10 | 🟢 | Basil |
| 11 | 🔴 | Tomato |

## ⚙️ Automation Setup

### Web Application
1. In Apps Script editor: **Deploy** → **New deployment**
2. Type: **Web app**
3. Access: **Execute as me**, **Access: Anyone**
4. Copy URL for manual triggering

### Time-driven Trigger
1. In Apps Script editor: ⏰ **Triggers** → **Add trigger**
2. Settings:
   - **Function:** `updateEventColors`
   - **Deployment:** Head
   - **Event:** Time-driven
   - **Type:** Daily/Hourly
   - **Time:** Choose convenient

## 🔧 Functions

### `doGet()` — Web Interface
- Manual synchronization trigger via HTTP GET request
- Returns JSON with execution result
- URL: `https://script.google.com/.../exec`

### `updateEventColors()` — Main Sync
- Fetches tasks from Todoist **per section** (not all at once)
- Fetches calendar events for the range: 5 days ago → 30 days ahead
- Builds a task title → color map
- Updates event colors only when they differ from the target
- Supports pagination — handles sections with more than 50 tasks

### `getTasksBySection(sectionId)` — Todoist Fetcher
- Fetches all tasks for a given section ID
- Handles Todoist API pagination via `nextCursor`

### `findColorForEvent(eventTitle, titleColorMap)` — Matcher
- First tries exact match between event title and task name
- Falls back to partial match (one contains the other)

### `printTodoistSections()` — Setup Helper
- Prints all your Todoist sections with IDs to the console
- Use this to get IDs for `sectionColors` config

## 📊 How It Works

1. **Fetch events** from Google Calendar (5 days ago → 30 days ahead)

2. **Fetch tasks per section** — for each section ID defined in `sectionColors`, the script requests only tasks from that section via `/tasks?section_id=...`

3. **Build a map** of task titles → color IDs

4. **Match & colorize** — for each calendar event, find a matching task by title (exact or partial) and apply the corresponding color

5. **Skip unchanged** — if the event already has the correct color, it is not updated

## 🐛 Debugging & Logging

### Viewing Logs
1. In Apps Script editor
2. **Execution log** (🐞 → Logs)
3. Logs show:
   - Number of events found
   - Tasks fetched per section
   - Updated / skipped / unmatched counts

### Common Errors
```
❌ Calendar not found
→ Check CONFIG.calendar.id in main.gs

❌ Todoist API error
→ Check CONFIG.todoist.apiToken

? No match found for: "Event Name"
→ Make sure a Todoist task with the same name exists in one of the configured sections
```

## 🔒 Security

⚠️ **IMPORTANT:** Never publish your `main.gs` with real tokens!

Best practices:
1. Keep real tokens only in your local copy
2. For GitHub use the example file with placeholders
3. Use `.gitignore` for files with sensitive data

## 🤝 Contributing

1. Fork the repository
2. Create branch (`git checkout -b feature/improvement`)
3. Commit (`git commit -am 'Add feature'`)
4. Push (`git push origin feature/improvement`)
5. Create Pull Request

---

## 📞 Support

**Issues:** [GitHub Issues](https://github.com/Artin-cell/coloring-Todoist-tasks-in-the-calendar/issues)

**⭐ If you find this useful, please star the repository!**

