function printTodoistSections() {
  console.log("=== printTodoistSections START ===");

  try {
    const apiToken = "YOUR_API_TOKEN_TODOIST";
    const baseUrl = "https://api.todoist.com/api/v1";

    if (!apiToken) {
      throw new Error("API token not specified");
    }

    const url = baseUrl + "/sections";
    console.log("Request to:", url);

    const options = {
      method: "get",
      headers: {
        Authorization: "Bearer " + apiToken
      },
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);

    const code = response.getResponseCode();
    const body = response.getContentText();

    console.log("HTTP code:", code);

    if (code !== 200) {
      console.error("Response error:", body);
      throw new Error("Todoist API Error (" + code + ")");
    }

    const data = JSON.parse(body);
    console.log("Response parsed");

    const sections = data.results || [];

    if (sections.length === 0) {
      console.log("⚠ Sections not found");
      return;
    }

    console.log("=== Sections list ===");

    sections.forEach(section => {
      console.log(
        `"${section.name}" → ID: ${section.id} | Project: ${section.project_id}`
      );
    });

    console.log("✅ Total sections:", sections.length);
    console.log("=== printTodoistSections END SUCCESS ===");

  } catch (error) {
    console.error("❌ Error:", error.toString());
  }
}
