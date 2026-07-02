// Pure-logic tests for db.js: reset rules, ledger aggregation, streaks,
// migration. Run: node tests/logic.test.mjs
import {
    DEFAULT_TASK_DEFS, getMergedDefs, defaultCycleIds, pointsFor,
    buildDefaultState, normalizeState, applyResetRules, removeCompletion,
    buildEvent, aggregateDayEntry, computeWeightedLoad, pointsToBadge,
    getDayKey, getWeekKey, monthKeyOf,
    travelActive, isTaskPausedForTravel, filterTravelPaused,
    buildBackfill, mergeHistoryEntry
} from '../db.js';

let failures = 0;
let checks = 0;
function assert(cond, msg) {
    checks++;
    if (!cond) {
        failures++;
        console.error('  FAIL:', msg);
    }
}
function approx(a, b, msg) {
    assert(Math.abs(a - b) < 0.01, `${msg} (got ${a}, want ${b})`);
}
function section(name) {
    console.log('•', name);
}

// noon in America/New_York so day keys are unambiguous
function dateFor(dayKey) {
    return new Date(dayKey + 'T17:00:00Z');
}

// Mimic app-side check/uncheck: toggle task + ledger event
function check(state, taskId, who, dayKey) {
    const defs = getMergedDefs(state);
    const def = defs.byId[taskId];
    const event = buildEvent(def, who, dayKey);
    return {
        ...state,
        tasks: { ...state.tasks, [taskId]: true },
        taskActor: { ...state.taskActor, [taskId]: who },
        events: [...state.events, event]
    };
}

// ---------------------------------------------------------------
section('badge mapping');
assert(pointsToBadge(1) === 'S', 'S');
assert(pointsToBadge(1.33) === 'SM', 'SM');
assert(pointsToBadge(1.67) === 'MS', 'MS');
assert(pointsToBadge(2) === 'M', 'M');
assert(pointsToBadge(2.67) === 'ML', 'ML');
assert(pointsToBadge(4) === 'L', 'L');
assert(pointsToBadge(12) === '3L', '3L');

// ---------------------------------------------------------------
section('legacy V2 state migrates cleanly');
{
    const legacy = {
        tasks: { a1: true, a9: true, c2: true, zombie: true },
        taskActor: { a1: 'aditya', a9: 'chhaya', c2: 'chhaya' },
        taskMeta: { a14: { interval: 14, lastReset: '2026-06-01' }, a2: { assignee: 'chhaya' } },
        oneTimeTasks: { ot_x: { name: 'Fix lamp', points: 2, assignee: 'either', createdBy: 'aditya', done: true, doneBy: 'chhaya', createdAt: '2026-06-09' } },
        kudos: [{ id: 'k1', from: 'aditya', to: 'chhaya', emoji: 'fire', taskId: 'c2', message: null, timestamp: '2026-06-09T12:00:00Z' }],
        achievements: { 'first-streak': { who: 'both', earnedAt: '2026-06-05' } },
        lastDailyReset: '2026-06-10',
        lastWeeklyReset: '2026-06-08',
        streak: 3,
        bestStreak: 5,
        dailyHistory: [{ day: '2026-06-09', done: 5, total: 13, points: 10, totalPoints: 28.33, adityaPoints: 6, chhayaPoints: 4 }]
    };
    const s = normalizeState(legacy);
    assert(s.tasks.a1 === true && s.tasks.a9 === true, 'checked tasks survive');
    assert(!('zombie' in s.tasks), 'unknown task ids dropped');
    // events synthesized from checked tasks
    assert(s.events.length === 3, `synthesized 3 events (got ${s.events.length})`);
    const a9evt = s.events.find(e => e.taskId === 'a9');
    assert(a9evt && a9evt.who === 'chhaya' && a9evt.kind === 'weekly' && a9evt.day === '2026-06-10', 'a9 event attributes');
    assert(a9evt.owner === 'aditya', 'cross-help owner preserved');
    // taskMeta folded into defs
    const defs = getMergedDefs(s);
    assert(defs.byId.a14.interval === 14, 'interval migrated');
    assert(defs.byId.a2.owner === 'chhaya', 'assignee migrated to owner');
    // one-time gets completedAt backfilled
    assert(s.oneTimeTasks.ot_x.completedAt === '2026-06-09', 'completedAt backfilled from createdAt');
    assert(s.streak === 3 && s.bestStreak === 5, 'streaks preserved');
    assert(s.kudosSeen.aditya === '' && s.kudosSeen.chhaya === '', 'kudosSeen defaulted');
    assert(s.lifetime.tasks === 0, 'lifetime defaulted');
}

