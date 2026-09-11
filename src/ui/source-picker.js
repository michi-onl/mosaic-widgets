const { CONFIG } = require("../config.js");
const { ConfigManager } = require("../core/config-manager.js");
const { showApiTokenSetupUI, showSetupUI } = require("./config-ui.js");

async function pickSource() {
  const sourceNames = Object.keys(CONFIG.sources);
  const alert = new Alert();
  alert.title = "Mosaic";
  alert.message = "Choose a source to preview or configure.";

  alert.addAction("API Token ⚙️");
  for (const name of sourceNames) {
    const src = CONFIG.sources[name];
    const hasFields = ConfigManager.getEditableFields(name).length > 0;
    alert.addAction(`${src.name}${hasFields ? " ⚙️" : ""}`);
  }
  alert.addCancelAction("Cancel");

  const choice = await alert.presentAlert();
  if (choice === -1) return null;

  if (choice === 0) {
    await showApiTokenSetupUI();
    return pickSource();
  }

  const chosen = sourceNames[choice - 1];

  const editableFields = ConfigManager.getEditableFields(chosen);
  if (editableFields.length > 0) {
    const actionAlert = new Alert();
    actionAlert.title = CONFIG.sources[chosen].name;
    actionAlert.addAction("Show Widget");
    actionAlert.addAction("Configure");
    actionAlert.addCancelAction("Cancel");

    const action = await actionAlert.presentAlert();
    if (action === -1) return null;
    if (action === 1) {
      await showSetupUI(chosen);
    }
  }

  return chosen;
}

module.exports = { pickSource };
