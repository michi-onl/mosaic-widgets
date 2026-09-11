const { CONFIG } = require("../config.js");
const { ConfigManager } = require("../core/config-manager.js");

async function showApiTokenSetupUI() {
  const alert = new Alert();
  alert.title = "API Token";
  alert.message =
    "Used to authenticate with api.michi.onl. Stored in Keychain, not synced via iCloud.";
  alert.addTextField("API Token", CONFIG.apiToken || "");
  alert.addAction("Save");
  alert.addCancelAction("Cancel");

  const result = await alert.presentAlert();
  if (result === -1) return false;

  ConfigManager.setApiToken(alert.textFieldValue(0).trim());
  return true;
}

async function showSetupUI(sourceName) {
  const config = CONFIG.sources[sourceName];
  if (!config) return false;

  const alert = new Alert();
  alert.title = `Configure ${config.name}`;

  const editableFields = ConfigManager.getEditableFields(sourceName);
  if (editableFields.length === 0) {
    alert.message = "No configurable settings for this source.";
    alert.addAction("OK");
    await alert.presentAlert();
    return false;
  }

  alert.message =
    "Edit settings below. Changes sync across devices via iCloud.";
  for (const field of editableFields) {
    const currentValue = config[field.key];
    const displayValue = Array.isArray(currentValue)
      ? currentValue.join(", ")
      : currentValue || "";
    alert.addTextField(field.label, displayValue);
  }

  alert.addAction("Save");
  alert.addCancelAction("Cancel");

  const result = await alert.presentAlert();
  if (result === -1) return false;

  const overrides = {};
  editableFields.forEach((field, index) => {
    const value = alert.textFieldValue(index);
    if (field.isArray) {
      overrides[field.key] = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      overrides[field.key] = value;
    }
  });

  ConfigManager.save({ [sourceName]: overrides });

  // Apply immediately to current CONFIG
  Object.assign(CONFIG.sources[sourceName], overrides);
  return true;
}

module.exports = { showApiTokenSetupUI, showSetupUI };
