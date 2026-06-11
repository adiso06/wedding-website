export const LOCAL_STORAGE_KEY = 'choreDashboardStateV3';
export const DEVICE_ID_KEY = 'choreDashboardDeviceId';
export const ACTIVE_USER_KEY = 'choreDashboardActiveUser';
export const COLLAPSED_SECTIONS_KEY = 'choreDashboardCollapsedSections';
export const RESET_TIME_ZONE = 'America/New_York';
// TODO: After rotating your Firebase API key in the console, update the apiKey below.
// Firebase web API keys are safe to ship in client code (security comes from Firestore rules),
// but rotating is still good practice after accidental exposure.
export const FIREBASE_CONFIG = {
    apiKey: 'AIzaSyBq0KwZ8urihRvMB2vUEuNfbG1PCcZqwt4',
    authDomain: 'todo-list-8465d.firebaseapp.com',
    projectId: 'todo-list-8465d',
    storageBucket: 'todo-list-8465d.firebasestorage.app',
    messagingSenderId: '908700447494',
    appId: '1:908700447494:web:52bdf252fcb405300c6487',
    measurementId: 'G-P2KR4PEWQS'
};
export const COLLECTION_NAME = 'dashboards';
export const DOCUMENT_ID = 'hidden-chores-tasklist';
export const RESET_INFO = 'daily resets nightly · weekly mon';
export const HISTORY_CAP = 35;
export const STREAK_THRESHOLD = 0.80;
export const WEEKLY_STREAK_THRESHOLD = 0.80;
export const MONTHLY_THRESHOLD = 0.85;
export const MONTHLY_MIN_DAYS = 15;

export const KUDOS_CAP = 50;
export const EVENTS_CAP = 400;
export const CHANGELOG_CAP = 100;

export const LOAD_DECAY = 0.5;
export const LOAD_WEEK_CAP = 4;
export const LOAD_STAGE_THRESHOLDS = [0.65, 0.725, 0.825, 0.90];
export const LOAD_LOUNGE_THRESHOLD = 0.80;
export const LOAD_BEACH_THRESHOLD = 0.90;
export const LOAD_MIN_WEIGHTED = 8;
export const LOAD_MIN_COMPLETIONS = 5;

export const USERS = ['aditya', 'chhaya'];

// --- Task definitions ---
// The standard chore set ships here; cloud-side `taskDefs` entries override
// fields per id (rename, points, owner, interval, retired) or add whole
// custom recurring chores (ids prefixed x_).

export const DEFAULT_TASK_DEFS = [
    // aditya · cat (daily cadence, own section)
    { id: 'a_cat1', name: 'Feed cats', points: 1, owner: 'aditya', cadence: 'daily', section: 'cat' },
    { id: 'a_cat2', name: 'Scoop litter', points: 1, owner: 'aditya', cadence: 'daily', section: 'cat' },
    { id: 'a_cat3', name: 'Sweep cat hair', points: 1.33, owner: 'aditya', cadence: 'daily', section: 'cat' },
    // aditya · daily
    { id: 'a1', name: 'Tidy couch', points: 1, owner: 'aditya', cadence: 'daily', room: 'House' },
    { id: 'a2', name: 'Pick up socks', points: 1, owner: 'aditya', cadence: 'daily', room: 'House' },
    { id: 'a3', name: 'Take out trash', points: 1.67, owner: 'aditya', cadence: 'daily', room: 'House' },
    { id: 'a4', name: 'Wipe counters', points: 2, owner: 'aditya', cadence: 'daily', room: 'House' },
    { id: 'a5', name: 'Clean sink', points: 1, owner: 'aditya', cadence: 'daily', room: 'Kitchen' },
    { id: 'a6', name: 'Load dishwasher', points: 2, owner: 'aditya', cadence: 'daily', room: 'Kitchen' },
    { id: 'a7', name: 'Wash big dishes', points: 2, owner: 'aditya', cadence: 'daily', room: 'Kitchen' },
    { id: 'a8', name: 'Empty dishwasher', points: 1.33, owner: 'aditya', cadence: 'daily', room: 'Kitchen' },
    // aditya · weekly
    { id: 'a10', name: 'Wash sheets', points: 1.33, owner: 'aditya', cadence: 'weekly', room: 'Bedroom' },
    { id: 'a11', name: 'Sweep floors', points: 1.67, owner: 'aditya', cadence: 'weekly', room: 'Kitchen' },
    { id: 'a12', name: 'Clean fridge inside', points: 2, owner: 'aditya', cadence: 'weekly', room: 'Kitchen' },
    { id: 'a13', name: 'Wipe fridge outside', points: 1, owner: 'aditya', cadence: 'weekly', room: 'Kitchen' },
    { id: 'a14', name: 'Scrub tub', points: 2, owner: 'aditya', cadence: 'weekly', room: 'Bathroom' },
    { id: 'a9', name: 'Vacuum', points: 1.33, owner: 'aditya', cadence: 'weekly', room: 'Living room' },
    { id: 'a15', name: 'Mop floors', points: 2, owner: 'aditya', cadence: 'weekly', room: 'Living room' },
    { id: 'a16', name: 'Wash blanket', points: 1.33, owner: 'aditya', cadence: 'weekly', room: 'Living room' },
    { id: 'a17', name: 'Water plants', points: 1.33, owner: 'aditya', cadence: 'weekly', room: 'Living room' },
    { id: 'a18', name: 'Grocery run', points: 4, owner: 'aditya', cadence: 'weekly', room: 'Errands' },
    // chhaya · daily
    { id: 'c1', name: 'Coffee maker', points: 1, owner: 'chhaya', cadence: 'daily' },
    { id: 'c2', name: 'Cooking', points: 12, owner: 'chhaya', cadence: 'daily' },
    // chhaya · weekly
    { id: 'c3', name: 'Wipe surfaces', points: 1, owner: 'chhaya', cadence: 'weekly', room: 'Bedroom' },
    { id: 'c4', name: 'Mats', points: 1, owner: 'chhaya', cadence: 'weekly', room: 'Kitchen' },
    { id: 'c5', name: 'Deep clean coffee maker', points: 1, owner: 'chhaya', cadence: 'weekly', room: 'Kitchen' },
    { id: 'c6', name: 'Clean ovens', points: 2, owner: 'chhaya', cadence: 'weekly', room: 'Kitchen' },
    { id: 'c7', name: 'Wipe floors, mirrors, sink', points: 2.67, owner: 'chhaya', cadence: 'weekly', room: 'Bathroom' },
    { id: 'c8', name: 'Wipe doors', points: 2, owner: 'chhaya', cadence: 'weekly', room: 'Bathroom' },
    { id: 'c9', name: 'Wash + vacuum carpets', points: 1.67, owner: 'chhaya', cadence: 'weekly', room: 'Bathroom' },
    { id: 'c10', name: 'Dust lamps', points: 2, owner: 'chhaya', cadence: 'weekly', room: 'Living room' },
    { id: 'c11', name: 'Clean shelves', points: 2, owner: 'chhaya', cadence: 'weekly', room: 'Living room' },
    { id: 'c12', name: 'Wipe mirror', points: 1, owner: 'chhaya', cadence: 'weekly', room: 'Living room' }
];

