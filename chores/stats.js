import {
    connectFirebase, isFirebaseReady, loadLocalState,
    subscribeToSharedState, getSnapshotData, fetchHistoryRange,
    getMergedDefs, getDayKey, getWeekKeyFromDayKey, monthKeyOf,
    ACHIEVEMENT_DEFS, isAchievementEarned
} from './db.js';

// Fun and light — celebrate whoever's been carrying more, never dunk on
// the other. The imbalance is already felt in real life; no need to twist.
const VERDICT_QUOTES = {
    noData: [
        "no chores recorded yet — the cats are taking notes",
        "a quiet stretch for the broom",
        "fresh slate. the dust bunnies are nervous.",
        "nothing logged — too busy being in love, probably"
    ],
    balanced: [
        "perfectly balanced, as all things should be",
        "a true partnership 🤝",
        "50/50 — the dream is alive",
        "synchronized sweeping. olympic judges impressed.",
        "team household is thriving"
    ],
    adityaHeavy: [
        "aditya is on an absolute tear 🏆",
        "big stretch from aditya — high fives all around",
        "aditya's broom is warm. someone's earned the good snacks.",
        "aditya carried some extra weight lately 💪 team effort evens out"
    ],
    chhayaHeavy: [
        "chhaya is on an absolute tear 🏆",
        "big stretch from chhaya — high fives all around",
        "chhaya's been cooking *and* carrying it. legend.",
        "chhaya carried some extra weight lately 💪 team effort evens out"
    ]
};

const KUDOS_EMOJI_MAP = {
    star: '⭐', heart: '❤️', fire: '🔥',
    flex: '💪', sparkle: '✨', clap: '👏'
};

const ACHIEVEMENT_GROUPS = [
    ['daily', 'daily streaks'],
    ['weekly', 'weekly streaks'],
    ['monthly', 'golden months'],
    ['misc', 'one-offs']
];

let state = null;
let currentRange = 7;          // 7 | 30 | 90 | 0 (all)
let archiveCache = {};         // rangeKey -> merged day entries
let blobUrls = [];

const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const COLORS = {
    stroke: isDark ? '#fafaf9' : '#1c1917',
    bg: isDark ? '#1c1917' : '#ffffff',
    aditya: isDark ? '#93c5fd' : '#3b82f6',
    chhaya: isDark ? '#fda4af' : '#e11d48'
};

function formatDay(dayKey) {
    const parts = dayKey.split('-');
    return `${parseInt(parts[1])}/${parseInt(parts[2])}`;
}

function dayKeyDaysAgo(n) {
    return getDayKey(new Date(Date.now() - n * 86400000));
}

function clearCharts() {
    blobUrls.forEach(url => URL.revokeObjectURL(url));
    blobUrls = [];
    document.querySelectorAll('.chart-container').forEach(el => {
        el.innerHTML = '';
    });
}

// --- History assembly ---
// Short ranges come straight off the live doc; 90d/all merge in the
// archived days subcollection (fetched once per session per range).

function mergeHistories(archived, live) {
    const byDay = {};
    archived.forEach(h => { if (h && h.day) byDay[h.day] = h; });
    (live || []).forEach(h => { if (h && h.day) byDay[h.day] = h; });
    return Object.values(byDay).sort((a, b) => a.day < b.day ? -1 : 1);
}

async function getHistoryForRange(range) {
    const live = state.dailyHistory || [];
    if (range > 0 && range <= 35) {
        return live.slice(-range);
    }
    const cacheKey = String(range);
    if (!archiveCache[cacheKey]) {
        const from = range > 0 ? dayKeyDaysAgo(range) : null;
        const archived = isFirebaseReady() ? await fetchHistoryRange(from) : [];
        archiveCache[cacheKey] = archived;
    }
    const merged = mergeHistories(archiveCache[cacheKey], live);
    return range > 0 ? merged.filter(h => h.day >= dayKeyDaysAgo(range)) : merged;
}

// Long ranges aggregate to weeks so the charts stay legible.
function aggregateByWeek(history) {
    const buckets = {};
    history.forEach(h => {
        const wk = getWeekKeyFromDayKey(h.day);
        if (!buckets[wk]) buckets[wk] = { day: wk, done: 0, total: 0, points: 0, totalPoints: 0, adityaPoints: 0, chhayaPoints: 0 };
        const b = buckets[wk];
        b.done += h.done || 0;
        b.total += h.total || 0;
        b.points += h.points || 0;
        b.totalPoints += h.totalPoints || 0;
        b.adityaPoints += h.adityaPoints || 0;
        b.chhayaPoints += h.chhayaPoints || 0;
    });
    return Object.values(buckets).sort((a, b) => a.day < b.day ? -1 : 1);
}

