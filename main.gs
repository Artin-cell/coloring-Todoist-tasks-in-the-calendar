const CONFIG = {
  todoist: {
    apiToken: 'YOUR_TODOIST_API_TOKEN' // Get from: Todoist Settings -> Integrations -> Developer
  },
  calendar: {
    id: 'TODOIST_GOOGLE_CALENDAR_ID@group.calendar.google.com' // Get from Google Calendar settings
  },
  // Mapping between Todoist sections and calendar colors
  sectionColors: {
    'TODOIST_SECTION_ID_1': '7',  // Example Personal -> Blue
    'TODOIST_SECTION_ID_2': '1',  // Example Study -> Lavender
    'TODOIST_SECTION_ID_3': '5',  // Example Projects -> Tangerine
    'TODOIST_SECTION_ID_4': '2',  // Example Planned -> Sage
    'TODOIST_SECTION_ID_5': '8',  // Example Obligations -> Basil
    'TODOIST_SECTION_ID_6': '10'  // Example Entertainment -> Banana
  }
};

// AVAILABLE Google Calendar colors (ID -> name)
const CALENDAR_COLORS = {
  '1': 'Lavender',
  '2': 'Sage', 
  '3': 'Grape',
  '4': 'Flamingo',
  '5': 'Banana',
  '6': 'Tangerine',
  '7': 'Blue',
  '8': 'Graphite',
  '9': 'Blueberry',
  '10': 'Basil',
  '11': 'Tomato'
};

function doGet() {
  try {
    // Execute color update
    const result = updateEventColorsBasedOnTodoistSections();
    
    // Return result as JSON
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: result,
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString(),
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

function updateEventColorsBasedOnTodoistSections() {
  try {
    // 1. Get calendar
    const calendar = CalendarApp.getCalendarById(CONFIG.calendar.id);
    if (!calendar) {
      throw new Error('Calendar not found');
    }

    // 2. Define date range (next 30 days)
    const now = new Date();
    const future = new Date();
    now.setDate(now.getDate() - 5);
    future.setDate(now.getDate() + 30);
    
    // 3. Get events from calendar
    const events = calendar.getEvents(now, future);
    Logger.log(`Events found: ${events.length}`);

    // 4. Get tasks from Todoist
    const todoistTasks = getTodoistTasks();
    Logger.log(`Tasks from Todoist: ${todoistTasks.length}`);

    // 5. Create mapping (event title -> Todoist section)
    const taskSectionMap = createTaskSectionMap(todoistTasks);
    Logger.log('Mapping created');

    let updatedCount = 0;
    let notFoundCount = 0;

    // 6. Process all events and update colors
    events.forEach(event => {
      const eventTitle = event.getTitle();
      const sectionId = findSectionForTask(eventTitle, taskSectionMap);
      
      if (sectionId && CONFIG.sectionColors[sectionId]) {
        const targetColorId = CONFIG.sectionColors[sectionId];
        
        // Verify color is valid (1-11)
        if (targetColorId < 1 || targetColorId > 11) {
          Logger.log(`✗ Invalid color ID: ${targetColorId} for "${eventTitle}"`);
          notFoundCount++;
          return;
        }
        
        const currentColorId = event.getColor();
        
        // Change color only if different
        if (currentColorId !== targetColorId) {
          event.setColor(targetColorId);
          Logger.log(`✓ Updated: "${eventTitle}" -> ${CALENDAR_COLORS[targetColorId]}`);
          updatedCount++;
        } else {
          Logger.log(`= Color already correct: "${eventTitle}"`);
        }
      } else {
        Logger.log(`? Section not found for: "${eventTitle}"`);
        notFoundCount++;
      }
    });

    Logger.log(`\n=== RESULT ===`);
    Logger.log(`Total events: ${events.length}`);
    Logger.log(`Updated: ${updatedCount}`);
    Logger.log(`No match found: ${notFoundCount}`);
    Logger.log(`Colors already correct: ${events.length - updatedCount - notFoundCount}`);
    
  } catch (error) {
    Logger.log(`Error: ${error.toString()}`);
  }
}

// Gets all tasks from Todoist
function getTodoistTasks() {
  const url = 'https://api.todoist.com/rest/v2/tasks';
  const options = {
    'method': 'GET',
    'headers': {
      'Authorization': `Bearer ${CONFIG.todoist.apiToken}`
    },
    'muteHttpExceptions': true
  };

  const response = UrlFetchApp.fetch(url, options);
  
  if (response.getResponseCode() !== 200) {
    throw new Error(`Todoist API error: ${response.getContentText()}`);
  }

  return JSON.parse(response.getContentText());
}

// Creates map: task name -> section ID
function createTaskSectionMap(tasks) {
  const map = {};
  
  tasks.forEach(task => {
    if (task.section_id) {
      map[task.content] = task.section_id.toString();
      Logger.log(`Task: "${task.content}" -> Section ID: ${task.section_id}`);
    }
  });
  
  Logger.log(`Total tasks with sections: ${Object.keys(map).length}`);
  return map;
}

// Finds section for task by name
function findSectionForTask(eventTitle, taskSectionMap) {
  // Direct match
  if (taskSectionMap[eventTitle]) {
    return taskSectionMap[eventTitle];
  }
  
  // Partial match search (for minor differences)
  for (const [taskName, sectionId] of Object.entries(taskSectionMap)) {
    if (eventTitle.includes(taskName) || taskName.includes(eventTitle)) {
      Logger.log(`✓ Partial match found: "${eventTitle}" ~ "${taskName}"`);
      return sectionId;
    }
  }
  
  return null;
}

// Function to view current event colors
function checkCurrentEventColors() {
  const calendar = CalendarApp.getCalendarById(CONFIG.calendar.id);
  const now = new Date();
  const future = new Date();
  future.setDate(now.getDate() + 7);
  
  const events = calendar.getEvents(now, future);
  
  Logger.log('=== Current event colors (next 7 days) ===');
  events.forEach(event => {
    const colorId = event.getColor();
    Logger.log(`"${event.getTitle()}" -> Color: ${colorId} (${CALENDAR_COLORS[colorId] || 'unknown'})`);
  });
}
