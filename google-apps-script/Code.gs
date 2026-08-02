/**
 * Senior Year Hub — Google Drive sync backend
 * ---------------------------------------------
 * Paste this whole file into a new Apps Script project (script.google.com),
 * then deploy it as a Web App. Full steps are in the README.
 *
 * What it does: stores the entire Senior Year Hub data as ONE JSON file
 * in your Google Drive. GET returns the current file contents. POST
 * overwrites it with whatever JSON body is sent.
 *
 * There is no per-user login here on purpose — anyone who has the deployed
 * Web App URL can read and write the data, the same way anyone with your
 * family access code can open the app. Don't share the URL outside the
 * family, same as you wouldn't share the access code.
 */

var FILE_NAME = "senior-year-hub-data.json";

// Optionally put the file inside a specific Drive folder instead of "My
// Drive" root — paste the folder ID here (the long string in the folder's
// URL) or leave blank to just use root.
var FOLDER_ID = "";

function getDataFile_() {
  var folder = FOLDER_ID ? DriveApp.getFolderById(FOLDER_ID) : DriveApp.getRootFolder();
  var files = folder.getFilesByName(FILE_NAME);
  if (files.hasNext()) {
    return files.next();
  }
  return folder.createFile(FILE_NAME, "{}", MimeType.PLAIN_TEXT);
}

function doGet(e) {
  var file = getDataFile_();
  var content = file.getBlob().getDataAsString();
  return ContentService.createTextOutput(content).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var body = e && e.postData && e.postData.contents;
  if (!body) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: "No body received" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Make sure it's actually valid JSON before we overwrite the saved copy.
  try {
    JSON.parse(body);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: "Invalid JSON" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var file = getDataFile_();
  file.setContent(body);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
