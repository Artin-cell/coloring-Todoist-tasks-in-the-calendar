/**
 * Prints Todoist sections and their IDs to the console.
 * Uses the API token from the CONFIG variable in the "main.gs" file.
 */
function printTodoistSections() {
  try {
    // Check for token existence (access CONFIG from another file)
    const apiToken = CONFIG.todoist?.apiToken;
    
    if (!apiToken || apiToken === 'YOUR_TODOIST_API_TOKEN') {
      console.error('❌ Todoist API token not found in the "main.gs" file');
      console.log('Please specify your token in the "main.gs" file in the CONFIG.todoist.apiToken variable');
      return;
    }
    
    console.log('=== Fetching Todoist Sections ===');
    
    // Get all sections
    const url = 'https://api.todoist.com/rest/v2/sections';
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`Todoist API Error (${response.getResponseCode()}): ${response.getContentText()}`);
    }

    const sections = JSON.parse(response.getContentText());
    
    if (sections.length === 0) {
      console.log('No sections found');
      return;
    }
    
    // Print all sections
    sections.forEach(section => {
      console.log(`"${section.name}" -> ID: ${section.id}`);
    });
    
    console.log(`\n✅ Total sections: ${sections.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.toString());
  }
}