const DEFAULT_DEFS_BY_ID = Object.fromEntries(DEFAULT_TASK_DEFS.map(d => [d.id, d]));

function isUser(v) {
    return v === 'aditya' || v === 'chhaya';
}

function sanitizeDefOverride(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const o = {};
    if (typeof raw.name === 'string' && raw.name.trim()) o.name = raw.name.trim().slice(0, 60);
    if (Number.isFinite(raw.points) && raw.points > 0) o.points = raw.points;
    if (isUser(raw.owner)) o.owner = raw.owner;
    if (raw.cadence === 'daily' || raw.cadence === 'weekly') o.cadence = raw.cadence;
    if (typeof raw.room === 'string' && raw.room.trim()) o.room = raw.room.trim().slice(0, 30);
    if (raw.section === 'cat') o.section = 'cat';
    if (Number.isFinite(raw.interval) && raw.interval >= 1) o.interval = Math.round(raw.interval);
    if (typeof raw.lastReset === 'string') o.lastReset = raw.lastReset;
    if (raw.retired === true) o.retired = true;
    if (raw.custom === true) o.custom = true;
    return Object.keys(o).length > 0 ? o : null;
}

// Merge defaults + cloud overrides/additions into the working def set.
// Returns { list, byId } of ACTIVE defs (ordered) plus allById incl. retired.
export function getMergedDefs(state) {
    const overrides = (state && typeof state.taskDefs === 'object' && state.taskDefs !== null)
        ? state.taskDefs : {};
    const allById = {};
    const list = [];

    DEFAULT_TASK_DEFS.forEach(def => {
        const merged = { ...def, ...(overrides[def.id] || {}) };
        allById[def.id] = merged;
        if (!merged.retired) list.push(merged);
    });
    Object.keys(overrides).forEach(id => {
        if (DEFAULT_DEFS_BY_ID[id]) return;
        const o = overrides[id];
        if (!o || typeof o.name !== 'string' || !isUser(o.owner)) return;
        const merged = {
            id,
            name: o.name,
            points: Number.isFinite(o.points) && o.points > 0 ? o.points : 2,
            owner: o.owner,
            cadence: o.cadence === 'weekly' ? 'weekly' : 'daily',
            room: typeof o.room === 'string' && o.room.trim() ? o.room : undefined,
            interval: Number.isFinite(o.interval) && o.interval >= 1 ? Math.round(o.interval) : undefined,
            lastReset: typeof o.lastReset === 'string' ? o.lastReset : undefined,
            custom: true,
            retired: o.retired === true
        };
        allById[id] = merged;
        if (!merged.retired) list.push(merged);
    });

    const byId = {};
    list.forEach(d => { byId[d.id] = d; });
    return { list, byId, allById };
}

export function defaultIntervalFor(def) {
    return def.cadence === 'weekly' ? 7 : 1;
}

export function hasCustomInterval(def) {
    return Number.isFinite(def.interval) && def.interval !== defaultIntervalFor(def);
}

export function dailyIdsOf(defs) {
    return defs.list.filter(d => d.cadence === 'daily').map(d => d.id);
}

export function weeklyIdsOf(defs) {
    return defs.list.filter(d => d.cadence === 'weekly').map(d => d.id);
}

// Tasks on the standard daily/weekly cycle (custom-interval ones reset on
// their own schedule and are excluded from the daily completion denominator).
export function defaultCycleIds(defs, cadence) {
    return defs.list.filter(d => d.cadence === cadence && !hasCustomInterval(d)).map(d => d.id);
}

const BADGE_STOPS = [[1, 'S'], [1.33, 'SM'], [1.67, 'MS'], [2, 'M'], [2.67, 'ML'], [4, 'L']];

export function pointsToBadge(points) {
    if (points > 4) return Math.max(2, Math.round(points / 4)) + 'L';
    let best = BADGE_STOPS[0];
    BADGE_STOPS.forEach(stop => {
        if (Math.abs(stop[0] - points) < Math.abs(best[0] - points)) best = stop;
    });
    return best[1];
}

export function getDeviceId() {
    const existing = localStorage.getItem(DEVICE_ID_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
    return id;
}

// --- Dates ---

export function getTimeZoneDateParts(date = new Date()) {
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: RESET_TIME_ZONE,
        year: 'numeric', month: '2-digit', day: '2-digit'
    });
    const values = {};
    formatter.formatToParts(date).forEach(p => {
        if (p.type !== 'literal') values[p.type] = p.value;
    });
    return { year: Number(values.year), month: Number(values.month), day: Number(values.day) };
}

export function formatDateKey(year, month, day) {
    return [String(year).padStart(4, '0'), String(month).padStart(2, '0'), String(day).padStart(2, '0')].join('-');
}

export function getDayKey(date = new Date()) {
    const { year, month, day } = getTimeZoneDateParts(date);
    return formatDateKey(year, month, day);
}

export function getWeekKey(date = new Date()) {
    const { year, month, day } = getTimeZoneDateParts(date);
    const zoned = new Date(Date.UTC(year, month - 1, day, 12));
    const daysSinceMonday = (zoned.getUTCDay() + 6) % 7;
    zoned.setUTCDate(zoned.getUTCDate() - daysSinceMonday);
    return formatDateKey(zoned.getUTCFullYear(), zoned.getUTCMonth() + 1, zoned.getUTCDate());
}

export function daysBetween(fromKey, toKey) {
    if (!fromKey || !toKey) return 0;
    const [y1, m1, d1] = fromKey.split('-').map(Number);
    const [y2, m2, d2] = toKey.split('-').map(Number);
    const a = Date.UTC(y1, m1 - 1, d1);
    const b = Date.UTC(y2, m2 - 1, d2);
    return Math.round((b - a) / 86400000);
}

