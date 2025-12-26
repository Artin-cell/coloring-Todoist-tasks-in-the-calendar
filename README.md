# Todoist Calendar Color Sync

[🇺🇸 English](#english) | [🇷🇺 Русский](#русский)

---

<a name="русский"></a>
## 🌈 Синхронизатор цветов Todoist → Google Calendar

Автоматически раскрашивает события в Google Calendar на основе разделов задач в Todoist. Проект состоит из двух файлов Google Apps Script.

## 📁 Структура проекта

### `main.gs` - Основной скрипт
- Конфигурация подключения к Todoist и Google Calendar
- Основная логика синхронизации цветов
- Веб-интерфейс для ручного запуска

### `getTodoistSections.gs` - Вспомогательный скрипт
- Получение ID разделов Todoist
- Отображение списка разделов в консоли

## 🚀 Быстрый старт

### 1. Настройка API токена Todoist
1. Зайдите в [Todoist Settings](https://todoist.com/app/settings/integrations)
2. Перейдите в раздел **Developer**
3. Скопируйте ваш **API токен**
4. Вставьте в `main.gs`:
```javascript
const CONFIG = {
  todoist: {
    apiToken: 'ВАШ_ТОКЕН_ЗДЕСЬ' // ← Вставьте сюда
  },
  // ... остальная конфигурация
}
```

### 2. Получение ID календаря
1. Откройте [Google Calendar](https://calendar.google.com)
2. Найдите нужный календарь в левом меню
3. Нажмите ⋮ → **Настройки и доступ**
4. Скопируйте **ID календаря**
5. Вставьте в `main.gs`:
```javascript
calendar: {
  id: 'СКОПИРОВАННЫЙ_ID@group.calendar.google.com'
}
```

### 3. Получение ID разделов Todoist
1. В редакторе Apps Script выберите функцию `printTodoistSections`
2. Нажмите **Выполнить** (▶️)
3. Откройте **Журнал выполнения** (🐞 → Журналы)
4. Скопируйте ID нужных разделов вида: `"Работа" -> ID: 123456789`

### 4. Настройка соответствия цветов
В `main.gs` замените примеры своими разделами:
```javascript
sectionColors: {
  '123456789': '7',  // Работа → Голубой
  '987654321': '1',  // Личное → Лавандовый
  '456789123': '5'   // Проекты → Мандарин
}
```

## 🎨 Палитра цветов Google Calendar

| ID | Цвет | Описание |
|----|------|----------|
| 1 | 🟣 | Лавандовый (Lavender) |
| 2 | 🟢 | Шалфейный (Sage) |
| 3 | 🟣 | Виноградный (Grape) |
| 4 | 🔴 | Фламинго (Flamingo) |
| 5 | 🟡 | Банан (Banana) |
| 6 | 🟠 | Мандарин (Tangerine) |
| 7 | 🔵 | Голубой (Blue) |
| 8 | ⚫ | Графит (Graphite) |
| 9 | 🔵 | Черника (Blueberry) |
| 10 | 🟢 | Базилик (Basil) |
| 11 | 🔴 | Томат (Tomato) |

## ⚙️ Настройка автоматизации

### Веб-приложение
1. В редакторе Apps Script: **Развернуть** → **Новое развертывание**
2. Тип: **Веб-приложение**
3. Доступ: **Выполнять от моего имени**, **Доступ: любой**
4. Скопируйте URL для ручного запуска

### Триггер по времени
1. В редакторе Apps Script: ⏰ **Триггеры** → **Добавить триггер**
2. Настройки:
   - **Функция:** `updateEventColorsBasedOnTodoistSections`
   - **Развертывание:** Головной
   - **Событие:** По времени
   - **Тип:** Ежедневно/Ежечасно
   - **Время:** Выберите удобное

## 🔧 Функции

### `doGet()` - Веб-интерфейс
- Ручной запуск синхронизации
- Возвращает JSON с результатом
- URL: `https://script.google.com/.../exec`

### `updateEventColorsBasedOnTodoistSections()` - Основная синхронизация
- Получает задачи из Todoist
- Получает события из Google Calendar
- Сопоставляет и обновляет цвета
- Работает с событиями на 30 дней вперед

### `printTodoistSections()` - Отладка
- Выводит все разделы Todoist в консоль
- Помогает получить ID для конфигурации

### `checkCurrentEventColors()` - Проверка
- Показывает текущие цвета событий
- Полезно для отладки

## 🐛 Отладка и логирование

### Просмотр логов
1. В редакторе Apps Script
2. **Журнал выполнения** (🐞 → Журналы)
3. Логи показывают:
   - Количество найденных событий
   - Количество обновленных цветов
   - Ошибки сопоставления
   - Статус выполнения

### Типичные ошибки
```
❌ Todoist API token not found
→ Проверьте CONFIG.todoist.apiToken в main.gs

❌ Calendar not found
→ Проверьте CONFIG.calendar.id

? Section not found for: "Название события"
→ Добавьте соответствие в sectionColors
```

## 📊 Принцип работы

1. **Получение данных:**
   - Задачи из Todoist (все активные)
   - События из Google Calendar (ближайшие 30 дней)

2. **Сопоставление:**
   - Сравнивает названия событий и задач
   - Ищет точные и частичные совпадения

3. **Обновление:**
   - Находит цвет для раздела Todoist
   - Применяет цвет к событию в календаре
   - Только если цвет отличается

## 🔒 Безопасность

⚠️ **ВАЖНО:** Никогда не публикуйте ваш `main.gs` с реальными токенами!

Рекомендуемая практика:
1. Держите реальные токены только в вашей локальной копии
2. Для GitHub используйте файл-пример с placeholder'ами
3. Используйте `.gitignore` для файлов с конфиденциальными данными

## 🤝 Вклад

1. Форк репозитория
2. Создайте ветку (`git checkout -b feature/improvement`)
3. Закоммитьте (`git commit -am 'Add feature'`)
4. Запушьте (`git push origin feature/improvement`)
5. Создайте Pull Request

---

<a name="english"></a>
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
