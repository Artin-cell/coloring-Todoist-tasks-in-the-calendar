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
  },
  // ... rest of configuration
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
In `main.gs` replace examples with your sections:
```javascript
sectionColors: {
  '123456789': '7',  // Work → Blue
  '987654321': '1',  // Personal → Lavender
  '456789123': '5'   // Projects → Tangerine
}
```

## 🎨 Google Calendar Color Palette

| ID | Color | Description |
|----|-------|-------------|
| 1 | 🟣 | Lavender |
| 2 | 🟢 | Sage |
| 3 | 🟣 | Grape |
| 4 | 🔴 | Flamingo |
| 5 | 🟡 | Banana |
| 6 | 🟠 | Tangerine |
| 7 | 🔵 | Blue |
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
   - **Function:** `updateEventColorsBasedOnTodoistSections`
   - **Deployment:** Head
   - **Event:** Time-driven
   - **Type:** Daily/Hourly
   - **Time:** Choose convenient

## 🔧 Functions

### `doGet()` - Web Interface
- Manual synchronization trigger
- Returns JSON with result
- URL: `https://script.google.com/.../exec`

### `updateEventColorsBasedOnTodoistSections()` - Main Sync
- Fetches tasks from Todoist
- Fetches events from Google Calendar
- Matches and updates colors
- Works with events 30 days ahead

### `printTodoistSections()` - Debugging
- Prints all Todoist sections to console
- Helps get IDs for configuration

### `checkCurrentEventColors()` - Verification
- Shows current event colors
- Useful for debugging

## 🐛 Debugging & Logging

### Viewing Logs
1. In Apps Script editor
2. **Execution log** (🐞 → Logs)
3. Logs show:
   - Number of found events
   - Number of updated colors
   - Matching errors
   - Execution status

### Common Errors
```
❌ Todoist API token not found
→ Check CONFIG.todoist.apiToken in main.gs

❌ Calendar not found
→ Check CONFIG.calendar.id

? Section not found for: "Event Name"
→ Add mapping to sectionColors
```

## 📊 How It Works

1. **Data Collection:**
   - Tasks from Todoist (all active)
   - Events from Google Calendar (next 30 days)

2. **Matching:**
   - Compares event and task names
   - Looks for exact and partial matches

3. **Updating:**
   - Finds color for Todoist section
   - Applies color to calendar event
   - Only if color is different

## 🔒 Security

⚠️ **IMPORTANT:** Never publish your `main.gs` with real tokens!

Best practices:
1. Keep real tokens only in your local copy
2. For GitHub use example file with placeholders
3. Use `.gitignore` for files with sensitive data

## 🤝 Contributing

1. Fork the repository
2. Create branch (`git checkout -b feature/improvement`)
3. Commit (`git commit -am 'Add feature'`)
4. Push (`git push origin feature/improvement`)
5. Create Pull Request

---

## 📞 Support / Поддержка

**Issues:** [GitHub Issues](https://github.com/yourusername/todoist-calendar-sync/issues)

**⭐ If you find this useful, please star the repository! / ⭐ Если проект полезен, поставьте звезду!**