export function getWeekKeyFromDayKey(dayKey) {
    const [y, m, d] = dayKey.split('-').map(Number);
    const zoned = new Date(Date.UTC(y, m - 1, d, 12));
    const daysSinceMonday = (zoned.getUTCDay() + 6) % 7;
    zoned.setUTCDate(zoned.getUTCDate() - daysSinceMonday);
    return formatDateKey(zoned.getUTCFullYear(), zoned.getUTCMonth() + 1, zoned.getUTCDate());
}

export function weeksApart(weekKeyA, weekKeyB) {
    const [y1, m1, d1] = weekKeyA.split('-').map(Number);
    const [y2, m2, d2] = weekKeyB.split('-').map(Number);
    const a = Date.UTC(y1, m1 - 1, d1);
    const b = Date.UTC(y2, m2 - 1, d2);
    return Math.round((a - b) / (7 * 86400000));
}

export function monthKeyOf(dayKey) {
    return typeof dayKey === 'string' ? dayKey.slice(0, 7) : '';
}

// Day-of-week (0=Sun..6=Sat) of "now" in the reset time zone.
export function getZonedDayOfWeek(date = new Date()) {
    const { year, month, day } = getTimeZoneDateParts(date);
    return new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay();
}

export function fmtPts(n) {
    if (!n) return '0';
    if (Math.abs(n - Math.round(n)) < 0.01) return String(Math.round(n));
    return n.toFixed(1);
}

// --- Point helpers (defs-aware) ---

export function pointsFor(defs, ids) {
    return ids.reduce((sum, id) => sum + ((defs.byId[id] && defs.byId[id].points) || 0), 0);
}

export function pointsForChecked(defs, ids, tasks) {
    return ids.filter(id => tasks[id]).reduce((sum, id) => sum + ((defs.byId[id] && defs.byId[id].points) || 0), 0);
}

export function countChecked(ids, tasks) {
    return ids.filter(id => tasks[id]).length;
}

// --- Completion events ---

export function buildEvent(def, who, dayKey, kind) {
    return {
        id: 'e_' + crypto.randomUUID().slice(0, 10),
        taskId: def.id,
        name: def.name,
        pts: def.points,
        who,
        owner: isUser(def.owner) ? def.owner : null,
        day: dayKey,
        kind: kind || def.cadence
    };
}

export function findEventForTask(events, taskId) {
    for (let i = events.length - 1; i >= 0; i--) {
        if (events[i].taskId === taskId) return events[i];
    }
    return null;
}

function sumEventPts(events, who) {
    return events.filter(e => !who || e.who === who).reduce((s, e) => s + (e.pts || 0), 0);
}

// Aggregate one day's events into a history entry. The completion %
// denominator stays the default-cycle daily set so streaks keep meaning.
export function aggregateDayEntry(defs, dayKey, events) {
    const dayEvents = events.filter(e => e.day === dayKey);
    const dailyIds = new Set(defaultCycleIds(defs, 'daily'));
    const cycleDaily = dayEvents.filter(e => e.kind === 'daily' && dailyIds.has(e.taskId));
    const byKind = { daily: 0, weekly: 0, extra: 0 };
    dayEvents.forEach(e => {
        byKind[byKind[e.kind] !== undefined ? e.kind : 'extra'] += e.pts || 0;
    });
    return {
        day: dayKey,
        done: cycleDaily.length,
        acts: dayEvents.length,
        total: dailyIds.size,
        points: sumEventPts(cycleDaily),
        totalPoints: pointsFor(defs, [...dailyIds]),
        adityaPoints: sumEventPts(dayEvents, 'aditya'),
        chhayaPoints: sumEventPts(dayEvents, 'chhaya'),
        byKind
    };
}

// --- State shape ---

export function buildDefaultState(date = new Date()) {
    return {
        taskDefs: {},
        tasks: Object.fromEntries(DEFAULT_TASK_DEFS.map(d => [d.id, false])),
        taskActor: {},
        oneTimeTasks: {},
        events: [],
        kudos: [],
        kudosSeen: { aditya: '', chhaya: '' },
        achievements: {},
        changeLog: [],
        lifetime: { tasks: 0, adityaPoints: 0, chhayaPoints: 0, crossHelps: 0, kudosAditya: 0, kudosChhaya: 0 },
        lastDailyReset: getDayKey(date),
        lastWeeklyReset: getWeekKey(date),
        streak: 0,
        bestStreak: 0,
        weeklyStreak: 0,
        bestWeeklyStreak: 0,
        goldenMonths: 0,
        lastMonthProcessed: '',
        dailyHistory: []
    };
}