// ---------------------------------------------------------------
section('weekly + extra points land in daily history at rollover');
{
    let s = buildDefaultState(dateFor('2026-06-02')); // Tuesday
    s = check(s, 'a1', 'aditya', '2026-06-02');       // daily, 1 pt
    s = check(s, 'a9', 'chhaya', '2026-06-02');       // WEEKLY done by chhaya (cross-help), 1.33
    s = check(s, 'c2', 'chhaya', '2026-06-02');       // daily 12 pts
    // one-time extra completed same day
    s.oneTimeTasks.ot1 = { name: 'Build shelf', points: 4, assignee: 'either', createdBy: 'aditya', done: true, doneBy: 'aditya', createdAt: '2026-06-02', completedAt: '2026-06-02' };
    s.events = [...s.events, { id: 'e_ot1', taskId: 'ot1', name: 'Build shelf', pts: 4, who: 'aditya', owner: null, day: '2026-06-02', kind: 'extra' }];

    const { state: next, changed, archivedDays } = applyResetRules(s, dateFor('2026-06-03'));
    assert(changed, 'rollover changed state');
    const entry = next.dailyHistory.find(h => h.day === '2026-06-02');
    assert(!!entry, 'history entry exists for closed day');
    approx(entry.adityaPoints, 5, 'aditya = a1(1) + extra(4)');
    approx(entry.chhayaPoints, 13.33, 'chhaya = a9(1.33) + c2(12)');
    approx(entry.byKind.weekly, 1.33, 'byKind.weekly');
    approx(entry.byKind.extra, 4, 'byKind.extra');
    approx(entry.points, 13, 'daily completion pts (a1 + c2)');
    assert(entry.done === 2, 'done counts only cycle dailies');
    assert(next.tasks.a9 === true, 'weekly task stays checked over daily reset');
    assert(next.tasks.a1 === false, 'daily task unchecked');
    assert(next.lifetime.tasks === 4, `lifetime tasks = 4 (got ${next.lifetime.tasks})`);
    assert(next.lifetime.crossHelps === 1, 'a9 by chhaya counted as cross-help');
    assert(archivedDays.length === 1 && archivedDays[0].events.length === 4, 'archive doc carries day events');
    // one-time completed yesterday is cleaned up
    assert(!next.oneTimeTasks.ot1, 'completed extra removed the day after completion');
}

// ---------------------------------------------------------------
section('one-time task survives its completion day');
{
    let s = buildDefaultState(dateFor('2026-06-02'));
    s.oneTimeTasks.ot2 = { name: 'Call plumber', points: 2, assignee: 'either', createdBy: 'chhaya', done: true, doneBy: 'chhaya', createdAt: '2026-05-28', completedAt: '2026-06-02' };
    // later the same day: must NOT be deleted (this was the old bug)
    const sameDay = applyResetRules(s, dateFor('2026-06-02')).state;
    assert(!!sameDay.oneTimeTasks.ot2, 'extra completed today survives today');
    const nextDay = applyResetRules(s, dateFor('2026-06-03')).state;
    assert(!nextDay.oneTimeTasks.ot2, 'extra gone the next day');
}

// ---------------------------------------------------------------
section('daily streak: >=80% + both acted');
{
    let s = buildDefaultState(dateFor('2026-06-02'));
    const defs = getMergedDefs(s);
    const dailies = defaultCycleIds(defs, 'daily');
    // both check everything
    dailies.forEach(id => { s = check(s, id, defs.byId[id].owner, '2026-06-02'); });
    let r = applyResetRules(s, dateFor('2026-06-03'));
    assert(r.state.streak === 1, `streak 1 after full co-op day (got ${r.state.streak})`);
    // next day only aditya acts -> streak resets
    let s2 = r.state;
    dailies.filter(id => defs.byId[id].owner === 'aditya').forEach(id => { s2 = check(s2, id, 'aditya', '2026-06-03'); });
    r = applyResetRules(s2, dateFor('2026-06-04'));
    assert(r.state.streak === 0, 'streak resets when only one acted / below threshold');
    assert(r.state.bestStreak === 1, 'best streak kept');
}

