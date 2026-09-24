/**
 * Region C news approvals — a small web app for reviewing submissions.
 *
 * Lists every pending row from the news responses Sheet, shows the whole post,
 * and approves or rejects it in one tap. Approving sets Status to Published and
 * asks the website to refresh, so the post appears straight away.
 *
 * WHY THIS AND NOT A PAGE ON THE WEBSITE: approving means WRITING to the Sheet.
 * The website only ever reads it, with a read-only key on a public sheet. An
 * admin page there would need a service-account credential, a sign-in system
 * and a write scope. This script already runs as the sheet's owner and is
 * authenticated by Google, so none of that is needed.
 *
 * -------------------------------------------------------------------------
 * SETUP
 *
 * 1. https://script.google.com -> New project. Paste this file in. Save.
 *
 * 2. Project Settings (the cog) -> Script Properties -> Add script property:
 *
 *        Property:  REVALIDATE_URL
 *        Value:     https://ccc-region-c.vercel.app/api/revalidate-calendar
 *                     ?secret=YOUR_SECRET&only=news
 *
 *    Keep the secret here rather than in the code, so it is not in the file.
 *    Leave the property out and everything still works — you would just tap
 *    the refresh bookmark yourself after approving.
 *
 * 3. Run `setUpStatusColumn` once and approve the permission prompt. It widens
 *    the Status dropdown to Pending / Published / Rejected.
 *
 * 4. Deploy -> New deployment -> type "Web app".
 *        Execute as:      Me
 *        Who has access:  Only myself
 *    Deploy, then bookmark the URL it gives you. That URL is the app.
 *
 * -------------------------------------------------------------------------
 * LETTING OTHER PEOPLE APPROVE
 *
 * "Only myself" means only this Google account can open it. To let others in,
 * do NOT simply switch access to "Anyone with a Google account" — that would
 * let any Google user on earth approve posts.
 *
 * Instead redeploy with:
 *        Execute as:      User accessing the web app
 *        Who has access:  Anyone with a Google account
 *
 * and share the Sheet as an **Editor** with each approver. The script then
 * runs as whoever is signed in, so Google's own sheet permissions decide who
 * can approve: someone without edit access simply gets an error. Authorisation
 * stays in one place — the sheet's sharing list — rather than in a list in
 * this file that can drift.
 */

/** The news responses spreadsheet. Not a secret: the sheet is public to read. */
var SHEET_ID = '1db6RIVkhMVK-9zOTMYreSUicOnZ8zhSjepYP22deBcE';

/** Status values, in the Sheet's dropdown and understood by lib/news-sheet.ts. */
var STATUS_PENDING = 'Pending';
var STATUS_PUBLISHED = 'Published';
var STATUS_REJECTED = 'Rejected';

// ------------------------------------------------------------------ setup --

/** Run once: widens the Status dropdown to include Rejected. */
function setUpStatusColumn() {
  var sheet = getResponsesSheet();
  var col = getStatusColumn(sheet);
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList([STATUS_PENDING, STATUS_PUBLISHED, STATUS_REJECTED], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, col, Math.max(sheet.getMaxRows() - 1, 1)).setDataValidation(rule);
  SpreadsheetApp.flush();
  Logger.log('Status column ready (column ' + col + '). You can deploy the web app now.');
}

// ----------------------------------------------------------------- server --

function doGet() {
  return HtmlService.createHtmlOutput(PAGE_HTML)
    .setTitle('Region C — news approvals')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getResponsesSheet() {
  var book = SpreadsheetApp.openById(SHEET_ID);
  var sheets = book.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (/form\s*responses/i.test(sheets[i].getName())) return sheets[i];
  }
  return sheets[0];
}

/** Columns are found by header wording, matching lib/news-sheet.ts. */
function headerIndex(headers, aliases) {
  var normalised = headers.map(function (h) {
    return String(h).toLowerCase().replace(/[^a-z0-9]/g, '');
  });
  for (var i = 0; i < aliases.length; i++) {
    var at = normalised.indexOf(aliases[i]);
    if (at !== -1) return at;
  }
  return -1;
}

function getStatusColumn(sheet) {
  var headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  var at = headerIndex(headers, ['status', 'publishstatus', 'publicationstatus']);
  if (at === -1) throw new Error('No Status column found in the responses sheet.');
  return at + 1;
}