export function normalizeState(rawState) {
    const def = buildDefaultState();
    if (!rawState || typeof rawState !== 'object') return def;

    // task defs (overrides + customs)
    const rawDefs = (typeof rawState.taskDefs === 'object' && rawState.taskDefs !== null) ? rawState.taskDefs : {};
    const taskDefs = {};
    Object.keys(rawDefs).forEach(id => {
        const o = sanitizeDefOverride(rawDefs[id]);
        if (o) taskDefs[id] = o;
    });

    // legacy taskMeta {interval, assignee, lastReset} folds into def overrides
    const rawMeta = (typeof rawState.taskMeta === 'object' && rawState.taskMeta !== null) ? rawState.taskMeta : {};
    Object.keys(rawMeta).forEach(id => {
        if (taskDefs[id]) return;
        const m = rawMeta[id];
        if (!m || typeof m !== 'object') return;
        const o = {};
        if (Number.isFinite(m.interval) && m.interval >= 1) o.interval = Math.round(m.interval);
        if (typeof m.lastReset === 'string') o.lastReset = m.lastReset;
        if (isUser(m.assignee)) o.owner = m.assignee;
        if (Object.keys(o).length > 0) taskDefs[id] = o;
    });

    const merged = getMergedDefs({ taskDefs });

    const rawTasks = (typeof rawState.tasks === 'object' && rawState.tasks !== null) ? rawState.tasks : {};
    const rawActor = (typeof rawState.taskActor === 'object' && rawState.taskActor !== null) ? rawState.taskActor : {};
    const tasks = {};
    const taskActor = {};
    merged.list.forEach(d => {
        tasks[d.id] = Boolean(rawTasks[d.id]);
        if (tasks[d.id] && isUser(rawActor[d.id])) taskActor[d.id] = rawActor[d.id];
    });

    const lastDailyReset = typeof rawState.lastDailyReset === 'string' ? rawState.lastDailyReset : def.lastDailyReset;

    // events ledger; legacy docs (no events field) get events synthesized
    // from currently-checked tasks so in-progress credit isn't lost
    let events = [];
    if (Array.isArray(rawState.events)) {
        events = rawState.events
            .filter(e => e && typeof e.id === 'string' && typeof e.taskId === 'string'
                && isUser(e.who) && typeof e.day === 'string' && Number.isFinite(e.pts))
            .map(e => ({
                id: e.id,
                taskId: e.taskId,
                name: typeof e.name === 'string' ? e.name : e.taskId,
                pts: e.pts,
                who: e.who,
                owner: isUser(e.owner) ? e.owner : null,
                day: e.day,
                kind: (e.kind === 'daily' || e.kind === 'weekly' || e.kind === 'extra') ? e.kind : 'daily'
            }))
            .slice(-EVENTS_CAP);
    } else {
        merged.list.forEach(d => {
            if (!tasks[d.id]) return;
            const who = taskActor[d.id] || d.owner;
            events.push({
                id: 'mig_' + d.id,
                taskId: d.id,
                name: d.name,
                pts: d.points,
                who,
                owner: d.owner,
                day: lastDailyReset,
                kind: d.cadence
            });
        });
    }

    const rawOneTime = (typeof rawState.oneTimeTasks === 'object' && rawState.oneTimeTasks !== null) ? rawState.oneTimeTasks : {};
    const oneTimeTasks = {};
    Object.keys(rawOneTime).forEach(id => {
        const t = rawOneTime[id];
        if (!t || typeof t !== 'object' || typeof t.name !== 'string') return;
        oneTimeTasks[id] = {
            name: t.name,
            points: Number.isFinite(t.points) ? t.points : 2,
            assignee: (isUser(t.assignee) || t.assignee === 'either') ? t.assignee : 'either',
            createdBy: isUser(t.createdBy) ? t.createdBy : 'aditya',
            done: Boolean(t.done),
            doneBy: isUser(t.doneBy) ? t.doneBy : null,
            createdAt: typeof t.createdAt === 'string' ? t.createdAt : getDayKey(),
            completedAt: typeof t.completedAt === 'string' ? t.completedAt : (Boolean(t.done) ? (typeof t.createdAt === 'string' ? t.createdAt : getDayKey()) : null)
        };
    });

    const rawKudos = Array.isArray(rawState.kudos) ? rawState.kudos : [];
    const kudos = rawKudos
        .filter(k => k && typeof k.id === 'string' && isUser(k.from))
        .map(k => ({
            id: k.id,
            from: k.from,
            to: isUser(k.to) ? k.to : (k.from === 'aditya' ? 'chhaya' : 'aditya'),
            emoji: typeof k.emoji === 'string' ? k.emoji : 'star',
            taskId: typeof k.taskId === 'string' ? k.taskId : null,
            taskName: typeof k.taskName === 'string' ? k.taskName : null,
            message: typeof k.message === 'string' ? k.message : null,
            timestamp: typeof k.timestamp === 'string' ? k.timestamp : ''
        }))
        .slice(-KUDOS_CAP);

    const rawSeen = (typeof rawState.kudosSeen === 'object' && rawState.kudosSeen !== null) ? rawState.kudosSeen : {};
    const kudosSeen = {
        aditya: typeof rawSeen.aditya === 'string' ? rawSeen.aditya : '',
        chhaya: typeof rawSeen.chhaya === 'string' ? rawSeen.chhaya : ''
    };

    const rawAchievements = (typeof rawState.achievements === 'object' && rawState.achievements !== null) ? rawState.achievements : {};
    const achievements = {};
    Object.keys(rawAchievements).forEach(id => {
        const a = rawAchievements[id];
        if (!a || typeof a !== 'object') return;
        achievements[id] = {
            who: (isUser(a.who) || a.who === 'both') ? a.who : 'both',
            earnedAt: typeof a.earnedAt === 'string' ? a.earnedAt : getDayKey()
        };
    });

    const rawLog = Array.isArray(rawState.changeLog) ? rawState.changeLog : [];
    const changeLog = rawLog
        .filter(c => c && typeof c.ts === 'string' && isUser(c.who) && typeof c.action === 'string')
        .map(c => ({
            ts: c.ts,
            who: c.who,
            action: c.action,
            taskId: typeof c.taskId === 'string' ? c.taskId : null,
            detail: typeof c.detail === 'string' ? c.detail : ''
        }))
        .slice(-CHANGELOG_CAP);

    const rawLife = (typeof rawState.lifetime === 'object' && rawState.lifetime !== null) ? rawState.lifetime : {};
    const lifetime = {};
    Object.keys(def.lifetime).forEach(k => {
        lifetime[k] = Number.isFinite(rawLife[k]) ? Math.max(0, rawLife[k]) : 0;
    });

    const nonNegInt = v => Number.isFinite(v) ? Math.max(0, Math.floor(v)) : 0;

    return {
        taskDefs,
        tasks,
        taskActor,
        oneTimeTasks,
        events,
        kudos,
        kudosSeen,
        achievements,
        changeLog,
        lifetime,
        lastDailyReset,
        lastWeeklyReset: typeof rawState.lastWeeklyReset === 'string' ? rawState.lastWeeklyReset : def.lastWeeklyReset,
        streak: nonNegInt(rawState.streak),
        bestStreak: nonNegInt(rawState.bestStreak),
        weeklyStreak: nonNegInt(rawState.weeklyStreak),
        bestWeeklyStreak: nonNegInt(rawState.bestWeeklyStreak),
        goldenMonths: nonNegInt(rawState.goldenMonths),
        lastMonthProcessed: typeof rawState.lastMonthProcessed === 'string' ? rawState.lastMonthProcessed : '',
        dailyHistory: Array.isArray(rawState.dailyHistory)
            ? rawState.dailyHistory
                .filter(h => h && typeof h.day === 'string')
                .map(h => ({
                    day: h.day,
                    done: Number.isFinite(h.done) ? h.done : 0,
                    acts: Number.isFinite(h.acts) ? h.acts : (Number.isFinite(h.done) ? h.done : 0),
                    total: Number.isFinite(h.total) ? h.total : 0,
                    points: Number.isFinite(h.points) ? h.points : 0,
                    totalPoints: Number.isFinite(h.totalPoints) ? h.totalPoints : 0,
                    adityaPoints: Number.isFinite(h.adityaPoints) ? h.adityaPoints : 0,
                    chhayaPoints: Number.isFinite(h.chhayaPoints) ? h.chhayaPoints : 0,
                    byKind: (h.byKind && typeof h.byKind === 'object') ? {
                        daily: Number.isFinite(h.byKind.daily) ? h.byKind.daily : 0,
                        weekly: Number.isFinite(h.byKind.weekly) ? h.byKind.weekly : 0,
                        extra: Number.isFinite(h.byKind.extra) ? h.byKind.extra : 0
                    } : null
                }))
                .slice(-HISTORY_CAP)
            : []
    };
}

