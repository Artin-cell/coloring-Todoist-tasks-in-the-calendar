const CONFIG = { 
  todoist: {
    apiToken: 'YOUR_TODOIST_API_TOKEN',
    baseUrl: 'https://api.todoist.com/api/v1'
  },
  calendar: {
    id: 'YOUR_ID_CAL'
  },

  sectionColors: {
    'SECTION_ID_1': '7', 
    'SECTION_ID_2': '1', 
    'SECTION_ID_3': '5',
    'SECTION_ID_4': '2',
    'SECTION_ID_5': '8',
    'SECTION_ID_6...': '10'
  }
};

const CALENDAR_COLORS = {
  '1': 'Лавандовый',
  '2': 'Шалфейный', 
  '3': 'Виноградный',
  '4': 'Фламинго',
  '5': 'Банан',
  '6': 'Мандарин',
  '7': 'Голубой',
  '8': 'Графит',
  '9': 'Черника',
  '10': 'Базилик',
  '11': 'Томат'
};


function doGet() {
  console.log("=== doGet START ===");

  try {
    const result = updateEventColorsBasedOnTodoistSections();

    console.log("=== doGet SUCCESS ===");

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: result,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.log("ERROR in doGet:", error);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


function updateEventColorsBasedOnTodoistSections() {
  console.log("1️⃣ Получаем календарь");

  const calendar = CalendarApp.getCalendarById(CONFIG.calendar.id);
  if (!calendar) throw new Error('Календарь не найден');

  console.log("Календарь найден:", CONFIG.calendar.id);

  const now = new Date();
  now.setDate(now.getDate() - 5);

  const future = new Date();
  future.setDate(now.getDate() + 30);

  console.log("2️⃣ Диапазон дат:", now, "→", future);

  const events = calendar.getEvents(now, future);
  console.log("3️⃣ Найдено событий:", events.length);

  console.log("4️⃣ Получаем задачи из Todoist");
  const todoistTasks = getTodoistTasks();
  console.log("Получено задач:", todoistTasks.length);

  console.log("5️⃣ Создаем карту соответствий");
  const taskSectionMap = createTaskSectionMap(todoistTasks);
  console.log("Карта создана. Размер:", Object.keys(taskSectionMap).length);

  let updatedCount = 0;
  let notFoundCount = 0;

  console.log("6️⃣ Начинаем обработку событий");

  events.forEach(event => {
    const eventTitle = event.getTitle();
    console.log("Проверяем событие:", eventTitle);

    const sectionId = findSectionForTask(eventTitle, taskSectionMap);

    if (sectionId) {
      console.log("Найден sectionId:", sectionId);

      if (CONFIG.sectionColors[sectionId]) {
        const targetColorId = CONFIG.sectionColors[sectionId];
        console.log("Целевой цвет:", targetColorId, CALENDAR_COLORS[targetColorId]);

        const currentColorId = event.getColor();
        console.log("Текущий цвет:", currentColorId);

        if (currentColorId !== targetColorId) {
          event.setColor(targetColorId);
          console.log("✓ Цвет обновлен");
          updatedCount++;
        } else {
          console.log("= Цвет уже правильный");
        }

      } else {
        console.log("⚠ Нет соответствия цвета для sectionId:", sectionId);
        notFoundCount++;
      }

    } else {
      console.log("✗ Раздел не найден для события");
      notFoundCount++;
    }
  });

  console.log("=== РЕЗУЛЬТАТ ===");
  console.log("Всего событий:", events.length);
  console.log("Обновлено:", updatedCount);
  console.log("Без соответствий:", notFoundCount);

  return `Всего событий: ${events.length}, обновлено: ${updatedCount}, без соответствий: ${notFoundCount}`;
}


// Новый API Todoist
function getTodoistTasks() {
  const url = CONFIG.todoist.baseUrl + '/tasks';

  console.log("Запрос к Todoist:", url);

  const response = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + CONFIG.todoist.apiToken
    },
    muteHttpExceptions: true
  });

  console.log("Ответ Todoist. Код:", response.getResponseCode());

  if (response.getResponseCode() !== 200) {
    console.log("Ошибка ответа:", response.getContentText());
    throw new Error('Todoist API error: ' + response.getContentText());
  }

  const data = JSON.parse(response.getContentText());
  console.log("Данные получены");

  return data.results || [];
}


function createTaskSectionMap(tasks) {
  console.log("Создаем карту задач → разделов");

  const map = {};

  tasks.forEach(task => {
    console.log("Задача:", task.content, "| section_id:", task.section_id);

    if (task.section_id) {
      map[task.content] = task.section_id.toString();
    }
  });

  return map;
}


function findSectionForTask(eventTitle, taskSectionMap) {
  console.log("Ищем раздел для:", eventTitle);

  if (taskSectionMap[eventTitle]) {
    console.log("✓ Прямое совпадение");
    return taskSectionMap[eventTitle];
  }

  for (const [taskName, sectionId] of Object.entries(taskSectionMap)) {
    if (eventTitle.includes(taskName) || taskName.includes(eventTitle)) {
      console.log("✓ Частичное совпадение:", taskName);
      return sectionId;
    }
  }

  console.log("✗ Совпадение не найдено");
  return null;
}
