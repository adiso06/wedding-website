export const RESET_TIME_ZONE = "America/New_York";
export const STREAK_THRESHOLD = 0.65;
export const WEEKLY_STREAK_THRESHOLD = 0.50;
export const MONTHLY_THRESHOLD = 0.85;
export const MONTHLY_MIN_DAYS = 15;
export const HISTORY_CAP = 35;

type Actor = "aditya" | "chhaya" | "both";

interface TaskDef {
    id: string;
    name: string;
    points: number;
    owner: "aditya" | "chhaya";
    cadence: "daily" | "weekly";
    interval?: number;
    lastReset?: string;
    retired?: boolean;
    custom?: boolean;
}

interface ChoreEvent {
    id: string;
    taskId: string;
    name: string;
    pts: number;
    who: Actor;
    owner: "aditya" | "chhaya" | null;
    day: string;
    kind: "daily" | "weekly" | "extra" | "skip";
}

interface DayEntry {
    day: string;
    done: number;
    acts: number;
    total: number;
    points: number;
    totalPoints: number;
    adityaPoints: number;
    chhayaPoints: number;
    byKind: { daily: number; weekly: number; extra: number };
    travel?: true;
}

export interface ArchivedDay extends DayEntry {
    weekKey: string;
    events: ChoreEvent[];
}

export interface ResetResult {
    state: Record<string, any>;
    changed: boolean;
    archivedDays: ArchivedDay[];
}

const DEFAULT_TASK_DEFS: TaskDef[] = [
    { id: "a_cat1", name: "Feed cats", points: 1, owner: "aditya", cadence: "daily" },
    { id: "a_cat2", name: "Scoop litter", points: 1, owner: "aditya", cadence: "daily" },
    { id: "a_cat3", name: "Sweep cat hair", points: 1.33, owner: "aditya", cadence: "daily" },
    { id: "a1", name: "Tidy couch", points: 1, owner: "aditya", cadence: "daily" },
    { id: "a2", name: "Pick up socks", points: 1, owner: "aditya", cadence: "daily" },
    { id: "a3", name: "Take out trash", points: 1.67, owner: "aditya", cadence: "daily" },
    { id: "a4", name: "Wipe counters", points: 2, owner: "aditya", cadence: "daily" },
    { id: "a5", name: "Clean sink", points: 1, owner: "aditya", cadence: "daily" },
    { id: "a6", name: "Load dishwasher", points: 2, owner: "aditya", cadence: "daily" },
    { id: "a7", name: "Wash big dishes", points: 2, owner: "aditya", cadence: "daily" },
    { id: "a8", name: "Empty dishwasher", points: 1.33, owner: "aditya", cadence: "daily" },
    { id: "a10", name: "Wash sheets", points: 1.33, owner: "aditya", cadence: "weekly" },
    { id: "a11", name: "Sweep floors", points: 1.67, owner: "aditya", cadence: "weekly" },
    { id: "a12", name: "Clean fridge inside", points: 2, owner: "aditya", cadence: "weekly" },
    { id: "a13", name: "Wipe fridge outside", points: 1, owner: "aditya", cadence: "weekly" },
    { id: "a14", name: "Scrub tub", points: 2, owner: "aditya", cadence: "weekly" },
    { id: "a9", name: "Vacuum", points: 1.33, owner: "aditya", cadence: "weekly" },
    { id: "a15", name: "Mop floors", points: 2, owner: "aditya", cadence: "weekly" },
    { id: "a16", name: "Wash blanket", points: 1.33, owner: "aditya", cadence: "weekly" },
    { id: "a17", name: "Water plants", points: 1.33, owner: "aditya", cadence: "weekly" },
    { id: "a18", name: "Grocery run", points: 4, owner: "aditya", cadence: "weekly" },
    { id: "c1", name: "Coffee maker", points: 1, owner: "chhaya", cadence: "daily" },
    { id: "c2", name: "Cooking", points: 12, owner: "chhaya", cadence: "daily" },
    { id: "c3", name: "Wipe surfaces", points: 1, owner: "chhaya", cadence: "weekly" },
    { id: "c4", name: "Mats", points: 1, owner: "chhaya", cadence: "weekly" },
    { id: "c5", name: "Deep clean coffee maker", points: 1, owner: "chhaya", cadence: "weekly" },
    { id: "c6", name: "Clean ovens", points: 2, owner: "chhaya", cadence: "weekly" },
    { id: "c7", name: "Wipe floors, mirrors, sink", points: 2.67, owner: "chhaya", cadence: "weekly" },
    { id: "c8", name: "Wipe doors", points: 2, owner: "chhaya", cadence: "weekly" },
    { id: "c9", name: "Wash + vacuum carpets", points: 1.67, owner: "chhaya", cadence: "weekly" },
    { id: "c10", name: "Dust lamps", points: 2, owner: "chhaya", cadence: "weekly" },
    { id: "c11", name: "Clean shelves", points: 2, owner: "chhaya", cadence: "weekly" },
    { id: "c12", name: "Wipe mirror", points: 1, owner: "chhaya", cadence: "weekly" }
];