// --- Reset rules ---
// Pure given (state, date): closes out past days from the events ledger,
// updates daily/weekly/monthly streaks and lifetime counters, resets task
// checkboxes on their cycles, prunes old events, cleans up done extras.

export function applyResetRules(sourceState, date = new Date()) {
    const defs = getMergedDefs(sourceState);
    const next = {
        ...sourceState,
        taskDefs: { ...(sourceState.taskDefs || {}) },
        tasks: { ...sourceState.tasks },
        taskActor: { ...(sourceState.taskActor || {}) },
        oneTimeTasks: { ...(sourceState.oneTimeTasks || {}) },
        events: [...(sourceState.events || [])],
        kudos: (sourceState.kudos || []).slice(-KUDOS_CAP),
        changeLog: (sourceState.changeLog || []).slice(-CHANGELOG_CAP),
        lifetime: { ...(sourceState.lifetime || buildDefaultState().lifetime) },
        achievements: { ...(sourceState.achievements || {}) },
        dailyHistory: [...(sourceState.dailyHistory || [])]
    };
    const todayKey = getDayKey(date);
    const weekKey = getWeekKey(date);
    let changed = false;
    const archivedDays = [];

    const cycleDailyIds = defaultCycleIds(defs, 'daily');
    const cycleWeeklyIds = defaultCycleIds(defs, 'weekly');

    // 1. Daily rollover: close every past day that has events or was the open day
    if (next.lastDailyReset !== todayKey) {
        const historyDays = new Set(next.dailyHistory.map(h => h.day));
        const daysToClose = new Set([next.lastDailyReset]);
        next.events.forEach(e => {
            if (e.day < todayKey) daysToClose.add(e.day);
        });
        [...daysToClose]
            .filter(d => d && d < todayKey && !historyDays.has(d))
            .sort()
            .forEach(d => {
                const entry = aggregateDayEntry(defs, d, next.events);
                next.dailyHistory.push(entry);
                archivedDays.push({
                    ...entry,
                    weekKey: getWeekKeyFromDayKey(d),
                    events: next.events.filter(e => e.day === d)
                });
                next.lifetime.tasks += next.events.filter(e => e.day === d).length;
                next.lifetime.adityaPoints += entry.adityaPoints;
                next.lifetime.chhayaPoints += entry.chhayaPoints;
                next.lifetime.crossHelps += next.events.filter(e => e.day === d && e.owner && e.who !== e.owner).length;
            });
        next.dailyHistory.sort((a, b) => a.day < b.day ? -1 : 1);
        if (next.dailyHistory.length > HISTORY_CAP) {
            next.dailyHistory = next.dailyHistory.slice(-HISTORY_CAP);
        }

        // streak from the day that just closed
        const closing = next.dailyHistory.find(h => h.day === next.lastDailyReset)
            || aggregateDayEntry(defs, next.lastDailyReset, next.events);
        const daysPassed = daysBetween(next.lastDailyReset, todayKey);
        const pctDone = closing.totalPoints > 0 ? closing.points / closing.totalPoints : 0;
        const earned = daysPassed === 1 && pctDone >= STREAK_THRESHOLD
            && closing.adityaPoints > 0 && closing.chhayaPoints > 0;
        if (earned) {
            next.streak += 1;
            if (next.streak > next.bestStreak) next.bestStreak = next.streak;
        } else {
            next.streak = 0;
        }

        // monthly evaluation when the calendar month rolled over
        const closedMonth = monthKeyOf(next.lastDailyReset);
        if (closedMonth && closedMonth !== monthKeyOf(todayKey) && closedMonth !== next.lastMonthProcessed) {
            const monthEntries = next.dailyHistory.filter(h => monthKeyOf(h.day) === closedMonth && h.totalPoints > 0);
            if (monthEntries.length >= MONTHLY_MIN_DAYS) {
                const avg = monthEntries.reduce((s, h) => s + h.points / h.totalPoints, 0) / monthEntries.length;
                if (avg >= MONTHLY_THRESHOLD) next.goldenMonths += 1;
            }
            next.lastMonthProcessed = closedMonth;
        }

        cycleDailyIds.forEach(id => {
            next.tasks[id] = false;
            delete next.taskActor[id];
        });
        next.lastDailyReset = todayKey;
        changed = true;
    }

    // 2. Weekly rollover: weekly streak from the closed week, then reset weeklies
    if (next.lastWeeklyReset !== weekKey) {
        const wTotal = pointsFor(defs, cycleWeeklyIds);
        const wDone = pointsForChecked(defs, cycleWeeklyIds, next.tasks);
        const weekEvents = next.events.filter(e => e.day >= next.lastWeeklyReset && e.day < weekKey);
        const weeksPassed = weeksApart(weekKey, next.lastWeeklyReset);
        const earned = weeksPassed === 1
            && wTotal > 0 && wDone / wTotal >= WEEKLY_STREAK_THRESHOLD
            && weekEvents.some(e => e.who === 'aditya') && weekEvents.some(e => e.who === 'chhaya');
        if (earned) {
            next.weeklyStreak += 1;
            if (next.weeklyStreak > next.bestWeeklyStreak) next.bestWeeklyStreak = next.weeklyStreak;
        } else {
            next.weeklyStreak = 0;
        }

        cycleWeeklyIds.forEach(id => {
            next.tasks[id] = false;
            delete next.taskActor[id];
        });
        next.lastWeeklyReset = weekKey;
        next.events = next.events.filter(e => e.day >= weekKey);
        changed = true;
    }

    // 3. Custom-interval tasks reset on their own schedule
    defs.list.forEach(d => {
        if (!hasCustomInterval(d)) return;
        const lastReset = d.lastReset || next.lastDailyReset;
        if (daysBetween(lastReset, todayKey) >= d.interval) {
            next.tasks[d.id] = false;
            delete next.taskActor[d.id];
            next.taskDefs[d.id] = { ...(next.taskDefs[d.id] || {}), lastReset: todayKey };
            changed = true;
        }
    });

    // 4. Completed one-time tasks linger for the rest of their completion day
    Object.entries(next.oneTimeTasks).forEach(([id, t]) => {
        if (!t.done) return;
        const doneDay = t.completedAt || t.createdAt;
        if (doneDay && daysBetween(doneDay, todayKey) >= 1) {
            delete next.oneTimeTasks[id];
            changed = true;
        }
    });

    return { state: next, changed, archivedDays };
}

export function saveLocalState(s) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(s));
}

