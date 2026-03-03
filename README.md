<div align="center">

<a href="https://github.com/Artin-cell/coloring-Todoist-tasks-in-the-calendar/blob/main/README.md">
  <img src="https://img.shields.io/badge/🇷🇺_Русский-181717?style=for-the-badge&logo=github&logoColor=white">
</a>
<a href="https://github.com/Artin-cell/coloring-Todoist-tasks-in-the-calendar/blob/main/README(EN).md">
  <img src="https://img.shields.io/badge/🇬🇧_English-181717?style=for-the-badge&logo=github&logoColor=white">
</a>

</div>

# Todoist Calendar Color Sync

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


