/**
 * Region C news approvals — a small web app for managing submissions.
 *
 * Shows everything the news sheet holds, in three groups:
 *
 *   Awaiting review   approve & publish, or reject
 *   Live on the site  unpublish (takes it down, back to awaiting review)
 *   Rejected          restore (back to awaiting review)
 *
 * Every action writes the Status cell and then asks the website to refresh, so
 * the site matches what this page says within a second or two.
 *
 * WHY THIS AND NOT A PAGE ON THE WEBSITE: acting on a post means WRITING to the
 * Sheet. The website only ever reads it, with a read-only key on a public
 * sheet. An admin page there would need a service-account credential, a sign-in
 * system and a write scope. This script already runs as the sheet's owner and
 * is authenticated by Google, so none of that is needed.
 *
 * -------------------------------------------------------------------------
 * SETUP
 *
 * 1. https://script.google.com -> New project. Paste this file in. Save.
 *
 * 2. Project Settings (the cog) -> Script Properties -> Add script property:
 *
 *        Property:  REVALIDATE_URL
 *        Value:     the refresh URL, ON ONE LINE, ending in &only=news
 *
 *    It looks like this, with no line break and no spaces anywhere:
 *
 *      https://<site>/api/revalidate-calendar?secret=<SECRET>&only=news
 *
 *    Keep the secret here rather than in the code, so it is not in the file.
 *    Leave the property out and everything still works — you would just tap
 *    the refresh bookmark yourself afterwards.
 *
 * 3. Run `setUpStatusColumn` once and approve the permission prompt. It widens
 *    the Status dropdown to Pending / Published / Rejected.
 *
 * 4. Deploy -> New deployment -> type "Web app".
 *        Execute as:      Me
 *        Who has access:  Only myself
 *    Deploy, then bookmark the URL it gives you. That URL is the app.
 *
 * NOTE ON UPDATING: editing this file does not change the live app. After
 * pasting a new version, use Deploy -> Manage deployments -> the pencil icon
 * -> Version: New version -> Deploy. That keeps the same URL. Creating a
 * *new deployment* instead would issue a different URL.
 *
 * -------------------------------------------------------------------------
 * LETTING OTHER PEOPLE APPROVE
 *
 * "Only myself" means only this Google account can open it. To let others in,
 * do NOT simply switch access to "Anyone with a Google account" — that would
 * let any Google user on earth publish and unpublish.
 *
 * Instead redeploy with:
 *        Execute as:      User accessing the web app
 *        Who has access:  Anyone with a Google account
 *
 * and share the Sheet as an **Editor** with each approver. The script then
 * runs as whoever is signed in, so Google's own sheet permissions decide who
 * can act: someone without edit access simply gets an error. Authorisation
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
    .setTitle('Region C — news')
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

/**
 * Every row, grouped by what it is doing now. Newest first within each group.
 *
 * The site treats anything that is not Published as not published, so the
 * groups here are exactly what a visitor would and would not see.
 */
function getPosts() {
  var sheet = getResponsesSheet();
  var lastRow = sheet.getLastRow();
  var groups = { pending: [], published: [], rejected: [] };
  if (lastRow < 2) return groups;

  var values = sheet.getRange(1, 1, lastRow, sheet.getLastColumn()).getValues();
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

  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    var title = cellText(row, col.title);
    if (!title) continue;

    var status = cellText(row, col.status);
    var post = {
      row: r + 1, // 1-based sheet row
      title: title,
      category: cellText(row, col.category) || 'Region News',
      author: cellText(row, col.author) || 'Region C Secretariat',
      summary: cellText(row, col.summary),
      body: cellText(row, col.body),
      date: formatCell(row, col.date) || formatCell(row, col.timestamp),
      image: cellText(row, col.image),
      email: cellText(row, col.email),
      slug: slugify(title),
    };

    if (status === STATUS_PUBLISHED) groups.published.push(post);
    else if (status === STATUS_REJECTED) groups.rejected.push(post);
    else groups.pending.push(post);
  }

  groups.pending.reverse();
  groups.published.reverse();
  groups.rejected.reverse();
  return groups;
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