export function loadLocalState() {
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
            || localStorage.getItem('choreDashboardStateV2');
        return normalizeState(JSON.parse(raw || 'null'));
    } catch {
        return buildDefaultState();
    }
}

// --- Uncheck handling ---
// Removing a completion may touch a day that's already archived (weekly task
// unchecked mid-week): recompute that day's history entry too.

export function removeCompletion(state, taskId) {
    const event = findEventForTask(state.events || [], taskId);
    const next = {
        ...state,
        tasks: { ...state.tasks, [taskId]: false },
        taskActor: { ...(state.taskActor || {}) },
        events: event ? (state.events || []).filter(e => e.id !== event.id) : [...(state.events || [])]
    };
    delete next.taskActor[taskId];

    let rearchivedEntry = null;
    if (event && event.day !== state.lastDailyReset) {
        const idx = next.dailyHistory.findIndex(h => h.day === event.day);
        if (idx >= 0) {
            const defs = getMergedDefs(next);
            rearchivedEntry = aggregateDayEntry(defs, event.day, next.events);
            next.dailyHistory = [...next.dailyHistory];
            next.dailyHistory[idx] = rearchivedEntry;
        }
    }
    return { state: next, removedEvent: event, rearchivedEntry };
}

// --- Workload ---

export function computeWeightedLoad(stateRef, today = new Date()) {
    if (!stateRef) return { aWeighted: 0, cWeighted: 0, total: 0, heavierUser: null, heavierShare: 0.5 };
    const history = Array.isArray(stateRef.dailyHistory) ? stateRef.dailyHistory : [];
    const events = Array.isArray(stateRef.events) ? stateRef.events : [];
    const currentWeek = getWeekKey(today);
    const historyDays = new Set(history.map(h => h.day));

    const buckets = {};
    const add = (wk, who, pts) => {
        if (!buckets[wk]) buckets[wk] = { aditya: 0, chhaya: 0 };
        buckets[wk][who] += pts;
    };
    history.forEach(h => {
        const wk = getWeekKeyFromDayKey(h.day);
        add(wk, 'aditya', h.adityaPoints || 0);
        add(wk, 'chhaya', h.chhayaPoints || 0);
    });
    // today's (un-archived) completions
    let openCompletions = 0;
    events.forEach(e => {
        if (historyDays.has(e.day)) return;
        add(getWeekKeyFromDayKey(e.day), e.who, e.pts || 0);
        openCompletions += 1;
    });

    let aWeighted = 0;
    let cWeighted = 0;
    Object.keys(buckets).forEach(wk => {
        const ago = weeksApart(currentWeek, wk);
        if (ago < 0 || ago > LOAD_WEEK_CAP) return;
        const w = Math.pow(LOAD_DECAY, ago);
        aWeighted += buckets[wk].aditya * w;
        cWeighted += buckets[wk].chhaya * w;
    });

    const total = aWeighted + cWeighted;
    if (total <= 0) {
        return { aWeighted: 0, cWeighted: 0, total: 0, heavierUser: null, heavierShare: 0.5 };
    }

    const historyCompletions = history.reduce((s, h) => s + (Number.isFinite(h.acts) ? h.acts : (h.done || 0)), 0);
    const totalCompletions = historyCompletions + openCompletions;
    if (total < LOAD_MIN_WEIGHTED || totalCompletions < LOAD_MIN_COMPLETIONS) {
        return { aWeighted, cWeighted, total, heavierUser: null, heavierShare: 0.5 };
    }

    const heavierUser = aWeighted >= cWeighted ? 'aditya' : 'chhaya';
    const heavierShare = Math.max(aWeighted, cWeighted) / total;
    return { aWeighted, cWeighted, total, heavierUser, heavierShare };
}

export function getLoadStage(share) {
    for (let i = LOAD_STAGE_THRESHOLDS.length - 1; i >= 0; i--) {
        if (share >= LOAD_STAGE_THRESHOLDS[i]) return i + 1;
    }
    return 0;
}

export function getLighterPose(share) {
    if (share >= LOAD_BEACH_THRESHOLD) return 'beach';
    if (share >= LOAD_LOUNGE_THRESHOLD) return 'lounge';
    return 'neutral';
}

// --- Achievements ---
// Tiered: daily streaks, weekly (deep-clean) streaks, golden months, misc.
// `legacy` maps ids earned under the old flat scheme.

export const ACHIEVEMENT_DEFS = [
    { id: 'daily-1', group: 'daily', name: 'Spark', icon: '✨', hint: '1-day streak', streak: 1, legacy: 'first-streak' },
    { id: 'daily-3', group: 'daily', name: 'Kindling', icon: '🔥', hint: '3-day streak', streak: 3 },
    { id: 'daily-7', group: 'daily', name: 'Week Warrior', icon: '⚔️', hint: '7-day streak', streak: 7, legacy: 'streak-7' },
    { id: 'daily-14', group: 'daily', name: 'Fortnight Flow', icon: '🌊', hint: '14-day streak', streak: 14 },
    { id: 'daily-30', group: 'daily', name: 'Unstoppable', icon: '🚀', hint: '30-day streak', streak: 30, legacy: 'streak-30' },
    { id: 'daily-60', group: 'daily', name: 'Habit Diamond', icon: '💎', hint: '60-day streak', streak: 60 },
    { id: 'daily-100', group: 'daily', name: 'Century Club', icon: '💯', hint: '100-day streak', streak: 100 },
    { id: 'daily-180', group: 'daily', name: 'Half-Year Hero', icon: '🌗', hint: '180-day streak', streak: 180 },
    { id: 'daily-365', group: 'daily', name: 'Year of the House', icon: '🏆', hint: '365-day streak', streak: 365 },
    { id: 'weekly-2', group: 'weekly', name: 'Back to Back', icon: '🔁', hint: '2-week deep-clean streak', weeks: 2 },
    { id: 'weekly-4', group: 'weekly', name: 'Monthly Rhythm', icon: '🥁', hint: '4-week deep-clean streak', weeks: 4 },
    { id: 'weekly-8', group: 'weekly', name: 'Two-Month Tempo', icon: '🎵', hint: '8-week deep-clean streak', weeks: 8 },
    { id: 'weekly-12', group: 'weekly', name: 'Quarter Master', icon: '🧭', hint: '12-week deep-clean streak', weeks: 12 },
    { id: 'weekly-26', group: 'weekly', name: 'Half-Year Sweep', icon: '🌓', hint: '26-week deep-clean streak', weeks: 26 },
    { id: 'weekly-52', group: 'weekly', name: 'Legendary Year', icon: '👑', hint: '52-week deep-clean streak', weeks: 52 },
    { id: 'monthly-1', group: 'monthly', name: 'Golden Month', icon: '🌕', hint: 'a month averaging ≥85%', months: 1 },
    { id: 'monthly-3', group: 'monthly', name: 'Golden Quarter', icon: '🌟', hint: '3 golden months', months: 3 },
    { id: 'monthly-6', group: 'monthly', name: 'Golden Half', icon: '☀️', hint: '6 golden months', months: 6 },
    { id: 'monthly-12', group: 'monthly', name: 'Golden Year', icon: '🥇', hint: '12 golden months', months: 12 },
    { id: 'perfect-day', group: 'misc', name: 'Flawless', icon: '🌈', hint: '100% daily completion' },
    { id: 'hundred-tasks', group: 'misc', name: 'Centurion', icon: '🎯', hint: '100 lifetime tasks completed' },
    { id: 'cross-help-5', group: 'misc', name: 'Team Player', icon: '🤝', hint: "Complete 5 of the other person's chores" },
    { id: 'first-kudos', group: 'misc', name: 'Appreciation', icon: '⭐', hint: 'Send your first kudos' },
    { id: 'kudos-10', group: 'misc', name: 'Hype Machine', icon: '📣', hint: 'Send 10 kudos' },
    { id: 'weekend-sweep', group: 'misc', name: 'Weekend Warrior', icon: '🧹', hint: 'All weekly chores done before Saturday' }
];