// ---------------------------------------------------------------
section('weekly streak across week rollover');
{
    let s = buildDefaultState(dateFor('2026-06-02')); // Tue, week of 2026-06-01
    const defs = getMergedDefs(s);
    const weeklies = defaultCycleIds(defs, 'weekly');
    weeklies.forEach(id => { s = check(s, id, defs.byId[id].owner, '2026-06-02'); });
    // mid-week daily rollover
    s = applyResetRules(s, dateFor('2026-06-03')).state;
    assert(s.tasks.a9 === true, 'weeklies still checked midweek');
    // Monday: weekly rollover
    const r = applyResetRules(s, dateFor('2026-06-08'));
    assert(r.state.weeklyStreak === 1, `weekly streak 1 (got ${r.state.weeklyStreak})`);
    assert(r.state.bestWeeklyStreak === 1, 'best weekly streak');
    assert(r.state.tasks.a9 === false, 'weeklies unchecked after weekly reset');
    assert(r.state.events.length === 0, 'old-week events pruned');
    // skipped week -> reset
    const r2 = applyResetRules(r.state, dateFor('2026-06-22'));
    assert(r2.state.weeklyStreak === 0, 'weekly streak resets after a skipped week');
}

// ---------------------------------------------------------------
section('golden month at month boundary');
{
    let s = buildDefaultState(dateFor('2026-05-31'));
    s.lastDailyReset = '2026-05-31';
    s.lastWeeklyReset = '2026-05-25';
    s.dailyHistory = [];
    for (let d = 5; d <= 30; d++) {
        const day = `2026-05-${String(d).padStart(2, '0')}`;
        s.dailyHistory.push({ day, done: 12, total: 13, points: 26, totalPoints: 28.33, adityaPoints: 14, chhayaPoints: 12, byKind: null });
    }
    const r = applyResetRules(s, dateFor('2026-06-01'));
    assert(r.state.goldenMonths === 1, `golden month earned (got ${r.state.goldenMonths})`);
    assert(r.state.lastMonthProcessed === '2026-05', 'month marked processed');
    // re-running doesn't double count
    const r2 = applyResetRules(r.state, dateFor('2026-06-02'));
    assert(r2.state.goldenMonths === 1, 'no double counting');
}

// ---------------------------------------------------------------
section('unchecking an archived weekly re-aggregates that day');
{
    let s = buildDefaultState(dateFor('2026-06-02'));
    s = check(s, 'a9', 'aditya', '2026-06-02');
    s = check(s, 'c2', 'chhaya', '2026-06-02');
    s = applyResetRules(s, dateFor('2026-06-03')).state; // Tue archived
    let entry = s.dailyHistory.find(h => h.day === '2026-06-02');
    approx(entry.adityaPoints, 1.33, 'pre: aditya has a9 pts');
    const { state: after, removedEvent, rearchivedEntry } = removeCompletion(s, 'a9');
    assert(removedEvent && removedEvent.taskId === 'a9', 'event found and removed');
    assert(after.tasks.a9 === false, 'task unchecked');
    assert(rearchivedEntry && rearchivedEntry.day === '2026-06-02', 're-archived day returned');
    entry = after.dailyHistory.find(h => h.day === '2026-06-02');
    approx(entry.adityaPoints, 0, 'post: a9 points removed from history');
    approx(entry.byKind.weekly, 0, 'post: byKind weekly zeroed');
}