const DEFAULT_BY_ID = Object.fromEntries(DEFAULT_TASK_DEFS.map(def => [def.id, def]));

function getMergedDefs(state: Record<string, any>): { list: TaskDef[]; byId: Record<string, TaskDef> } {
    const overrides = state.taskDefs && typeof state.taskDefs === "object" ? state.taskDefs : {};
    const list: TaskDef[] = [];
    DEFAULT_TASK_DEFS.forEach(def => {
        const merged = { ...def, ...(overrides[def.id] || {}) } as TaskDef;
        if (!merged.retired) list.push(merged);
    });
    Object.entries(overrides).forEach(([id, value]) => {
        if (DEFAULT_BY_ID[id] || !value || typeof value !== "object") return;
        const raw = value as Record<string, any>;
        if (typeof raw.name !== "string" || (raw.owner !== "aditya" && raw.owner !== "chhaya")) return;
        if (raw.retired === true) return;
        list.push({
            id,
            name: raw.name,
            points: Number.isFinite(raw.points) && raw.points > 0 ? raw.points : 2,
            owner: raw.owner,
            cadence: raw.cadence === "weekly" ? "weekly" : "daily",
            interval: Number.isFinite(raw.interval) ? Math.round(raw.interval) : undefined,
            lastReset: typeof raw.lastReset === "string" ? raw.lastReset : undefined,
            custom: true
        });
    });
    return { list, byId: Object.fromEntries(list.map(def => [def.id, def])) };
}

function formatDateKey(year: number, month: number, day: number): string {
    return [year, month, day].map((value, i) => String(value).padStart(i === 0 ? 4 : 2, "0")).join("-");
}

