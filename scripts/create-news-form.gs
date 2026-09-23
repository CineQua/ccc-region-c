/**
 * Creates the Region C news submission form and its responses Sheet.
 *
 * Run this ONCE, in Google Apps Script, signed in as the Region C account. It
 * builds the Form, links a Sheet, adds the Status moderation column with a
 * dropdown, shares the Sheet read-only by link, and prints the sheet id the
 * site needs.
 *
 * How to run it:
 *   1. Go to https://script.google.com and choose "New project".
 *   2. Delete the placeholder code, paste this file in, and save.
 *   3. Choose `createRegionCNewsForm` in the function dropdown, press Run.
 *   4. Approve the permissions prompt (it needs Forms, Sheets and Drive).
 *   5. Open View -> Logs (or the Execution log) and copy what it prints.
 *
 * The question wording below matches `lib/news-sheet.ts`, which maps columns by
 * header wording rather than position. Rewording a question is safe as long as
 * the key word survives: title, category, byline, summary, body, date, image,
 * status. See DEPLOYMENT.md.
 */

// ---------------------------------------------------------------- settings --

var FORM_TITLE = 'Region C News & Announcements';
var FORM_DESCRIPTION =
  'Submit an announcement for the Region C website. Submissions are reviewed ' +
  'before they appear: nothing is published until a member of the Secretariat ' +
  'marks it Published.';
var SHEET_NAME = 'Region C News (responses)';

/** Must stay in step with NewsCategory in lib/types.ts. */
var CATEGORIES = ['Region News', 'Parish News', 'Diocese', 'Evangelism', 'Youth', 'Events'];

/** Set false if submitters should not have to sign in to a Google account. */
var COLLECT_EMAIL = true;

// ------------------------------------------------------------------- main --

function createRegionCNewsForm() {
  var form = FormApp.create(FORM_TITLE);
  form.setDescription(FORM_DESCRIPTION);
  form.setCollectEmail(COLLECT_EMAIL);
  form.setLimitOneResponsePerUser(false);
  form.setAllowResponseEdits(true);
  form.setConfirmationMessage(
    'Thank you. Your announcement has been received and will appear on the ' +
      'Region C website once it has been reviewed.'
  );

  form
    .addTextItem()
    .setTitle('Post title')
    .setHelpText('The headline. This also becomes the page address, e.g. /news/regional-day-announced')
    .setRequired(true);

  form
    .addListItem()
    .setTitle('Category')
    .setChoiceValues(CATEGORIES)
    .setRequired(true);

  form
    .addTextItem()
    .setTitle('Byline')
    .setHelpText('Who the announcement is from. Leave blank for "Region C Secretariat".');

  form
    .addParagraphTextItem()
    .setTitle('Summary')
    .setHelpText('One or two sentences. Shown on the news listing. Leave blank to use the opening of the body.');

  form
    .addParagraphTextItem()
    .setTitle('Body')
    .setHelpText('The announcement itself. Leave a BLANK LINE between paragraphs.')
    .setRequired(true);

  form
    .addDateItem()
    .setTitle('Publication date')
    .setHelpText('The date shown on the post. Leave blank to use the date it was submitted.');

  form
    .addTextItem()
    .setTitle('Image URL')
    .setHelpText('Optional. A direct link to a picture (must start with https://).');

  // ------------------------------------------------------------ the sheet --

  var spreadsheet = SpreadsheetApp.create(SHEET_NAME);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());
  SpreadsheetApp.flush();

  // Re-open so the freshly created responses tab is visible to the script.
  var book = SpreadsheetApp.openById(spreadsheet.getId());
  var sheet = findResponsesSheet(book);

  var statusColumn = Math.max(sheet.getLastColumn(), 1) + 1;
  sheet.getRange(1, statusColumn).setValue('Status');
  sheet.getRange(1, statusColumn).setFontWeight('bold');
  sheet.setColumnWidth(statusColumn, 120);

  // A dropdown, so approving a post is one click and cannot be mistyped.
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Pending', 'Published'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, statusColumn, Math.max(sheet.getMaxRows() - 1, 1)).setDataValidation(rule);

  sheet.setFrozenRows(1);

  // The API key can only read a sheet that is readable by link.
  DriveApp.getFileById(spreadsheet.getId()).setSharing(
    DriveApp.Access.ANYONE_WITH_LINK,
    DriveApp.Permission.VIEW
  );

  // ----------------------------------------------------------- what to do --

  var lines = [
    '',
    '=========================================================',
    ' Region C news form created',
    '=========================================================',
    '',
    'Share this link with anyone who may submit news:',
    '  ' + form.getPublishedUrl(),
    '',
    'Edit the form here:',
    '  ' + form.getEditUrl(),
    '',
    'Responses sheet (Status column is the last one):',
    '  ' + book.getUrl(),
    '',
    '---------------------------------------------------------',
    'PASTE THIS INTO VERCEL as NEWS_SHEET_ID:',
    '',
    '  ' + spreadsheet.getId(),
    '',
    '---------------------------------------------------------',
    'Still to do:',
    '  1. In Google Cloud, enable the Sheets API on the same',
    '     project as the calendar key, and add the Sheets API',
    '     to that key\'s API restrictions. The key is currently',
    '     Calendar-only and will not read this sheet until then.',
    '  2. Add NEWS_SHEET_ID in Vercel, then redeploy.',
    '  3. A row only appears on the site once its Status cell',
    '     reads Published. Blank means not published.',
    '=========================================================',
    '',
  ];
  Logger.log(lines.join('\n'));
}

/** The form's responses tab, whatever Google named it in this locale. */
function findResponsesSheet(book) {
  var sheets = book.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (/form\s*responses/i.test(sheets[i].getName())) return sheets[i];
  }
  return sheets[0];
}