// ---------------------------------------------------------------
section('computeWeightedLoad sees weekly + extra points after rollover');
{
    let s = buildDefaultState(dateFor('2026-06-02'));
    const defs = getMergedDefs(s);
    // chhaya does lots of weeklies, aditya a little daily
    defaultCycleIds(defs, 'weekly').filter(id => defs.byId[id].owner === 'chhaya')
        .forEach(id => { s = check(s, id, 'chhaya', '2026-06-02'); });
    s = check(s, 'a1', 'aditya', '2026-06-02');
    s = applyResetRules(s, dateFor('2026-06-03')).state;
    const load = computeWeightedLoad(s, dateFor('2026-06-03'));
    assert(load.heavierUser === 'chhaya', `chhaya heavier via weeklies (got ${load.heavierUser})`);
    assert(load.cWeighted > 10, `weekly pts present in load (got ${load.cWeighted})`);
    // and today's un-archived events count too
    let s2 = check(s, 'a18', 'aditya', '2026-06-03'); // 4 pt weekly today
    const load2 = computeWeightedLoad(s2, dateFor('2026-06-03'));
    approx(load2.aWeighted - load.aWeighted, 4, 'today open events counted');
}

// ---------------------------------------------------------------
section('custom-interval task resets on its own schedule');
{
    let s = buildDefaultState(dateFor('2026-06-02'));
    s.taskDefs.a14 = { interval: 3, lastReset: '2026-06-02' };
    s = check(s, 'a14', 'aditya', '2026-06-02');
    let r = applyResetRules(s, dateFor('2026-06-04')).state;
    assert(r.tasks.a14 === true, 'not yet reset at day 2');
    r = applyResetRules(r, dateFor('2026-06-05')).state;
    assert(r.tasks.a14 === false, 'reset at day 3');
    assert(r.taskDefs.a14.lastReset === '2026-06-05', 'lastReset advanced');
    // its points still landed in history on the day it was done
    const entry = r.dailyHistory.find(h => h.day === '2026-06-02');
    approx(entry ? entry.adityaPoints : 0, 2, 'custom-interval pts in history');
}

// ---------------------------------------------------------------
section('custom chore defs merge + retire');
{
    let s = buildDefaultState(dateFor('2026-06-02'));
    s.taskDefs.x_abc = { name: 'Water balcony', points: 1.33, owner: 'chhaya', cadence: 'weekly', room: 'Balcony', custom: true };
    s.taskDefs.a2 = { retired: true };
    s.taskDefs.a1 = { name: 'Tidy living room', points: 2 };
    const norm = normalizeState(s);
    const defs = getMergedDefs(norm);
    assert(!!defs.byId.x_abc && defs.byId.x_abc.cadence === 'weekly', 'custom def active');
    assert('x_abc' in norm.tasks, 'custom def has a checkbox slot');
    assert(!defs.byId.a2, 'retired def excluded from active');
    assert(defs.allById.a2.retired === true, 'retired def still in allById');
    assert(defs.byId.a1.name === 'Tidy living room' && defs.byId.a1.points === 2, 'rename + repoint override');
    assert(defs.byId.a1.owner === 'aditya', 'unoverridden fields fall through');
}

// ---------------------------------------------------------------
section('together mode: shared completions split points');
{
    let s = buildDefaultState(dateFor('2026-06-02'));
    s = check(s, 'c2', 'both', '2026-06-02'); // 12-pt daily done together
    s = check(s, 'a1', 'aditya', '2026-06-02'); // 1 pt solo
    const defs = getMergedDefs(s);
    const entry = aggregateDayEntry(defs, '2026-06-02', s.events);
    approx(entry.adityaPoints, 7, 'aditya gets half of shared + own solo');
    approx(entry.chhayaPoints, 6, 'chhaya gets half of shared');
    approx(entry.points, 13, 'completion pts count the full task');
    assert(entry.done === 2, 'both tasks count as done');

    // uncheck removes the single shared event cleanly
    const { state: after, removedEvent } = removeCompletion(s, 'c2');
    assert(removedEvent && removedEvent.who === 'both', 'shared event found for uncheck');
    assert(after.events.every(e => e.taskId !== 'c2'), 'shared event fully removed');

    // weighted load splits evenly
    const load = computeWeightedLoad(check(buildDefaultState(dateFor('2026-06-02')), 'c2', 'both', '2026-06-02'), dateFor('2026-06-02'));
    approx(load.aWeighted, load.cWeighted, 'shared completion loads both sides equally');
}

