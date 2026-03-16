/**
 * Todoist → Google Calendar Color Sync
 * 
 * Fetches tasks from specified Todoist sections and colorizes
 * matching Google Calendar events accordingly.
 * 
 * Setup:
 * 1. Replace YOUR_TODOIST_API_TOKEN with your Todoist API token
 * 2. Replace YOUR_ID_CAL with your Google Calendar ID
 * 3. Replace SECTION_ID_* with your Todoist section IDs
 * 4. Set desired color IDs (see color reference above)
 */

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

/**
  '1': 'Lavender',
  '2': 'Sage',
  '3': 'Grape',
  '4': 'Flamingo',
  '5': 'Banana',
  '6': 'Tangerine',
  '7': 'Peacock',
  '8': 'Graphite',
  '9': 'Blueberry',
  '10': 'Basil',
  '11': 'Tomato'
*/

function doGet() {
  try {
    const result = updateEventColors();
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: result, timestamp: new Date().toISOString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString(), timestamp: new Date().toISOString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function updateEventColors() {
  // 1. Get calendar and events
  const calendar = CalendarApp.getCalendarById(CONFIG.calendar.id);
  if (!calendar) throw new Error('Calendar not found');
  const now = new Date();
  now.setDate(now.getDate() - 5);
  const future = new Date();
  future.setDate(future.getDate() + 30);
  const events = calendar.getEvents(now, future);
  console.log('Events found in calendar:', events.length);
  // 2. Build map: event title → color
  // Iterate over each section and fetch its tasks
  const titleColorMap = {};
  for (const [sectionId, colorId] of Object.entries(CONFIG.sectionColors)) {
    console.log(`Fetching tasks for section ${sectionId} → color ${colorId}`);
    const tasks = getTasksBySection(sectionId);
    console.log(`  Tasks received: ${tasks.length}`);
    tasks.forEach(task => {
      titleColorMap[task.content] = colorId;
      console.log(`  Task: "${task.content}" → color ${colorId}`);
    });
  }
  console.log('Total tasks in map:', Object.keys(titleColorMap).length);
  // 3. Colorize events
  let updatedCount = 0;
  let skippedCount = 0;
  let notFoundCount = 0;
  events.forEach(event => {
    const title = event.getTitle();
    const targetColor = findColorForEvent(title, titleColorMap);
    if (targetColor) {
      const currentColor = event.getColor();
      if (currentColor !== targetColor) {
        event.setColor(targetColor);
        console.log(`✓ Updated: "${title}" → color ${targetColor}`);
        updatedCount++;
      } else {
        skippedCount++;
      }
    } else {
      notFoundCount++;
    }
  });
  const result = `Total events: ${events.length}, updated: ${updatedCount}, already correct color: ${skippedCount}, no match found: ${notFoundCount}`;
  console.log(result);
  return result;
}
// Fetch all tasks in a section (with pagination)
function getTasksBySection(sectionId) {
  const baseUrl = CONFIG.todoist.baseUrl + '/tasks?section_id=' + sectionId;
  let allTasks = [];
  let cursor = null;
  do {
    const url = cursor ? baseUrl + '&cursor=' + cursor : baseUrl;
    const response = UrlFetchApp.fetch(url, {
      method: 'get',
      headers: { Authorization: 'Bearer ' + CONFIG.todoist.apiToken },
      muteHttpExceptions: true
    });
    if (response.getResponseCode() !== 200) {
      console.log('Todoist API error:', response.getContentText());
      break;
    }
    const data = JSON.parse(response.getContentText());
    allTasks = allTasks.concat(data.results || []);
    cursor = data.nextCursor || null;
  } while (cursor !== null);
  return allTasks;
}
// Find color for an event (exact match first, then partial)
function findColorForEvent(eventTitle, titleColorMap) {
  if (titleColorMap[eventTitle]) {
    return titleColorMap[eventTitle];
  }
  for (const [taskName, colorId] of Object.entries(titleColorMap)) {
    if (eventTitle.includes(taskName) || taskName.includes(eventTitle)) {
      return colorId;
    }
  }
  return null;
}
