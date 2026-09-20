# Calendar imports

One-time `.ics` files for loading events into the public **Region C Events**
Google Calendar, which the website reads (see DEPLOYMENT.md, "Events: the Google
Calendar feed").

These files are kept in the repository as the record of what was imported and
the rule each recurring event follows. They are **not** read by the site at
build or run time — the site only ever reads the live calendar.

## How to import

1. Open [Google Calendar](https://calendar.google.com) signed in as the Region C
   account.
2. **Settings → Import & export → Import.**
3. Choose the `.ics` file, and set **"Add to calendar"** to **Region C Events** —
   not the account's default personal calendar, which is not published.
4. Import. Google confirms how many events were added.

Re-importing the same file does not duplicate events: each one carries a stable
`UID`, so Google updates the existing entry instead. That makes these files safe
to correct and re-import.

## Files

| File | Contents |
| --- | --- |
| `region-c-harvests.ics` | The seven annual parish Harvest Thanksgiving services, each a yearly recurring event, 10:00–17:00 Pacific. |
| `regional-day.ics` | Regional Day: the third Sunday of February each year, 10:00–17:00 Pacific, at Comforter Parish (the Regional seat). |

### `regional-day.ics`

| Event | Rule | RRULE |
| --- | --- | --- |
| Regional Day | Third Sunday in February | `FREQ=YEARLY;BYMONTH=2;BYDAY=3SU` |

"The Sunday of the third week in February" was read as the **third Sunday**,
confirmed with Region C on 2026-09-19. The distinction matters: counting weeks
from the one containing 1 February instead puts it a week earlier in six years
out of seven — 14 February in 2027, against 21 February for the third Sunday.

### `region-c-harvests.ics`

Each event recurs **forever** on its own rule, so the calendar never needs
re-populating year to year:

| Parish | Rule | RRULE |
| --- | --- | --- |
| San Diego Central Parish | First Sunday in July | `FREQ=YEARLY;BYMONTH=7;BYDAY=1SU` |
| New Covenant Parish | Last Sunday in August | `FREQ=YEARLY;BYMONTH=8;BYDAY=-1SU` |
| Comforter Parish | Last Sunday in September | `FREQ=YEARLY;BYMONTH=9;BYDAY=-1SU` |
| Arizona Central Parish | Third Sunday in October | `FREQ=YEARLY;BYMONTH=10;BYDAY=3SU` |
| Oshoffa Parish | Last Sunday in October | `FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU` |
| Sanctum Parish | First Sunday in November | `FREQ=YEARLY;BYMONTH=11;BYDAY=1SU` |
| LA Mother Parish | First Sunday in December | `FREQ=YEARLY;BYMONTH=12;BYDAY=1SU` |

Times are anchored to `America/Los_Angeles` rather than a fixed offset, so the
summer harvests stay at 10:00 local through daylight saving instead of drifting
to 09:00. The file carries a `VTIMEZONE` block, so other calendar applications
resolve PST/PDT correctly too.

**Venue:** every harvest is set to its parish's address from `data/parishes.ts`.

Two addresses changed after the first import, so this file and the live calendar
can drift apart. The **live Google Calendar is what the website reads** — editing
this file alone changes nothing on the site. Either re-import it (the stable
`UID`s mean Google updates rather than duplicates) or edit the events directly,
choosing "All events" so the whole recurring series follows.