// ---------------------------------------------------------------
section('together mode: a fully-shared day still earns the streak');
{
    let s = buildDefaultState(dateFor('2026-06-02'));
    const defs = getMergedDefs(s);
    defaultCycleIds(defs, 'daily').forEach(id => { s = check(s, id, 'both', '2026-06-02'); });
    const r = applyResetRules(s, dateFor('2026-06-03'));
    assert(r.state.streak === 1, `shared day counts as both acting (got ${r.state.streak})`);
}

// ---------------------------------------------------------------
section('together mode: shared weeklies satisfy the weekly streak');
{
    let s = buildDefaultState(dateFor('2026-06-02'));
    const defs = getMergedDefs(s);
    defaultCycleIds(defs, 'weekly').forEach(id => { s = check(s, id, 'both', '2026-06-02'); });
    const r = applyResetRules(s, dateFor('2026-06-08'));
    assert(r.state.weeklyStreak === 1, `weekly streak from shared events (got ${r.state.weeklyStreak})`);
}

// ---------------------------------------------------------------
section('together mode: both survives normalize round-trip');
{
    const n = normalizeState({
        tasks: { c2: true },
        taskActor: { c2: 'both' },
        events: [{ id: 'e_1', taskId: 'c2', name: 'Cook dinner', pts: 12, who: 'both', owner: 'chhaya', day: '2026-06-02', kind: 'daily' }],
        oneTimeTasks: { ot_z: { name: 'Assemble bed', points: 4, assignee: 'either', createdBy: 'aditya', done: true, doneBy: 'both', createdAt: '2026-06-02' } }
    });
    assert(n.taskActor.c2 === 'both', 'taskActor both kept');
    assert(n.events.length === 1 && n.events[0].who === 'both', 'both event kept');
    assert(n.oneTimeTasks.ot_z.doneBy === 'both', 'one-time doneBy both kept');
}

// ---------------------------------------------------------------
section('backfill: logging a missed chore onto a closed day');
{
    // Tue 06-02 closed with one chore; on Thu we backfill another
    let s = buildDefaultState(dateFor('2026-06-02'));
    s = check(s, 'a1', 'aditya', '2026-06-02');
    s = applyResetRules(s, dateFor('2026-06-04')).state;
    const prior = s.events.filter(e => e.day === '2026-06-02');

    // daily task: history entry gains the points, today's box untouched
    const fill = buildBackfill(s, 'c2', 'chhaya', '2026-06-02', prior, dateFor('2026-06-04'));
    assert(!!fill && fill.event.day === '2026-06-02', 'event lands on the target day');
    assert(fill.isLiveWeek === true, 'same week uses the live ledger');
    assert(fill.checkNow === false, 'past daily does not flip today\'s checkbox');
    approx(fill.entry.chhayaPoints, 12, 'backfilled points credited');
    approx(fill.entry.adityaPoints, 1, 'existing points preserved');
    assert(fill.entry.done === 2, 'done count includes the backfill');

    const merged = mergeHistoryEntry(s.dailyHistory, fill.entry);
    approx(merged.find(h => h.day === '2026-06-02').chhayaPoints, 12, 'history entry rewritten');

    // weekly task backfilled within the current week also checks the live box
    const wfill = buildBackfill(s, 'a9', 'aditya', '2026-06-02', prior, dateFor('2026-06-04'));
    assert(wfill.checkNow === true, 'current-week weekly flips the live checkbox');

    // ...but not when the day belongs to a previous week
    const oldFill = buildBackfill(s, 'a9', 'aditya', '2026-05-28', [], dateFor('2026-06-04'));
    assert(oldFill.isLiveWeek === false && oldFill.checkNow === false, 'previous-week weekly stays archive-only');

    // duplicate guard: task already done that day
    assert(buildBackfill(s, 'a1', 'chhaya', '2026-06-02', prior, dateFor('2026-06-04')) === null, 'no double-logging');

    // cycle guard: a weekly already checked this week can't be backfilled
    // onto an earlier day of the same week (would double-count the cycle)
    let sw = check(s, 'a9', 'aditya', '2026-06-04');
    assert(buildBackfill(sw, 'a9', 'aditya', '2026-06-02', prior, dateFor('2026-06-04')) === null, 'checked weekly blocked in-week');
    assert(buildBackfill(sw, 'a9', 'aditya', '2026-05-28', [], dateFor('2026-06-04')) !== null, 'previous week still fine');
    // a daily checked today never blocks a past-day backfill
    let sd = check(s, 'a1', 'aditya', '2026-06-04');
    assert(buildBackfill(sd, 'a1', 'aditya', '2026-06-03', [], dateFor('2026-06-04')) !== null, 'checked daily does not block');

    // never-closed day inserts a fresh entry in order
    const insFill = buildBackfill(s, 'a1', 'aditya', '2026-06-03', [], dateFor('2026-06-04'));
    const merged2 = mergeHistoryEntry(merged, insFill.entry);
    assert(merged2.map(h => h.day).join(',').includes('2026-06-02,2026-06-03'), 'inserted entry sorted into place');

    // travel flag survives the rewrite
    const sTravel = { ...s, dailyHistory: s.dailyHistory.map(h => h.day === '2026-06-02' ? { ...h, travel: true } : h) };
    const tFill = buildBackfill(sTravel, 'c2', 'both', '2026-06-02', prior, dateFor('2026-06-04'));
    assert(tFill.entry.travel === true, 'travel flag preserved');
    approx(tFill.entry.adityaPoints, 7, 'shared backfill splits points');
}