function aggregateByMonth(history) {
    const buckets = {};
    history.forEach(h => {
        const mo = monthKeyOf(h.day);
        if (!buckets[mo]) buckets[mo] = { month: mo, adityaPoints: 0, chhayaPoints: 0, points: 0, totalPoints: 0 };
        const b = buckets[mo];
        b.adityaPoints += h.adityaPoints || 0;
        b.chhayaPoints += h.chhayaPoints || 0;
        b.points += h.points || 0;
        b.totalPoints += h.totalPoints || 0;
    });
    return Object.values(buckets).sort((a, b) => a.month < b.month ? -1 : 1);
}

function historyToCsvUrl(history) {
    const header = 'day,aditya,chhaya\n';
    const rows = history.map(h =>
        `${formatDay(h.day)},${(h.adityaPoints || 0).toFixed(2)},${(h.chhayaPoints || 0).toFixed(2)}`
    ).join('\n');
    const url = URL.createObjectURL(new Blob([header + rows], { type: 'text/csv' }));
    blobUrls.push(url);
    // rough-viz Line only treats URLs containing ".csv" as fetchable —
    // anything else makes its constructor throw. The fragment is inert.
    return url + '#.csv';
}

// --- Scoreboard ---

function renderFunStats(history) {
    document.querySelector('[data-stat="streak"]').textContent = state.streak || 0;
    document.querySelector('[data-stat="best-streak"]').textContent = state.bestStreak || 0;
    document.querySelector('[data-stat="weekly-streak"]').textContent = state.weeklyStreak || 0;
    document.querySelector('[data-stat="best-weekly-streak"]').textContent = state.bestWeeklyStreak || 0;
    document.querySelector('[data-stat="golden-months"]').textContent = state.goldenMonths || 0;

    const adityaPts = history.reduce((s, h) => s + (h.adityaPoints || 0), 0);
    const chhayaPts = history.reduce((s, h) => s + (h.chhayaPoints || 0), 0);
    const total = adityaPts + chhayaPts;

    let mvpText;
    let mvpDetail = '';
    let quotePool;

    if (total === 0) {
        mvpText = 'n/a';
        quotePool = VERDICT_QUOTES.noData;
    } else if (Math.round(adityaPts) === Math.round(chhayaPts)) {
        mvpText = 'tied!';
        mvpDetail = `(both at ${Math.round(adityaPts)} pts)`;
        quotePool = VERDICT_QUOTES.balanced;
    } else {
        const winner = adityaPts > chhayaPts ? 'aditya' : 'chhaya';
        const winPts = Math.round(Math.max(adityaPts, chhayaPts));
        const losePts = Math.round(Math.min(adityaPts, chhayaPts));
        mvpText = winner;
        mvpDetail = `(${winPts} pts, partner at ${losePts})`;
        const ratio = adityaPts / total;
        if (ratio >= 0.65) quotePool = VERDICT_QUOTES.adityaHeavy;
        else if (ratio <= 0.35) quotePool = VERDICT_QUOTES.chhayaHeavy;
        else quotePool = VERDICT_QUOTES.balanced;
    }

    document.querySelector('[data-stat="mvp"]').textContent = mvpText;
    document.querySelector('[data-stat="mvp-detail"]').textContent = mvpDetail;

    const quote = quotePool[Math.floor(Math.random() * quotePool.length)];
    document.querySelector('[data-stat="quote"]').textContent = `"${quote}"`;
}

// --- Charts ---

function renderLineChart(history) {
    if (history.length < 2) return;
    const csvUrl = historyToCsvUrl(history);
    new roughViz.Line({
        element: '#chart-line',
        data: csvUrl,
        y1: 'aditya',
        y2: 'chhaya',
        xLabel: currentRange > 35 || currentRange === 0 ? 'week' : 'day',
        yLabel: 'points',
        title: '',
        roughness: 1.5,
        circle: true,
        circleRadius: 5,
        circleRoughness: 1,
        colors: [COLORS.aditya, COLORS.chhaya],
        stroke: COLORS.stroke,
        strokeWidth: 1.5,
        font: 'Comic Neue',
        legend: true,
        legendPosition: 'right',
        interactive: true,
        backgroundColor: COLORS.bg,
        margin: { top: 50, right: 80, bottom: 70, left: 60 }
    });
}