export function isAchievementEarned(achievements, def) {
    if (!achievements) return false;
    if (achievements[def.id]) return achievements[def.id];
    if (def.legacy && achievements[def.legacy]) return achievements[def.legacy];
    return false;
}

export function checkAchievements(s, now = new Date()) {
    const earned = s.achievements || {};
    const newlyEarned = {};
    const today = getDayKey(now);
    const defs = getMergedDefs(s);
    const lifetime = s.lifetime || {};
    const todayEvents = (s.events || []).filter(e => e.day === s.lastDailyReset);
    const grant = (def, who = 'both') => { newlyEarned[def.id] = { who, earnedAt: today }; };

    ACHIEVEMENT_DEFS.forEach(def => {
        if (isAchievementEarned(earned, def)) return;
        if (def.streak) {
            if ((s.streak || 0) >= def.streak) grant(def);
        } else if (def.weeks) {
            if ((s.weeklyStreak || 0) >= def.weeks) grant(def);
        } else if (def.months) {
            if ((s.goldenMonths || 0) >= def.months) grant(def);
        }
    });

    const byId = Object.fromEntries(ACHIEVEMENT_DEFS.map(d => [d.id, d]));

    const cycleDaily = defaultCycleIds(defs, 'daily');
    if (!earned['perfect-day'] && cycleDaily.length > 0 && cycleDaily.every(id => s.tasks[id])) {
        grant(byId['perfect-day']);
    }

    if (!earned['hundred-tasks'] && (lifetime.tasks || 0) + todayEvents.length >= 100) {
        grant(byId['hundred-tasks']);
    }

    const crossToday = todayEvents.filter(e => e.owner && e.who !== e.owner).length;
    if (!earned['cross-help-5'] && (lifetime.crossHelps || 0) + crossToday >= 5) {
        grant(byId['cross-help-5']);
    }

    const kudos = s.kudos || [];
    const kudosSent = (lifetime.kudosAditya || 0) + (lifetime.kudosChhaya || 0);
    if (!earned['first-kudos'] && (kudos.length >= 1 || kudosSent >= 1)) {
        const lastSender = kudos.length ? kudos[kudos.length - 1].from : 'both';
        grant(byId['first-kudos'], lastSender);
    }
    if (!earned['kudos-10'] && Math.max(kudosSent, kudos.length) >= 10) {
        grant(byId['kudos-10']);
    }

    if (!earned['weekend-sweep']) {
        const cycleWeekly = defaultCycleIds(defs, 'weekly');
        if (cycleWeekly.length > 0 && cycleWeekly.every(id => s.tasks[id])) {
            const dow = getZonedDayOfWeek(now);
            if (dow >= 1 && dow <= 5) grant(byId['weekend-sweep']);
        }
    }

    return newlyEarned;
}

// --- Firebase ---

let firestoreApi = null;
let docRef = null;
let daysCollectionRef = null;
let unsubscribe = null;

export async function connectFirebase() {
    const [{ initializeApp }, firestoreModule] = await Promise.all([
        import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
    ]);
    const app = initializeApp(FIREBASE_CONFIG);
    firestoreApi = {
        db: firestoreModule.getFirestore(app),
        serverTimestamp: firestoreModule.serverTimestamp,
        setDoc: firestoreModule.setDoc,
        updateDoc: firestoreModule.updateDoc,
        onSnapshot: firestoreModule.onSnapshot,
        doc: firestoreModule.doc,
        collection: firestoreModule.collection,
        query: firestoreModule.query,
        orderBy: firestoreModule.orderBy,
        limit: firestoreModule.limit,
        startAt: firestoreModule.startAt,
        getDocs: firestoreModule.getDocs,
        runTransaction: firestoreModule.runTransaction,
        deleteField: firestoreModule.deleteField,
        arrayUnion: firestoreModule.arrayUnion,
        arrayRemove: firestoreModule.arrayRemove,
        increment: firestoreModule.increment
    };
    docRef = firestoreApi.doc(firestoreApi.db, COLLECTION_NAME, DOCUMENT_ID);
    daysCollectionRef = firestoreApi.collection(docRef, 'days');
}

export function isFirebaseReady() {
    return !!(firestoreApi && docRef);
}

function stamp(update) {
    update.updatedAt = firestoreApi.serverTimestamp();
    update.updatedBy = getDeviceId();
    return update;
}

export async function archiveDayToSubcollection(dayKey, dayData) {
    if (!firestoreApi || !daysCollectionRef) return;
    const dayDocRef = firestoreApi.doc(daysCollectionRef, dayKey);
    await firestoreApi.setDoc(dayDocRef, dayData, { merge: true });
}

export async function fetchHistory(count = 7) {
    if (!firestoreApi || !daysCollectionRef) return [];
    try {
        const q = firestoreApi.query(
            daysCollectionRef,
            firestoreApi.orderBy('__name__', 'desc'),
            firestoreApi.limit(count)
        );
        const snapshot = await firestoreApi.getDocs(q);
        const results = [];
        snapshot.forEach(d => results.push({ day: d.id, ...d.data() }));
        return results.reverse();
    } catch {
        return [];
    }
}