function getTimeZoneDateParts(date: Date): { year: number; month: number; day: number } {
    const values: Record<string, string> = {};
    new Intl.DateTimeFormat("en-CA", {
        timeZone: RESET_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(date).forEach(part => {
        if (part.type !== "literal") values[part.type] = part.value;
    });
    return { year: Number(values.year), month: Number(values.month), day: Number(values.day) };
}

export function getDayKey(date: Date = new Date()): string {
    const { year, month, day } = getTimeZoneDateParts(date);
    return formatDateKey(year, month, day);
}

export function addDaysToDayKey(dayKey: string, n: number): string {
    const [year, month, day] = dayKey.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day + n, 12));
    return formatDateKey(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

function daysBetween(fromKey: string, toKey: string): number {
    const [y1, m1, d1] = fromKey.split("-").map(Number);
    const [y2, m2, d2] = toKey.split("-").map(Number);
    return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}

function getWeekKeyFromDayKey(dayKey: string): string {
    const [year, month, day] = dayKey.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day, 12));
    date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
    return formatDateKey(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

export function getWeekKey(date: Date = new Date()): string {
    return getWeekKeyFromDayKey(getDayKey(date));
}

function weeksApart(later: string, earlier: string): number {
    return Math.round(daysBetween(earlier, later) / 7);
}

function monthKeyOf(dayKey: string): string {
    return /^\d{4}-\d{2}-\d{2}$/.test(dayKey) ? dayKey.slice(0, 7) : "";
}

function defaultIntervalFor(def: TaskDef): number {
    return def.cadence === "weekly" ? 7 : 1;
}

function hasCustomInterval(def: TaskDef): boolean {
    return Number.isFinite(def.interval) && def.interval !== defaultIntervalFor(def);
}

function defaultCycleIds(defs: { list: TaskDef[] }, cadence: "daily" | "weekly"): string[] {
    return defs.list.filter(def => def.cadence === cadence && !hasCustomInterval(def)).map(def => def.id);
}

function pointsFor(defs: { byId: Record<string, TaskDef> }, ids: string[]): number {
    return ids.reduce((sum, id) => sum + (defs.byId[id]?.points || 0), 0);
}

function pointsForChecked(
    defs: { byId: Record<string, TaskDef> },
    ids: string[],
    tasks: Record<string, boolean>
): number {
    return pointsFor(defs, ids.filter(id => tasks[id]));
}

function sumEventPts(events: ChoreEvent[], who?: "aditya" | "chhaya"): number {
    return events.reduce((sum, event) => {
        if (!who || event.who === who) return sum + (event.pts || 0);
        if (event.who === "both") return sum + (event.pts || 0) / 2;
        return sum;
    }, 0);
}

function aggregateDayEntry(
    defs: { list: TaskDef[]; byId: Record<string, TaskDef> },
    dayKey: string,
    events: ChoreEvent[]
): DayEntry {
    const dayEvents = events.filter(event => event.day === dayKey);
    const dailyIds = new Set(defaultCycleIds(defs, "daily"));
    const actsByTask = new Map<string, ChoreEvent>();
    dayEvents.forEach(event => {
        if (event.kind !== "skip") actsByTask.set(event.taskId, event);
    });
    const acts = [...actsByTask.values()];
    const cycleDaily = acts.filter(event => event.kind === "daily" && dailyIds.has(event.taskId));
    const completedIds = new Set(cycleDaily.map(event => event.taskId));
    const skippedIds = new Set(dayEvents
        .filter(event => event.kind === "skip" && dailyIds.has(event.taskId) && !completedIds.has(event.taskId))
        .map(event => event.taskId));
    const countedIds = [...dailyIds].filter(id => !skippedIds.has(id));
    const byKind = { daily: 0, weekly: 0, extra: 0 };
    acts.forEach(event => {
        const kind = event.kind === "daily" || event.kind === "weekly" ? event.kind : "extra";
        byKind[kind] += event.pts || 0;
    });
    return {
        day: dayKey,
        done: cycleDaily.length,
        acts: acts.length,
        total: countedIds.length,
        points: sumEventPts(cycleDaily),
        totalPoints: pointsFor(defs, countedIds),
        adityaPoints: sumEventPts(acts, "aditya"),
        chhayaPoints: sumEventPts(acts, "chhaya"),
        byKind
    };
}

function normalizeEvents(raw: unknown): ChoreEvent[] {
    if (!Array.isArray(raw)) return [];
    return raw.filter(event => event && typeof event === "object")
        .map(event => event as ChoreEvent)
        .filter(event => typeof event.taskId === "string" && typeof event.day === "string"
            && Number.isFinite(event.pts) && event.kind !== undefined);
}

export function applyResetRules(source: Record<string, any>, date: Date = new Date()): ResetResult {
    const next: Record<string, any> = {
        ...source,
        taskDefs: { ...(source.taskDefs || {}) },
        tasks: { ...(source.tasks || {}) },
        taskActor: { ...(source.taskActor || {}) },
        taskSkips: { ...(source.taskSkips || {}) },
        oneTimeTasks: Object.fromEntries(Object.entries(source.oneTimeTasks || {})
            .map(([id, task]) => [id, { ...(task as Record<string, any>) }])),
        events: normalizeEvents(source.events),
        lifetime: {
            tasks: 0,
            adityaPoints: 0,
            chhayaPoints: 0,
            crossHelps: 0,
            kudosAditya: 0,
            kudosChhaya: 0,
            ...(source.lifetime || {})
        },
        dailyHistory: Array.isArray(source.dailyHistory)
            ? source.dailyHistory.map((entry: Record<string, any>) => ({ ...entry }))
            : []
    };
    const defs = getMergedDefs(next);
    const todayKey = getDayKey(date);
    const weekKey = getWeekKey(date);
    const lastDailyReset = typeof next.lastDailyReset === "string" ? next.lastDailyReset : todayKey;
    const lastWeeklyReset = typeof next.lastWeeklyReset === "string" ? next.lastWeeklyReset : weekKey;
    const cycleDailyIds = defaultCycleIds(defs, "daily");
    const cycleWeeklyIds = defaultCycleIds(defs, "weekly");
    const archivedDays: ArchivedDay[] = [];
    let changed = false;

    const travel = next.travel && typeof next.travel === "object" ? next.travel : {};
    const travelNow = Boolean(travel.aditya || travel.chhaya);
    const travelEnd = travelNow ? todayKey : (next.lastTravelDay || "");
    const isTravelDay = (day: string): boolean => Boolean(next.travelSince && travelEnd
        && day >= next.travelSince && day <= travelEnd);

    if (lastDailyReset !== todayKey) {
        const elapsedDays = daysBetween(lastDailyReset, todayKey);
        const rolloverDays: string[] = [];
        if (Number.isFinite(elapsedDays) && elapsedDays > 0) {
            for (let i = 0; i < elapsedDays; i++) rolloverDays.push(addDaysToDayKey(lastDailyReset, i));
        }
        const historyDays = new Set(next.dailyHistory.map((entry: DayEntry) => entry.day));
        const daysToClose = new Set(rolloverDays);
        next.events.forEach((event: ChoreEvent) => {
            if (event.day < todayKey) daysToClose.add(event.day);
        });

        [...daysToClose].filter(day => day && day < todayKey && !historyDays.has(day)).sort().forEach(day => {
            const entry = aggregateDayEntry(defs, day, next.events);
            if (isTravelDay(day)) entry.travel = true;
            next.dailyHistory.push(entry);
            const unique = new Map<string, ChoreEvent>();
            next.events.filter((event: ChoreEvent) => event.day === day).forEach((event: ChoreEvent) => {
                unique.set(`${event.taskId}:${event.kind === "skip" ? "skip" : "completion"}`, event);
            });
            const events = [...unique.values()];
            archivedDays.push({ ...entry, weekKey: getWeekKeyFromDayKey(day), events });
            const acts = events.filter(event => event.kind !== "skip");
            next.lifetime.tasks += acts.length;
            next.lifetime.adityaPoints += entry.adityaPoints;
            next.lifetime.chhayaPoints += entry.chhayaPoints;
            next.lifetime.crossHelps += acts.filter(event => event.owner && event.who !== event.owner).length;
        });
        next.dailyHistory.sort((a: DayEntry, b: DayEntry) => a.day < b.day ? -1 : 1);
        if (next.dailyHistory.length > HISTORY_CAP) next.dailyHistory = next.dailyHistory.slice(-HISTORY_CAP);

        rolloverDays.forEach(day => {
            if (isTravelDay(day)) return;
            const closing = next.dailyHistory.find((entry: DayEntry) => entry.day === day)
                || aggregateDayEntry(defs, day, next.events);
            const qualifies = closing.total > 0 && closing.done / closing.total >= STREAK_THRESHOLD
                && closing.adityaPoints > 0 && closing.chhayaPoints > 0;
            if (qualifies) {
                next.streak = (next.streak || 0) + 1;
                next.bestStreak = Math.max(next.bestStreak || 0, next.streak);
            } else {
                const shieldWeek = getWeekKeyFromDayKey(day);
                if ((next.streak || 0) > 0 && next.streakShieldWeek !== shieldWeek) {
                    next.streakShieldWeek = shieldWeek;
                } else {
                    next.streak = 0;
                }
            }
        });

        const closedMonth = monthKeyOf(lastDailyReset);
        if (closedMonth && closedMonth !== monthKeyOf(todayKey) && closedMonth !== next.lastMonthProcessed) {
            const entries = next.dailyHistory.filter((entry: DayEntry) =>
                monthKeyOf(entry.day) === closedMonth && entry.totalPoints > 0 && !entry.travel);
            if (entries.length >= MONTHLY_MIN_DAYS) {
                const average = entries.reduce((sum: number, entry: DayEntry) =>
                    sum + entry.points / entry.totalPoints, 0) / entries.length;
                if (average >= MONTHLY_THRESHOLD) next.goldenMonths = (next.goldenMonths || 0) + 1;
            }
            next.lastMonthProcessed = closedMonth;
        }

        cycleDailyIds.forEach(id => {
            next.tasks[id] = false;
            delete next.taskActor[id];
            delete next.taskSkips[id];
        });
        next.lastDailyReset = todayKey;
        changed = true;
    }

    if (lastWeeklyReset !== weekKey) {
        const travelWeek = Boolean(next.travelSince && travelEnd
            && next.travelSince < weekKey && travelEnd >= lastWeeklyReset);
        if (!travelWeek) {
            const countedIds = cycleWeeklyIds.filter(id => !next.taskSkips[id]);
            const total = pointsFor(defs, countedIds);
            const done = pointsForChecked(defs, countedIds, next.tasks);
            const weekEvents = next.events.filter((event: ChoreEvent) =>
                event.day >= lastWeeklyReset && event.day < weekKey && event.kind !== "skip");
            const acted = (who: "aditya" | "chhaya"): boolean =>
                weekEvents.some((event: ChoreEvent) => event.who === who || event.who === "both");
            const earned = weeksApart(weekKey, lastWeeklyReset) === 1
                && total > 0 && done / total >= WEEKLY_STREAK_THRESHOLD
                && acted("aditya") && acted("chhaya");
            next.weeklyStreak = earned ? (next.weeklyStreak || 0) + 1 : 0;
            if (earned) next.bestWeeklyStreak = Math.max(next.bestWeeklyStreak || 0, next.weeklyStreak);
        }
        cycleWeeklyIds.forEach(id => {
            next.tasks[id] = false;
            delete next.taskActor[id];
            delete next.taskSkips[id];
        });
        next.lastWeeklyReset = weekKey;
        next.events = next.events.filter((event: ChoreEvent) => event.day >= weekKey);
        changed = true;
    }

    defs.list.forEach(def => {
        if (!hasCustomInterval(def) || !def.interval) return;
        const lastReset = def.lastReset || lastDailyReset;
        if (daysBetween(lastReset, todayKey) >= def.interval) {
            next.tasks[def.id] = false;
            delete next.taskActor[def.id];
            delete next.taskSkips[def.id];
            next.taskDefs[def.id] = { ...(next.taskDefs[def.id] || {}), lastReset: todayKey };
            changed = true;
        }
    });

    Object.entries(next.oneTimeTasks).forEach(([id, value]) => {
        const task = value as Record<string, any>;
        const doneDay = task.completedAt || task.createdAt;
        if (task.done && doneDay && daysBetween(doneDay, todayKey) >= 1) {
            delete next.oneTimeTasks[id];
            changed = true;
        }
    });

    if (travelNow && next.lastTravelDay !== todayKey) {
        next.lastTravelDay = todayKey;
        if (!next.travelSince) next.travelSince = todayKey;
        changed = true;
    }

    return { state: next, changed, archivedDays };
}