function renderStackedBar(history) {
    if (history.length === 0) return;
    const data = history.map(h => ({
        day: formatDay(h.day),
        aditya: h.adityaPoints || 0,
        chhaya: h.chhayaPoints || 0
    }));
    new roughViz.StackedBar({
        element: '#chart-stacked',
        data,
        labels: 'day',
        title: '',
        roughness: 1.5,
        colors: [COLORS.aditya, COLORS.chhaya],
        stroke: COLORS.stroke,
        strokeWidth: 0.8,
        fillStyle: 'cross-hatch',
        fillWeight: 0.5,
        font: 'Comic Neue',
        interactive: true,
        backgroundColor: COLORS.bg,
        xLabel: currentRange > 35 || currentRange === 0 ? 'week' : 'day',
        yLabel: 'points',
        margin: { top: 50, right: 20, bottom: 70, left: 60 }
    });
}

function renderBarChart(history) {
    if (history.length === 0) return;
    const labels = history.map(h => formatDay(h.day));
    const values = history.map(h => {
        if (!h.totalPoints || h.totalPoints === 0) return 0;
        return Math.round((h.points / h.totalPoints) * 100);
    });
    new roughViz.Bar({
        element: '#chart-bar',
        data: { labels, values },
        title: '',
        roughness: 1.5,
        color: COLORS.aditya,
        stroke: COLORS.stroke,
        strokeWidth: 0.8,
        fillStyle: 'zigzag',
        fillWeight: 0.5,
        font: 'Comic Neue',
        interactive: true,
        backgroundColor: COLORS.bg,
        xLabel: currentRange > 35 || currentRange === 0 ? 'week' : 'day',
        yLabel: '% done',
        margin: { top: 50, right: 20, bottom: 70, left: 60 }
    });
}

function renderDonutChart(history) {
    const adityaPts = history.reduce((s, h) => s + (h.adityaPoints || 0), 0);
    const chhayaPts = history.reduce((s, h) => s + (h.chhayaPoints || 0), 0);
    if (adityaPts === 0 && chhayaPts === 0) return;
    new roughViz.Donut({
        element: '#chart-donut',
        data: {
            labels: [`aditya (${Math.round(adityaPts)} pts)`, `chhaya (${Math.round(chhayaPts)} pts)`],
            values: [adityaPts, chhayaPts]
        },
        title: '',
        roughness: 1.5,
        colors: [COLORS.aditya, COLORS.chhaya],
        stroke: COLORS.stroke,
        strokeWidth: 1,
        fillStyle: 'cross-hatch',
        fillWeight: 0.6,
        font: 'Comic Neue',
        interactive: true,
        backgroundColor: COLORS.bg,
        legend: true,
        legendPosition: 'right',
        margin: { top: 50, right: 20, bottom: 50, left: 20 }
    });
}

function renderMonthlyChart(history) {
    const section = document.getElementById('monthly-section');
    if (!section) return;
    const months = aggregateByMonth(history);
    const show = (currentRange === 0 || currentRange >= 90) && months.length >= 2;
    section.style.display = show ? '' : 'none';
    if (!show) return;
    const data = months.map(m => ({
        month: m.month.slice(2),
        aditya: m.adityaPoints,
        chhaya: m.chhayaPoints
    }));
    new roughViz.StackedBar({
        element: '#chart-monthly',
        data,
        labels: 'month',
        title: '',
        roughness: 1.5,
        colors: [COLORS.aditya, COLORS.chhaya],
        stroke: COLORS.stroke,
        strokeWidth: 0.8,
        fillStyle: 'cross-hatch',
        fillWeight: 0.5,
        font: 'Comic Neue',
        interactive: true,
        backgroundColor: COLORS.bg,
        xLabel: 'month',
        yLabel: 'points',
        margin: { top: 50, right: 20, bottom: 70, left: 60 }
    });
}

// --- Kudos feed ---

function taskNameFor(k) {
    if (k.taskName) return k.taskName;
    if (!k.taskId) return null;
    const defs = getMergedDefs(state);
    if (defs.allById[k.taskId]) return defs.allById[k.taskId].name;
    const ot = state.oneTimeTasks && state.oneTimeTasks[k.taskId];
    return ot ? ot.name : null;
}

function renderKudosFeed() {
    const container = document.getElementById('kudos-feed');
    if (!container || !state) return;
    const kudos = (state.kudos || []).slice().reverse().slice(0, 15);
    if (kudos.length === 0) {
        container.innerHTML = '<p class="no-data">no kudos yet — be the first!</p>';
        return;
    }
    container.innerHTML = '';
    kudos.forEach(k => {
        const item = document.createElement('div');
        item.className = 'kudos-feed-item';
        const emoji = KUDOS_EMOJI_MAP[k.emoji] || '⭐';
        const name = taskNameFor(k);
        const taskInfo = name ? ` for <em>${escapeHtml(name)}</em>` : '';
        item.innerHTML = `<span class="kudos-feed-emoji">${emoji}</span> <strong>${k.from}</strong> → <strong>${k.to}</strong>${taskInfo}`;
        container.appendChild(item);
    });

    const lifetime = state.lifetime || {};
    const adityaSent = Math.max(lifetime.kudosAditya || 0, (state.kudos || []).filter(k => k.from === 'aditya').length);
    const chhayaSent = Math.max(lifetime.kudosChhaya || 0, (state.kudos || []).filter(k => k.from === 'chhaya').length);
    const countEl = document.getElementById('kudos-counts');
    if (countEl) {
        countEl.textContent = `aditya sent ${adityaSent} · chhaya sent ${chhayaSent}`;
    }
}