/** Every row not yet approved or rejected, newest first. */
function getPending() {
  var sheet = getResponsesSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  var width = sheet.getLastColumn();
  var values = sheet.getRange(1, 1, lastRow, width).getValues();
  var headers = values[0];

  var col = {
    title: headerIndex(headers, ['posttitle', 'title', 'headline']),
    category: headerIndex(headers, ['category', 'newscategory']),
    author: headerIndex(headers, ['byline', 'author', 'postedby', 'submittedby']),
    summary: headerIndex(headers, ['summary', 'excerpt', 'shortdescription', 'standfirst']),
    body: headerIndex(headers, ['body', 'content', 'postbody', 'fullstory', 'article', 'bodytext']),
    date: headerIndex(headers, ['publicationdate', 'publishdate', 'postdate', 'date']),
    image: headerIndex(headers, ['imageurl', 'image', 'photourl', 'photo', 'picture']),
    status: headerIndex(headers, ['status', 'publishstatus', 'publicationstatus']),
    email: headerIndex(headers, ['emailaddress', 'email']),
    timestamp: headerIndex(headers, ['timestamp']),
  };

  var out = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    var status = String(col.status === -1 ? '' : row[col.status]).trim();
    if (status === STATUS_PUBLISHED || status === STATUS_REJECTED) continue;

    var title = String(col.title === -1 ? '' : row[col.title]).trim();
    if (!title) continue;

    out.push({
      row: r + 1, // 1-based sheet row
      title: title,
      category: cellText(row, col.category) || 'Region News',
      author: cellText(row, col.author) || 'Region C Secretariat',
      summary: cellText(row, col.summary),
      body: cellText(row, col.body),
      date: formatCell(row, col.date) || formatCell(row, col.timestamp),
      image: cellText(row, col.image),
      email: cellText(row, col.email),
      status: status || '(blank)',
    });
  }

  return out.reverse();
}

function cellText(row, index) {
  return index === -1 ? '' : String(row[index] == null ? '' : row[index]).trim();
}

function formatCell(row, index) {
  if (index === -1) return '';
  var v = row[index];
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'd MMM yyyy');
  return String(v == null ? '' : v).trim();
}

/** Sets a row's status, then asks the website to refresh. */
function setStatus(rowNumber, status) {
  if (status !== STATUS_PUBLISHED && status !== STATUS_REJECTED) {
    throw new Error('Refusing to set an unrecognised status.');
  }

  var sheet = getResponsesSheet();
  var col = getStatusColumn(sheet);

  // Re-read the title so the confirmation names the row actually written, not
  // the one the browser believed it was acting on.
  var titleCol = headerIndex(
    sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0],
    ['posttitle', 'title', 'headline']
  );
  var title = titleCol === -1 ? '' : String(sheet.getRange(rowNumber, titleCol + 1).getValue());

  sheet.getRange(rowNumber, col).setValue(status);
  SpreadsheetApp.flush();

  return { title: title, status: status, refreshed: refreshWebsite() };
}

function approve(rowNumber) {
  return setStatus(rowNumber, STATUS_PUBLISHED);
}

function reject(rowNumber) {
  return setStatus(rowNumber, STATUS_REJECTED);
}

/** Clears the site's cached copy so the change shows immediately. */
function refreshWebsite() {
  var url = PropertiesService.getScriptProperties().getProperty('REVALIDATE_URL');
  if (!url) return 'no REVALIDATE_URL set — refresh the site yourself';
  try {
    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    var code = response.getResponseCode();
    return code === 200 ? 'website refreshed' : 'refresh returned HTTP ' + code;
  } catch (err) {
    return 'refresh failed: ' + err;
  }
}

// ------------------------------------------------------------------- page --