/**
 * Mirrors the slug the site builds, so the link below a post actually works.
 * Must stay in step with `slugify` in lib/news-sheet.ts — including stripping
 * diacritics, without which "Wólé Oshoffa Day" links to w-le-… and 404s.
 */
function slugify(value) {
  return (
    String(value)
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80)
      .replace(/-+$/, '') || 'post'
  );
}

// ---------------------------------------------------------------- actions --

/** Sets a row's status, then asks the website to refresh. */
function setStatus(rowNumber, status) {
  if (status !== STATUS_PUBLISHED && status !== STATUS_REJECTED && status !== STATUS_PENDING) {
    throw new Error('Refusing to set an unrecognised status.');
  }

  var sheet = getResponsesSheet();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var statusCol = headerIndex(headers, ['status', 'publishstatus', 'publicationstatus']);
  if (statusCol === -1) throw new Error('No Status column found in the responses sheet.');

  var titleCol = headerIndex(headers, ['posttitle', 'title', 'headline']);
  // Re-read the title so the confirmation names the row actually written, not
  // the one the browser believed it was acting on.
  var title = titleCol === -1 ? '' : String(sheet.getRange(rowNumber, titleCol + 1).getValue());

  sheet.getRange(rowNumber, statusCol + 1).setValue(status);
  SpreadsheetApp.flush();

  return { title: title, status: status, refreshed: refreshWebsite() };
}

function approve(rowNumber) {
  return setStatus(rowNumber, STATUS_PUBLISHED);
}

function reject(rowNumber) {
  return setStatus(rowNumber, STATUS_REJECTED);
}

/** Takes a live post off the site. It returns to Awaiting review, not deleted. */
function unpublish(rowNumber) {
  return setStatus(rowNumber, STATUS_PENDING);
}

/** Puts a rejected post back in the queue. */
function restore(rowNumber) {
  return setStatus(rowNumber, STATUS_PENDING);
}

/**
 * Clears the site's cached copy so the change shows immediately.
 *
 * Never throws: a failed refresh must not make a successful change look like it
 * failed. The sheet is already written either way; the worst case is that the
 * site takes up to an hour to notice, or that you tap the bookmark.
 */
function refreshWebsite() {
  var raw = PropertiesService.getScriptProperties().getProperty('REVALIDATE_URL');
  if (!raw) return 'no REVALIDATE_URL set — refresh the site yourself';

  // A value pasted across two lines arrives with a line break in the middle,
  // which produces a nonsense URL. Rebuild it rather than fail on it.
  var url = String(raw).replace(/\s+/g, '');

  if (!/^https:\/\/[^/]+\/.+secret=/.test(url)) {
    return (
      'REVALIDATE_URL looks wrong (' +
      url.slice(0, 40) +
      '…) — it should be one line: https://<site>/api/revalidate-calendar?secret=<SECRET>&only=news'
    );
  }

  try {
    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    var code = response.getResponseCode();
    if (code === 200) return 'website refreshed';
    if (code === 401) return 'refresh rejected (401) — the secret in REVALIDATE_URL is wrong';
    if (code === 503) return 'refresh unavailable (503) — CALENDAR_REVALIDATE_SECRET is not set in Vercel';
    return 'refresh returned HTTP ' + code;
  } catch (err) {
    return 'refresh failed: ' + err;
  }
}

// ------------------------------------------------------------------- page --