function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
}

// --- Achievements ---

function renderAchievements() {
    const container = document.getElementById('achievements-grid');
    if (!container || !state) return;
    const earned = state.achievements || {};
    container.innerHTML = '';
    ACHIEVEMENT_GROUPS.forEach(([group, label]) => {
        const defs = ACHIEVEMENT_DEFS.filter(d => d.group === group);
        if (defs.length === 0) return;
        const heading = document.createElement('h3');
        heading.className = 'achievement-group-label';
        heading.textContent = label;
        container.appendChild(heading);
        const grid = document.createElement('div');
        grid.className = 'achievement-group-grid';
        defs.forEach(def => {
            const card = document.createElement('div');
            const earnedEntry = isAchievementEarned(earned, def);
            card.className = 'achievement-card' + (earnedEntry ? ' is-earned' : '');
            const detail = earnedEntry
                ? `<span class="achievement-date">${earnedEntry.earnedAt || ''}</span>`
                : `<span class="achievement-hint">${def.hint}</span>`;
            card.innerHTML = `<span class="achievement-icon">${def.icon}</span><span class="achievement-name">${def.name}</span>${detail}`;
            grid.appendChild(card);
        });
        container.appendChild(grid);
    });
}

// --- Change history ---

function renderChangeLog() {
    const container = document.getElementById('changelog-list');
    if (!container || !state) return;
    const log = (state.changeLog || []).slice().reverse().slice(0, 30);
    if (log.length === 0) {
        container.innerHTML = '<p class="no-data">no edits yet — the board is in its original form</p>';
        return;
    }
    container.innerHTML = '';
    log.forEach(c => {
        const row = document.createElement('div');
        row.className = 'changelog-row';
        const when = c.ts ? formatDay(getDayKey(new Date(c.ts))) : '';
        row.innerHTML = `<span class="changelog-when">${when}</span>`
            + `<span class="changelog-who">${c.who}</span>`
            + `<span class="changelog-detail">${escapeHtml(c.detail || c.action)}</span>`;
        container.appendChild(row);
    });
}

// --- Page assembly ---

let renderSeq = 0;

// One broken chart must not blank the rest of the page.
function safely(renderFn) {
    try { renderFn(); }
    catch (e) { console.error('Chart render failed:', e); }
}

async function renderAll() {
    if (!state) return;
    const seq = ++renderSeq;
    const rawHistory = await getHistoryForRange(currentRange);
    if (seq !== renderSeq) return; // a newer render superseded this one

    clearCharts();
    renderFunStats(rawHistory);
    renderKudosFeed();
    renderAchievements();
    renderChangeLog();

    if (rawHistory.length === 0) {
        document.querySelectorAll('.chart-desc').forEach(el => {
            if (!el.dataset.desc) el.dataset.desc = el.textContent;
            el.textContent = 'no data yet — check back after a few days!';
        });
        const monthly = document.getElementById('monthly-section');
        if (monthly) monthly.style.display = 'none';
        return;
    }

    // undo any "no data yet" left by an earlier empty render
    document.querySelectorAll('.chart-desc').forEach(el => {
        if (el.dataset.desc) el.textContent = el.dataset.desc;
    });

    const chartHistory = (currentRange === 0 || currentRange > 35)
        ? aggregateByWeek(rawHistory)
        : rawHistory;

    safely(() => renderLineChart(chartHistory));
    safely(() => renderStackedBar(chartHistory));
    safely(() => renderBarChart(chartHistory));
    safely(() => renderDonutChart(rawHistory));
    safely(() => renderMonthlyChart(rawHistory));
}

function setupRangeToggle() {
    const buttons = document.querySelectorAll('.range-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentRange = parseInt(btn.dataset.range, 10);
            renderAll();
        });
    });
}

async function init() {
    setupRangeToggle();
    // seed from the dashboard's local backup so the page works offline
    state = loadLocalState();
    renderAll();
    try {
        await connectFirebase();
    } catch {
        return;
    }
    if (!isFirebaseReady()) return;

    subscribeToSharedState(snapshot => {
        const data = getSnapshotData(snapshot);
        if (!data) return;
        state = data;
        renderAll();
    }, err => {
        console.error('Stats subscription error:', err);
    });
}

init();