// All archived days from fromDayKey (inclusive) onward; fromDayKey null = all.
export async function fetchHistoryRange(fromDayKey = null) {
    if (!firestoreApi || !daysCollectionRef) return [];
    try {
        const parts = [daysCollectionRef, firestoreApi.orderBy('__name__', 'asc')];
        if (fromDayKey) parts.push(firestoreApi.startAt(fromDayKey));
        const snapshot = await firestoreApi.getDocs(firestoreApi.query(...parts));
        const results = [];
        snapshot.forEach(d => results.push({ day: d.id, ...d.data() }));
        return results;
    } catch {
        return [];
    }
}

function fullDocPayload(s) {
    return stamp({
        taskDefs: s.taskDefs || {},
        tasks: s.tasks,
        taskActor: s.taskActor,
        oneTimeTasks: s.oneTimeTasks || {},
        events: s.events || [],
        kudos: s.kudos || [],
        kudosSeen: s.kudosSeen || { aditya: '', chhaya: '' },
        achievements: s.achievements || {},
        changeLog: s.changeLog || [],
        lifetime: s.lifetime || buildDefaultState().lifetime,
        lastDailyReset: s.lastDailyReset,
        lastWeeklyReset: s.lastWeeklyReset,
        streak: s.streak,
        bestStreak: s.bestStreak,
        weeklyStreak: s.weeklyStreak || 0,
        bestWeeklyStreak: s.bestWeeklyStreak || 0,
        goldenMonths: s.goldenMonths || 0,
        lastMonthProcessed: s.lastMonthProcessed || '',
        dailyHistory: s.dailyHistory
    });
}

export async function syncResetsToCloud(currentState) {
    if (!firestoreApi || !docRef) return;
    let toArchive = [];

    await firestoreApi.runTransaction(firestoreApi.db, async (transaction) => {
        toArchive = [];
        const snapshot = await transaction.get(docRef);
        const source = snapshot.exists()
            ? normalizeState(snapshot.data())
            : normalizeState(currentState || buildDefaultState());

        const { state: next, changed, archivedDays } = applyResetRules(source);
        toArchive = archivedDays;

        if (!snapshot.exists() || changed) {
            transaction.set(docRef, fullDocPayload(next), { merge: true });
        }
    });

    for (const day of toArchive) {
        await archiveDayToSubcollection(day.day, day);
    }
}

// Check/uncheck a task. Field-level updates only — never writes a default
// task map over live data. historyRewrite (uncheck of an archived day's
// weekly task) replaces dailyHistory wholesale since array entries can't be
// field-updated.
export async function updateTaskInCloud({ taskId, checked, actor, event, historyRewrite, currentState }) {
    if (!firestoreApi || !docRef) return;
    const update = {
        [`tasks.${taskId}`]: checked,
        [`taskActor.${taskId}`]: checked ? actor : firestoreApi.deleteField()
    };
    if (event) {
        update.events = checked ? firestoreApi.arrayUnion(event) : firestoreApi.arrayRemove(event);
    }
    if (historyRewrite) {
        update.dailyHistory = historyRewrite;
    }
    try {
        await firestoreApi.updateDoc(docRef, stamp(update));
    } catch {
        // doc likely missing: create it safely via the reset transaction, retry once
        await syncResetsToCloud(currentState || null);
        await firestoreApi.updateDoc(docRef, stamp({ ...update }));
    }
}

export function subscribeToSharedState(onData, onError) {
    if (!firestoreApi || !docRef) return null;
    unsubscribe = firestoreApi.onSnapshot(docRef, onData, onError);
    return unsubscribe;
}

export function getSnapshotData(snapshot) {
    if (!snapshot.exists()) return null;
    return normalizeState(snapshot.data());
}

export async function updateTaskDefInCloud(taskId, defOverride, logEntry) {
    if (!firestoreApi || !docRef) return;
    const update = {
        [`taskDefs.${taskId}`]: defOverride ? defOverride : firestoreApi.deleteField()
    };
    if (logEntry) update.changeLog = firestoreApi.arrayUnion(logEntry);
    await firestoreApi.updateDoc(docRef, stamp(update));
}

export async function addOneTimeTaskInCloud(taskId, task, logEntry) {
    if (!firestoreApi || !docRef) return;
    const update = { [`oneTimeTasks.${taskId}`]: task };
    if (logEntry) update.changeLog = firestoreApi.arrayUnion(logEntry);
    await firestoreApi.updateDoc(docRef, stamp(update));
}

export async function updateOneTimeTaskInCloud(taskId, updates, event) {
    if (!firestoreApi || !docRef) return;
    const update = {};
    Object.keys(updates).forEach(k => {
        update[`oneTimeTasks.${taskId}.${k}`] = updates[k];
    });
    if (event) {
        update.events = event.add ? firestoreApi.arrayUnion(event.entry) : firestoreApi.arrayRemove(event.entry);
    }
    await firestoreApi.updateDoc(docRef, stamp(update));
}

export async function deleteOneTimeTaskInCloud(taskId, logEntry, removedEvent) {
    if (!firestoreApi || !docRef) return;
    const update = { [`oneTimeTasks.${taskId}`]: firestoreApi.deleteField() };
    if (logEntry) update.changeLog = firestoreApi.arrayUnion(logEntry);
    if (removedEvent) update.events = firestoreApi.arrayRemove(removedEvent);
    await firestoreApi.updateDoc(docRef, stamp(update));
}

export async function sendKudosToCloud(kudosEntry) {
    if (!firestoreApi || !docRef) return;
    const counterKey = kudosEntry.from === 'aditya' ? 'lifetime.kudosAditya' : 'lifetime.kudosChhaya';
    await firestoreApi.updateDoc(docRef, stamp({
        kudos: firestoreApi.arrayUnion(kudosEntry),
        [counterKey]: firestoreApi.increment(1)
    }));
}

export async function markKudosSeenInCloud(who, ts) {
    if (!firestoreApi || !docRef) return;
    await firestoreApi.updateDoc(docRef, stamp({ [`kudosSeen.${who}`]: ts }));
}

export async function saveAchievementsToCloud(achievements) {
    if (!firestoreApi || !docRef) return;
    const update = {};
    Object.keys(achievements).forEach(id => {
        update[`achievements.${id}`] = achievements[id];
    });
    await firestoreApi.updateDoc(docRef, stamp(update));
}

export async function resetCloudState() {
    if (!firestoreApi || !docRef) return;
    await firestoreApi.setDoc(docRef, fullDocPayload(buildDefaultState()));
}

export function teardown() {
    if (unsubscribe) unsubscribe();
}