var PAGE_HTML = [
'<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">',
'<style>',
'  :root{--navy:#0a1633;--navy800:#0f2350;--line:#e0eafa;--muted:#4a5a7a;',
'        --green:#1a7f4b;--red:#9a2b2b;--amber:#8a6a12;--bg:#f6f8fc}',
'  *{box-sizing:border-box}',
'  body{margin:0;background:var(--bg);color:var(--navy);',
'       font:16px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}',
'  header{background:var(--navy);color:#fff;padding:18px 16px;position:sticky;top:0;z-index:5}',
'  header h1{margin:0;font-size:17px}',
'  header p{margin:4px 0 0;font-size:13px;color:#c4d6f4}',
'  main{padding:16px;max-width:680px;margin:0 auto}',
'  h2.sec{font-size:13px;text-transform:uppercase;letter-spacing:.08em;',
'         color:var(--muted);margin:22px 0 10px}',
'  .card{background:#fff;border:1px solid var(--line);border-radius:10px;',
'        padding:14px;margin-bottom:12px;box-shadow:0 1px 2px rgba(5,11,30,.05)}',
'  .card.live{border-left:4px solid var(--green)}',
'  .card.rej{border-left:4px solid #d8b8b8;opacity:.85}',
'  .card h3{margin:0 0 5px;font-size:17px;line-height:1.3}',
'  .meta{font-size:13px;color:var(--muted);margin-bottom:9px}',
'  .tag{display:inline-block;background:#eef3fd;color:var(--navy800);',
'       border-radius:999px;padding:2px 9px;font-size:12px;margin-right:6px}',
'  .summary{font-weight:600;margin:0 0 7px;font-size:15px}',
'  .body{white-space:pre-wrap;color:#22314f;font-size:14px;margin:0 0 10px}',
'  .thumb{width:100%;max-height:190px;object-fit:cover;border-radius:8px;',
'         border:1px solid var(--line);margin-bottom:10px;background:#eef3fd}',
'  .warn{background:#fdf6e3;border:1px solid #f0e0a8;color:var(--amber);',
'        padding:7px 9px;border-radius:6px;font-size:13px;margin:0 0 10px}',
'  .row{display:flex;gap:9px;flex-wrap:wrap}',
'  button{flex:1 1 140px;min-height:44px;border-radius:8px;border:1px solid transparent;',
'         font-size:15px;font-weight:600;cursor:pointer}',
'  .approve{background:var(--green);color:#fff}',
'  .reject{background:#fff;color:var(--red);border-color:#e3c4c4}',
'  .unpub{background:#fff;color:var(--navy800);border-color:#c4d6f4}',
'  .restore{background:#fff;color:var(--navy800);border-color:#c4d6f4}',
'  button:disabled{opacity:.5;cursor:default}',
'  a.view{font-size:13px;color:var(--navy800)}',
'  .note{color:var(--muted);font-size:14px;padding:10px 2px}',
'  .flash{font-size:13px;margin-top:8px;color:var(--green)}',
'  .flash.err{color:var(--red)}',
'  #toast{position:sticky;top:64px;z-index:4;margin:0 0 10px}',
'  #toast div{background:#0f2350;color:#fff;border-radius:8px;padding:9px 12px;font-size:14px}',
'</style></head><body>',
'<header><h1>Region C — news</h1><p id="count">Loading…</p></header>',
'<main><div id="toast"></div><div id="list"><p class="note">Loading…</p></div></main>',
'<script>',
'  var SITE = "https://ccc-region-c.vercel.app";',
'  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){',
'    return {"&":"&amp;","<":"&lt;",">":"&gt;","\\"":"&quot;"}[c];});}',
'  function toast(msg,isErr){',
'    document.getElementById("toast").innerHTML =',
'      "<div"+(isErr?" style=\\"background:#9a2b2b\\"":"")+">"+esc(msg)+"</div>";',
'  }',
'  function card(it,kind){',
'    var cls = kind==="published" ? "card live" : kind==="rejected" ? "card rej" : "card";',
'    var warn = (kind==="pending" && !it.summary)',
'      ? "<p class=\\"warn\\">No summary given — the site will reuse the opening of the body, so it may read twice.</p>" : "";',
'    var img = it.image ? "<img class=\\"thumb\\" src=\\""+esc(it.image)+"\\" alt=\\"\\">" : "";',
'    var buttons =',
'      kind==="pending"',
'        ? "<button class=\\"approve\\" onclick=\\"act("+it.row+",\'approve\')\\">Approve &amp; publish</button>"',
'          + "<button class=\\"reject\\" onclick=\\"act("+it.row+",\'reject\',\'Reject this submission?\')\\">Reject</button>"',
'      : kind==="published"',
'        ? "<button class=\\"unpub\\" onclick=\\"act("+it.row+",\'unpublish\',\'Take this off the website?\')\\">Unpublish</button>"',
'        : "<button class=\\"restore\\" onclick=\\"act("+it.row+",\'restore\')\\">Restore to review</button>";',
'    var link = kind==="published"',
'      ? "<p><a class=\\"view\\" target=\\"_blank\\" href=\\""+SITE+"/news/"+esc(it.slug)+"\\">View on the site &#8599;</a></p>" : "";',
'    var full = kind==="pending";',
'    return "<div class=\\""+cls+"\\" id=\\"row"+it.row+"\\">"',
'      + "<h3>"+esc(it.title)+"</h3>"',
'      + "<div class=\\"meta\\"><span class=\\"tag\\">"+esc(it.category)+"</span>"',
'      + esc(it.date)+" · "+esc(it.author)+"</div>"',
'      + (full?img:"") + warn',
'      + (it.summary?"<p class=\\"summary\\">"+esc(it.summary)+"</p>":"")',
'      + (full?"<p class=\\"body\\">"+esc(it.body)+"</p>":"")',
'      + link',
'      + "<div class=\\"row\\">"+buttons+"</div>"',
'      + "<div class=\\"flash\\" id=\\"flash"+it.row+"\\"></div></div>";',
'  }',
'  function section(title,items,kind,empty){',
'    if(!items.length) return "<h2 class=\\"sec\\">"+title+"</h2><p class=\\"note\\">"+empty+"</p>";',
'    return "<h2 class=\\"sec\\">"+title+" ("+items.length+")</h2>"',
'      + items.map(function(i){return card(i,kind);}).join("");',
'  }',
'  function render(g){',
'    document.getElementById("count").textContent =',
'      g.pending.length+" awaiting review · "+g.published.length+" live on the site";',
'    document.getElementById("list").innerHTML =',
'        section("Awaiting review",g.pending,"pending","Nothing waiting.")',
'      + section("Live on the site",g.published,"published","Nothing published yet.")',
'      + (g.rejected.length ? section("Rejected",g.rejected,"rejected","") : "");',
'  }',
'  function load(){',
'    google.script.run',
'      .withSuccessHandler(render)',
'      .withFailureHandler(function(e){',
'        document.getElementById("list").innerHTML =',
'          "<p class=\\"note\\">Could not read the sheet: "+esc(e.message)+"</p>";})',
'      .getPosts();',
'  }',
'  function act(row, what, confirmMsg){',
'    if(confirmMsg && !window.confirm(confirmMsg)) return;',
'    var card=document.getElementById("row"+row);',
'    var flash=document.getElementById("flash"+row);',
'    if(card) card.querySelectorAll("button").forEach(function(b){b.disabled=true;});',
'    if(flash){flash.className="flash";flash.textContent="Working…";}',
'    google.script.run',
'      .withSuccessHandler(function(res){',
'        toast((res.status==="Published"?"Published":res.status==="Rejected"?"Rejected":"Moved to review")',
'              +" — "+res.refreshed, /refresh (failed|returned|rejected|unavailable|looks wrong)/.test(res.refreshed));',
'        load();',
'      })',
'      .withFailureHandler(function(err){',
'        if(flash){flash.className="flash err";flash.textContent="Failed: "+err.message;}',
'        if(card) card.querySelectorAll("button").forEach(function(b){b.disabled=false;});',
'      })',
'      [what](row);',
'  }',
'  load();',
'</script></body></html>',
].join('\n');