// ---------------------------------------------------------------
section('travel: paused-task rules');
{
    const dailyA = { cadence: 'daily', owner: 'aditya' };
    const dailyC = { cadence: 'daily', owner: 'chhaya' };
    const dailyEither = { cadence: 'daily', owner: null };
    const weeklyA = { cadence: 'weekly', owner: 'aditya' };
    const aTravels = { aditya: true, chhaya: false };
    const bothTravel = { aditya: true, chhaya: true };
    assert(isTaskPausedForTravel(dailyA, aTravels) === true, 'traveler-owned daily pauses');
    assert(isTaskPausedForTravel(dailyC, aTravels) === false, 'home-owned daily stays');
    assert(isTaskPausedForTravel(dailyEither, aTravels) === false, 'either-owned stays while one is home');
    assert(isTaskPausedForTravel(dailyEither, bothTravel) === true, 'either-owned pauses when both travel');
    assert(isTaskPausedForTravel(weeklyA, aTravels) === false, 'weeklies never pause');
    assert(travelActive({ travel: aTravels }) === true, 'travelActive on');
    assert(travelActive({ travel: { aditya: false, chhaya: false } }) === false, 'travelActive off');

    const s = buildDefaultState(dateFor('2026-06-02'));
    const defs = getMergedDefs(s);
    const dailies = defaultCycleIds(defs, 'daily');
    const filtered = filterTravelPaused(defs, dailies, aTravels);
    assert(filtered.length < dailies.length, 'travel filter drops traveler dailies');
    assert(filtered.every(id => defs.byId[id].owner !== 'aditya'), 'no aditya-owned dailies survive filter');
    assert(filterTravelPaused(defs, dailies, { aditya: false, chhaya: false }).length === dailies.length, 'no travel, no filtering');
}

// ---------------------------------------------------------------
section('travel: daily streak freezes instead of resetting');
{
    let s = buildDefaultState(dateFor('2026-06-02'));
    s.streak = 5;
    s.bestStreak = 8;
    s.travel = { aditya: true, chhaya: false };
    s.travelSince = '2026-06-01';
    s.lastTravelDay = '2026-06-02';
    const r = applyResetRules(s, dateFor('2026-06-03'));
    assert(r.state.streak === 5, `streak frozen during travel (got ${r.state.streak})`);
    assert(r.state.lastTravelDay === '2026-06-03', 'travel window extended through today');
    const entry = r.state.dailyHistory.find(h => h.day === '2026-06-02');
    assert(entry && entry.travel === true, 'closed travel day stamped');

    // control: same day, no travel -> streak resets
    let c = buildDefaultState(dateFor('2026-06-02'));
    c.streak = 5;
    assert(applyResetRules(c, dateFor('2026-06-03')).state.streak === 0, 'without travel the empty day resets');
}