var PAGE_HTML = [
'<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">',
'<style>',
'  :root{--navy:#0a1633;--navy-800:#0f2350;--line:#e0eafa;--muted:#4a5a7a;',
'        --gold:#c9a227;--green:#1a7f4b;--red:#9a2b2b;--bg:#f6f8fc}',
'  *{box-sizing:border-box}',
'  body{margin:0;background:var(--bg);color:var(--navy);',
'       font:16px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}',
'  header{background:var(--navy);color:#fff;padding:18px 16px}',
'  header h1{margin:0;font-size:17px;letter-spacing:.02em}',
'  header p{margin:4px 0 0;font-size:13px;color:#c4d6f4}',
'  main{padding:16px;max-width:680px;margin:0 auto}',
'  .card{background:#fff;border:1px solid var(--line);border-radius:10px;',
'        padding:16px;margin-bottom:14px;box-shadow:0 1px 2px rgba(5,11,30,.05)}',
'  .card h2{margin:0 0 6px;font-size:18px;line-height:1.3}',
'  .meta{font-size:13px;color:var(--muted);margin-bottom:10px}',
'  .tag{display:inline-block;background:#eef3fd;color:var(--navy-800);',
'       border-radius:999px;padding:2px 9px;font-size:12px;margin-right:6px}',
'  .summary{font-weight:600;margin:0 0 8px}',
'  .body{white-space:pre-wrap;color:#22314f;font-size:15px;margin:0 0 12px}',
'  .thumb{width:100%;max-height:220px;object-fit:cover;border-radius:8px;',
'         border:1px solid var(--line);margin-bottom:12px;background:#eef3fd}',
'  .warn{background:#fdf6e3;border:1px solid #f0e0a8;color:#6b5412;',
'        padding:8px 10px;border-radius:6px;font-size:13px;margin:0 0 12px}',
'  .row{display:flex;gap:10px;flex-wrap:wrap}',
'  button{flex:1 1 150px;min-height:46px;border-radius:8px;border:1px solid transparent;',
'         font-size:15px;font-weight:600;cursor:pointer}',
'  .approve{background:var(--green);color:#fff}',
'  .reject{background:#fff;color:var(--red);border-color:#e3c4c4}',
'  button:disabled{opacity:.5;cursor:default}',
'  .note{color:var(--muted);font-size:14px;text-align:center;padding:26px 10px}',
'  .done{border-left:4px solid var(--green)}',
'  .flash{font-size:14px;margin-top:10px;color:var(--green)}',
'  .flash.err{color:var(--red)}',
'</style></head><body>',
'<header><h1>Region C — news approvals</h1>',
'<p id="count">Loading…</p></header>',
'<main id="list"><p class="note">Loading submissions…</p></main>',
'<script>',
'  function esc(s){return String(s||"").replace(/[&<>"]/g,function(c){',
'    return {"&":"&amp;","<":"&lt;",">":"&gt;","\\"":"&quot;"}[c];});}',
'  function render(items){',
'    var list=document.getElementById("list");',
'    document.getElementById("count").textContent =',
'      items.length ? items.length + " awaiting review" : "Nothing awaiting review";',
'    if(!items.length){list.innerHTML="<p class=\\"note\\">No pending submissions. Anything already approved or rejected stays in the sheet.</p>";return;}',
'    list.innerHTML = items.map(function(it){',
'      var warn = it.summary ? "" : "<p class=\\"warn\\">No summary given — the site will reuse the opening of the body, so it may read twice on the article page.</p>";',
'      var img = it.image ? "<img class=\\"thumb\\" src=\\""+esc(it.image)+"\\" alt=\\"\\">" : "";',
'      return "<div class=\\"card\\" id=\\"row"+it.row+"\\">"',
'        + "<h2>"+esc(it.title)+"</h2>"',
'        + "<div class=\\"meta\\"><span class=\\"tag\\">"+esc(it.category)+"</span>"',
'        + esc(it.date)+" · "+esc(it.author)+(it.email?" · "+esc(it.email):"")+"</div>"',
'        + img + warn',
'        + (it.summary?"<p class=\\"summary\\">"+esc(it.summary)+"</p>":"")',
'        + "<p class=\\"body\\">"+esc(it.body)+"</p>"',
'        + "<div class=\\"row\\">"',
'        + "<button class=\\"approve\\" onclick=\\"act("+it.row+",\'approve\',this)\\">Approve &amp; publish</button>"',
'        + "<button class=\\"reject\\" onclick=\\"act("+it.row+",\'reject\',this)\\">Reject</button>"',
'        + "</div><div class=\\"flash\\" id=\\"flash"+it.row+"\\"></div></div>";',
'    }).join("");',
'  }',
'  function act(row, what, btn){',
'    var card=document.getElementById("row"+row);',
'    var flash=document.getElementById("flash"+row);',
'    card.querySelectorAll("button").forEach(function(b){b.disabled=true;});',
'    flash.className="flash"; flash.textContent = what==="approve" ? "Publishing…" : "Rejecting…";',
'    google.script.run',
'      .withSuccessHandler(function(res){',
'        card.classList.add("done");',
'        flash.textContent = (what==="approve" ? "Published — " : "Rejected — ") + res.refreshed;',
'      })',
'      .withFailureHandler(function(err){',
'        flash.className="flash err";',
'        flash.textContent = "Failed: " + err.message;',
'        card.querySelectorAll("button").forEach(function(b){b.disabled=false;});',
'      })',
'      [what](row);',
'  }',
'  google.script.run',
'    .withSuccessHandler(render)',
'    .withFailureHandler(function(e){',
'      document.getElementById("list").innerHTML =',
'        "<p class=\\"note\\">Could not read the sheet: "+e.message+"</p>";',
'    })',
'    .getPending();',
'</script></body></html>',
].join('\n');