// ---------------------------------------------------------------
section('travel: window keeps protecting days closed after return');
{
    let s = buildDefaultState(dateFor('2026-06-02'));
    s.streak = 4;
    s.travel = { aditya: false, chhaya: false }; // already back home
    s.travelSince = '2026-06-01';
    s.lastTravelDay = '2026-06-02';
    let r = applyResetRules(s, dateFor('2026-06-03'));
    assert(r.state.streak === 4, 'day inside past window still frozen');
    r = applyResetRules(r.state, dateFor('2026-06-04'));
    assert(r.state.streak === 0, 'first fully-home empty day resets again');
}

// ---------------------------------------------------------------
section('travel: weekly streak freezes for a travel-touched week');
{
    let s = buildDefaultState(dateFor('2026-06-02')); // week of 06-01
    s.weeklyStreak = 3;
    s.bestWeeklyStreak = 3;
    s.travel = { aditya: false, chhaya: false };
    s.travelSince = '2026-06-03';
    s.lastTravelDay = '2026-06-05';
    const r = applyResetRules(s, dateFor('2026-06-08')); // Monday rollover
    assert(r.state.weeklyStreak === 3, `weekly streak frozen (got ${r.state.weeklyStreak})`);

    // control: window entirely in an older week -> normal evaluation
    let c = buildDefaultState(dateFor('2026-06-02'));
    c.weeklyStreak = 3;
    c.travelSince = '2026-05-20';
    c.lastTravelDay = '2026-05-25';
    assert(applyResetRules(c, dateFor('2026-06-08')).state.weeklyStreak === 0, 'old window does not freeze this week');
}

// ---------------------------------------------------------------
section('travel: golden month ignores travel days');
{
    let s = buildDefaultState(dateFor('2026-05-31'));
    s.lastDailyReset = '2026-05-31';
    s.lastWeeklyReset = '2026-05-25';
    s.travel = { aditya: false, chhaya: false };
    s.travelSince = '2026-05-25';
    s.lastTravelDay = '2026-05-31';
    s.dailyHistory = [];
    for (let d = 5; d <= 24; d++) {
        const day = `2026-05-${String(d).padStart(2, '0')}`;
        s.dailyHistory.push({ day, done: 12, total: 13, points: 26, totalPoints: 28.33, adityaPoints: 14, chhayaPoints: 12, byKind: null });
    }
    for (let d = 25; d <= 30; d++) {
        const day = `2026-05-${String(d).padStart(2, '0')}`;
        s.dailyHistory.push({ day, done: 0, total: 13, points: 0, totalPoints: 28.33, adityaPoints: 0, chhayaPoints: 0, byKind: null, travel: true });
    }
    const r = applyResetRules(s, dateFor('2026-06-01'));
    assert(r.state.goldenMonths === 1, `golden month earned despite travel zeros (got ${r.state.goldenMonths})`);
}

// ---------------------------------------------------------------
section('travel: state fields normalize + round-trip');
{
    const n = normalizeState({
        travel: { aditya: true, chhaya: 'nonsense' },
        travelSince: '2026-06-01',
        lastTravelDay: '2026-06-05',
        dailyHistory: [
            { day: '2026-06-02', done: 1, total: 13, points: 2, totalPoints: 28, adityaPoints: 2, chhayaPoints: 0, travel: true },
            { day: '2026-06-03', done: 1, total: 13, points: 2, totalPoints: 28, adityaPoints: 0, chhayaPoints: 2 }
        ]
    });
    assert(n.travel.aditya === true && n.travel.chhaya === false, 'travel booleans sanitized');
    assert(n.travelSince === '2026-06-01' && n.lastTravelDay === '2026-06-05', 'window fields kept');
    assert(n.dailyHistory[0].travel === true, 'history travel flag kept');
    assert(!('travel' in n.dailyHistory[1]), 'absent flag stays absent');
    const legacy = normalizeState({ tasks: {} });
    assert(legacy.travel.aditya === false && legacy.travelSince === '' && legacy.lastTravelDay === '', 'legacy docs default travel off');
}

// ---------------------------------------------------------------
console.log(failures === 0 ? `\nALL PASS (${checks} checks)` : `\n${failures}/${checks} FAILED`);
process.exit(failures === 0 ? 1 - 1 : 1);
