import {
    LOCAL_STORAGE_KEY, ACTIVE_USER_KEY, COLLAPSED_SECTIONS_KEY, RESET_INFO,
    KUDOS_CAP, USERS, DEFAULT_TASK_DEFS, ACHIEVEMENT_DEFS,
    getMergedDefs, defaultIntervalFor, hasCustomInterval, dailyIdsOf, weeklyIdsOf,
    pointsToBadge, getDayKey, getWeekKey, getWeekKeyFromDayKey, formatDateKey, fmtPts,
    pointsFor, pointsForChecked, countChecked,
    buildEvent, findEventForTask, removeCompletion,
    buildBackfill, buildRetroUncheck, mergeHistoryEntry,
    backfillCompletionInCloud, retroUncheckInCloud,
    travelActive, isTaskPausedForTravel, filterTravelPaused, updateTravelInCloud,
    buildDefaultState, normalizeState, applyResetRules,
    saveLocalState, loadLocalState,
    computeWeightedLoad, getLoadStage, getLighterPose,
    checkAchievements,
    connectFirebase, isFirebaseReady, syncResetsToCloud, updateTaskInCloud,
    updateTaskDefInCloud, addOneTimeTaskInCloud, updateOneTimeTaskInCloud,
    deleteOneTimeTaskInCloud, sendKudosToCloud, markKudosSeenInCloud,
    saveAchievementsToCloud, archiveDayToSubcollection, fetchArchivedDay,
    subscribeToSharedState, getSnapshotData, teardown, resetCloudState
} from './db.js';

const statusStrip = document.querySelector('.status-strip');
const syncStatus = document.getElementById('sync-status');

const DEFAULTS_BY_ID = Object.fromEntries(DEFAULT_TASK_DEFS.map(d => [d.id, d]));

let state = null;
let resetInterval = null;

// --- Stick-figure rig + director ---
// One jointed SVG per figure; poses are CSS custom-property sets on the
// figure element (see styles.css). All movement goes through walkTo() so
// leg cycles, bobbing and travel stay in sync.

const STAGE_POSE = ['standing', 'light', 'medium', 'heavy', 'crushed'];
const BLOCK_ROWS = {
    0: [],
    1: ['░░'],
    2: ['▒▒', '░░'],
    3: ['▓▓▓', '▒▒▒', '░░░'],
    4: ['███', '▓▓▓', '▒▒▒', '░░░', '░░░']
};

const WALK_CYCLE_MS = 900;   // must match walk-legs duration in styles.css
const WALK_STRIDE_PX = 24;   // travel per cycle so feet don't skate

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const reducedMotion = () => prefersReducedMotion.matches;

function buildRigSvg(who) {
    const hair = who === 'chhaya'
        ? '<path class="rig-hair" d="M15.5,8.6 Q14.5,3.6 20,4 Q25.5,3.6 24.5,8.6" fill="none"/>'
          + '<g class="rig-hair-tail"><path d="M24,11.5 Q28.5,14 27.5,21" fill="none"/></g>'
        : '';
    return '<svg viewBox="0 0 40 60" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'
        + '<g class="rig">'
        + '<g class="rig-leg-left"><line x1="20" y1="36" x2="17" y2="47"/><g class="rig-shin-left"><line x1="17" y1="47" x2="15" y2="58"/><line x1="15" y1="58" x2="12.6" y2="58.4"/></g></g>'
        + '<g class="rig-leg-right"><line x1="20" y1="36" x2="23" y2="47"/><g class="rig-shin-right"><line x1="23" y1="47" x2="25" y2="58"/><line x1="25" y1="58" x2="27.4" y2="58.4"/></g></g>'
        + '<g class="rig-torso">'
        + '<line x1="20" y1="14.5" x2="20" y2="36"/>'
        + '<g class="rig-arm-left"><line x1="20" y1="18" x2="16.5" y2="25"/><g class="rig-fore-left"><line x1="16.5" y1="25" x2="14" y2="32"/>'
        + '<g class="rig-prop rig-prop-broom" stroke-width="1.1"><line x1="15.2" y1="23.5" x2="11.4" y2="50"/><path d="M8,50 Q11.5,56 15,50" fill="none"/><line x1="9.6" y1="50.6" x2="9" y2="53.4"/><line x1="11.6" y1="51.2" x2="11.4" y2="54.4"/><line x1="13.4" y1="50.8" x2="13.8" y2="53.6"/></g>'
        + '</g></g>'
        + '<g class="rig-arm-right"><line x1="20" y1="18" x2="23.5" y2="25"/><g class="rig-fore-right"><line x1="23.5" y1="25" x2="26" y2="32"/>'
        + '<g class="rig-hand-right">'
        + '<g class="rig-prop rig-prop-coffee" stroke-width="1.1"><rect x="23.6" y="27.2" width="5" height="5.4" rx="0.8"/><path d="M28.6,28.4 Q30.8,28.4 30.8,30 Q30.8,31.6 28.6,31.6" fill="none"/><path class="idle-steam" d="M25,25.6 Q24.5,23.8 25.5,22.4"/><path class="idle-steam idle-steam-2" d="M27.2,25.6 Q26.7,23.8 27.7,22.4"/></g>'
        + '<g class="rig-prop rig-prop-phone" stroke-width="1"><rect x="23.7" y="24.6" width="4.6" height="7.6" rx="0.9"/><rect x="24.6" y="26" width="2.8" height="3.6" rx="0.3" opacity="0.45"/></g>'
        + '</g></g></g>'
        + '<g class="rig-head">'
        + '<circle cx="20" cy="10" r="4.5"/>'
        + '<g class="rig-eyes" fill="currentColor" stroke="none"><circle cx="18.4" cy="9.4" r="0.6"/><circle cx="21.6" cy="9.4" r="0.6"/></g>'
        + hair
        + '</g>'
        + '</g>'
        + '</g>'
        + '</svg>';
}

const DESK_SVG = '<svg viewBox="0 0 52 30" preserveAspectRatio="xMidYMax meet" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="14" x2="48" y2="14"/><line x1="8" y1="14" x2="8" y2="29"/><line x1="44" y1="14" x2="44" y2="29"/><rect class="idle-screen" x="16" y="2" width="14" height="10" rx="1"/><line x1="23" y1="12" x2="23" y2="14"/><line x1="19" y1="14" x2="27" y2="14"/></svg>';

const BEACH_SVG = '<svg viewBox="0 0 52 38" preserveAspectRatio="xMidYMax meet" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><g class="beach-umbrella"><line x1="40" y1="36" x2="40" y2="9"/><path d="M29,12.5 Q40,2 51,12.5" /><line x1="40" y1="5" x2="40" y2="2.6"/></g><g class="beach-chair"><line x1="9" y1="35" x2="15" y2="22"/><line x1="13" y1="27" x2="34" y2="27"/><line x1="33" y1="27" x2="33" y2="36"/><line x1="11" y1="31" x2="12.5" y2="36"/></g></svg>';

const CARRIED_IDLES = ['sweep', 'coffee', 'phone'];

const figures = {};
let sceneLock = false;
let coupleTimer = null;
let heartsEl = null;

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function rand(min, max) {
    return min + Math.random() * (max - min);
}

// Diorama scale factor set by --fig-scale in CSS (body width is 48px at 1x)
function figScale() {
    const body = figures.aditya && figures.aditya.body;
    return body && body.clientWidth ? Math.max(0.5, body.clientWidth / 48) : 1;
}

function setStatus(message, tone = 'default') {
    syncStatus.textContent = message;
    statusStrip.classList.remove('is-error', 'is-warning');
    if (tone === 'error') statusStrip.classList.add('is-error');
    else if (tone === 'warning') statusStrip.classList.add('is-warning');
}

// --- Locomotion ---

function setFigureX(fig, x) {
    fig.x = x;
    fig.el.style.transform = `translateX(${x}px)`;
}

function cancelWalk(fig) {
    if (!fig.walkAnim) return;
    let currentX = fig.x;
    try {
        const m = new DOMMatrixReadOnly(getComputedStyle(fig.el).transform);
        currentX = m.m41;
    } catch { /* keep last known x */ }
    fig.walkAnim.cancel();
    fig.walkAnim = null;
    setFigureX(fig, currentX);
    fig.el.classList.remove('is-walking', 'walk-left', 'walk-right');
}

function walkTo(fig, targetX, opts = {}) {
    cancelWalk(fig);
    const dist = Math.abs(targetX - fig.x);
    if (reducedMotion() || dist < 3) {
        setFigureX(fig, targetX);
        return Promise.resolve();
    }
    const cycles = Math.max(1, Math.round(dist / (WALK_STRIDE_PX * figScale())));
    const duration = cycles * WALK_CYCLE_MS * (opts.slow ? 1.3 : 1);
    fig.el.classList.add('is-walking');
    fig.el.classList.toggle('walk-left', targetX < fig.x);
    fig.el.classList.toggle('walk-right', targetX > fig.x);
    return new Promise(resolve => {
        const anim = fig.el.animate(
            [{ transform: `translateX(${fig.x}px)` }, { transform: `translateX(${targetX}px)` }],
            { duration, easing: 'linear', fill: 'forwards' }
        );
        fig.walkAnim = anim;
        anim.onfinish = () => {
            fig.walkAnim = null;
            setFigureX(fig, targetX);
            try { anim.cancel(); } catch { /* already gone */ }
            fig.el.classList.remove('is-walking', 'walk-left', 'walk-right');
            resolve();
        };
        anim.oncancel = () => resolve();
    });
}

function randomWander(scale = 1) {
    const container = document.querySelector('.load-balance');
    const span = Math.min(36 * figScale(), (container ? container.clientWidth : 320) * 0.09) * scale;
    return rand(-span, span);
}

// --- Scene props (desk / beach) ---

function sceneEl(fig) {
    const side = fig.who === 'aditya' ? 'left' : 'right';
    return document.querySelector(`.scene-desk[data-side="${side}"]`);
}

function showScene(fig, kind) {
    const el = sceneEl(fig);
    if (!el) return;
    el.innerHTML = kind === 'desk' ? DESK_SVG : BEACH_SVG;
    el.dataset.scene = kind;
    el.classList.add('is-active');
}

function hideScene(fig) {
    const el = sceneEl(fig);
    if (!el) return;
    el.classList.remove('is-active');
    delete el.dataset.scene;
}

function sceneTargetX(fig) {
    const el = sceneEl(fig);
    if (!el) return 0;
    const s = el.getBoundingClientRect();
    const f = fig.el.getBoundingClientRect();
    return fig.x + (s.left + s.width / 2) - (f.left + f.width / 2);
}

// --- Idle director: each figure wanders, sweeps, sips, types, waves ---

function clearIdle(fig) {
    if (fig.el.dataset.idle === 'desk') hideScene(fig);
    delete fig.el.dataset.idle;
}

function gestureWave(fig) {
    fig.el.classList.remove('gesture-wave');
    void fig.el.offsetWidth;
    fig.el.classList.add('gesture-wave');
    setTimeout(() => fig.el.classList.remove('gesture-wave'), 2300);
}

async function directorTick(fig) {
    if (sceneLock || fig.walkAnim) return rand(4000, 7000);
    const pose = fig.pose || 'standing';
    if (pose === 'crushed' || pose === 'lounge' || pose === 'beach') {
        clearIdle(fig);
        return rand(8000, 14000);
    }
    if (pose !== 'standing') {
        // pacing under load
        if (Math.random() < 0.55) {
            await walkTo(fig, randomWander(pose === 'heavy' ? 0.35 : 0.8), { slow: pose !== 'light' });
        }
        return rand(7000, 13000);
    }
    const roll = Math.random();
    if (roll < 0.28) {
        clearIdle(fig);
        await walkTo(fig, randomWander(1));
    } else if (roll < 0.4) {
        clearIdle(fig);
    } else if (roll < 0.48) {
        clearIdle(fig);
        gestureWave(fig);
    } else if (roll < 0.76) {
        const id = CARRIED_IDLES[Math.floor(Math.random() * CARRIED_IDLES.length)];
        if (fig.el.dataset.idle === 'desk') hideScene(fig);
        fig.el.dataset.idle = id;
        if (Math.random() < 0.5) await walkTo(fig, randomWander(0.7), { slow: true });
    } else {
        clearIdle(fig);
        await walkTo(fig, sceneTargetX(fig), { slow: true });
        if (!sceneLock && fig.pose === 'standing') {
            showScene(fig, 'desk');
            fig.el.dataset.idle = 'desk';
        }
        return rand(12000, 22000);
    }
    return rand(9000, 18000);
}

function startDirector(fig) {
    if (reducedMotion()) return;
    const loop = async () => {
        let next = 8000;
        try { next = await directorTick(fig); } catch { /* keep looping */ }
        fig.idleTimer = setTimeout(loop, next);
    };
    fig.idleTimer = setTimeout(loop, rand(4000, 9000));
}

// --- Hearts ---

function burstHearts(count) {
    if (!heartsEl || reducedMotion()) return;
    let used = 0;
    for (const heart of heartsEl.children) {
        if (used >= count) break;
        if (heart.classList.contains('is-burst')) continue;
        used += 1;
        const side = used % 2 ? 1 : -1;
        heart.style.setProperty('--hx', (side * rand(4, 22) * figScale()).toFixed(1) + 'px');
        heart.style.setProperty('--hr', (side * -rand(6, 20)).toFixed(1) + 'deg');
        heart.style.animationDelay = ((used - 1) * 150) + 'ms';
        heart.classList.add('is-burst');
        setTimeout(() => heart.classList.remove('is-burst'), 1750 + used * 150);
    }
}

// --- Couple beats ---

function meetTargets(gap) {
    const container = document.querySelector('.load-balance');
    const rest = parseFloat(getComputedStyle(container).getPropertyValue('--figure-rest')) || 40;
    const offset = Math.max(0, rest - (gap * figScale()) / 2);
    return { aditya: offset, chhaya: -offset };
}

function scheduleCouple() {
    if (reducedMotion()) return;
    coupleTimer = setTimeout(coupleBeat, rand(16000, 34000));
}

async function coupleBeat() {
    const container = document.querySelector('.load-balance');
    const a = figures.aditya;
    const c = figures.chhaya;
    const bothFree = container && a && c && !sceneLock
        && container.dataset.stageAditya === '0' && container.dataset.stageChhaya === '0'
        && a.pose === 'standing' && c.pose === 'standing';
    if (!bothFree) {
        scheduleCouple();
        return;
    }
    sceneLock = true;
    clearIdle(a);
    clearIdle(c);
    const t = meetTargets(26);
    await Promise.all([walkTo(a, t.aditya), walkTo(c, t.chhaya)]);
    container.classList.add('is-couple');
    burstHearts(Math.random() < 0.45 ? 2 : 1);
    await wait(rand(3400, 5200));
    if (Math.random() < 0.35) {
        container.classList.add('is-kissing');
        burstHearts(3);
        await wait(1900);
        container.classList.remove('is-kissing');
        await wait(420);
    }
    container.classList.remove('is-couple');
    await Promise.all([walkTo(a, randomWander(0.3)), walkTo(c, randomWander(0.3))]);
    sceneLock = false;
    scheduleCouple();
}

function pokeCrushed(fig) {
    burstHearts(1);
    if (!fig.blocks) return;
    fig.blocks.querySelectorAll('.block-row').forEach((row, i) => {
        row.classList.remove('is-jiggle');
        void row.offsetWidth;
        row.style.animationDelay = (i * 40) + 'ms';
        row.classList.add('is-jiggle');
        setTimeout(() => row.classList.remove('is-jiggle'), 900 + i * 40);
    });
}

async function triggerAffectionBeat() {
    const container = document.querySelector('.load-balance');
    const a = figures.aditya;
    const c = figures.chhaya;
    if (!container || !a || !c || sceneLock || reducedMotion()) return;
    if (a.pose === 'crushed' || c.pose === 'crushed') {
        pokeCrushed(a.pose === 'crushed' ? a : c);
        return;
    }
    if (a.pose === 'lounge' || a.pose === 'beach' || c.pose === 'lounge' || c.pose === 'beach') {
        burstHearts(2);
        return;
    }
    sceneLock = true;
    clearIdle(a);
    clearIdle(c);
    cancelWalk(a);
    cancelWalk(c);
    container.classList.add('is-anticipating');
    await wait(380);
    container.classList.remove('is-anticipating');
    const t = meetTargets(18);
    await Promise.all([walkTo(a, t.aditya), walkTo(c, t.chhaya)]);
    container.classList.add('is-kissing');
    burstHearts(4);
    await wait(2100);
    container.classList.remove('is-kissing');
    await wait(420);
    await Promise.all([walkTo(a, 0), walkTo(c, 0)]);
    a.el.classList.add('is-happy');
    c.el.classList.add('is-happy');
    await wait(1000);
    a.el.classList.remove('is-happy');
    c.el.classList.remove('is-happy');
    sceneLock = false;
}

// --- Check-off celebration ---

function celebrateCheck(who) {
    if (who === 'both') {
        celebrateCheck('aditya');
        celebrateCheck('chhaya');
        return;
    }
    const fig = figures[who];
    if (!fig || reducedMotion() || sceneLock || fig.walkAnim) return;
    const pose = fig.pose || 'standing';
    if (pose === 'crushed' || pose === 'lounge' || pose === 'beach') return;
    fig.el.classList.remove('is-celebrating');
    void fig.el.offsetWidth;
    fig.el.classList.add('is-celebrating');
    clearTimeout(fig.celebrateTimer);
    fig.celebrateTimer = setTimeout(() => fig.el.classList.remove('is-celebrating'), 1200);
}

// --- Pose + block-stack rendering ---

function applyPose(fig, pose) {
    if (fig.pose === pose) return;
    const prev = fig.pose;
    fig.pose = pose;
    fig.poseSeq += 1;
    const seq = fig.poseSeq;
    clearIdle(fig);

    (async () => {
        if (prev === 'beach') {
            fig.el.dataset.pose = 'standing';
            hideScene(fig);
            await wait(600);
            if (fig.poseSeq !== seq) return;
            await walkTo(fig, randomWander(0.4));
            if (fig.poseSeq !== seq) return;
        }
        if (pose === 'beach') {
            fig.el.dataset.pose = 'standing';
            await wait(80);
            if (fig.poseSeq !== seq) return;
            const chairBias = (fig.who === 'aditya' ? -4.5 : 4.5) * figScale();
            await walkTo(fig, sceneTargetX(fig) + chairBias, { slow: true });
            if (fig.poseSeq !== seq) return;
            showScene(fig, 'beach');
            fig.el.dataset.pose = 'beach';
        } else if (pose === 'crushed') {
            cancelWalk(fig);
            fig.el.dataset.pose = 'crushed';
        } else {
            fig.el.dataset.pose = pose;
        }
    })();
}

function renderBlocks(fig, stage) {
    const el = fig.blocks;
    if (!el || stage === fig.blockStage) return;
    fig.blockStage = stage;
    const target = BLOCK_ROWS[stage] || [];
    if (reducedMotion()) {
        el.innerHTML = '';
        target.forEach(text => {
            const row = document.createElement('span');
            row.className = 'block-row';
            row.textContent = text;
            el.appendChild(row);
        });
        return;
    }
    const rows = Array.from(el.children).filter(r => !r.classList.contains('is-pop'));
    if (target.length >= rows.length) {
        rows.forEach((row, i) => {
            row.textContent = target[target.length - rows.length + i];
        });
        const newCount = target.length - rows.length;
        for (let i = newCount - 1; i >= 0; i--) {
            const row = document.createElement('span');
            row.className = 'block-row is-new';
            row.textContent = target[i];
            row.style.animationDelay = ((newCount - 1 - i) * 110) + 'ms';
            el.prepend(row);
        }
    } else {
        const popCount = rows.length - target.length;
        rows.slice(0, popCount).forEach((row, i) => {
            row.classList.add('is-pop');
            row.style.animationDelay = (i * 90) + 'ms';
            setTimeout(() => row.remove(), 700 + i * 90);
        });
        rows.slice(popCount).forEach((row, i) => {
            row.textContent = target[i];
        });
    }
}

function renderLoadFigures() {
    const container = document.querySelector('.load-balance');
    if (!container || !state) return;
    const { heavierUser, heavierShare } = computeWeightedLoad(state);
    const overallStage = getLoadStage(heavierShare);
    const lighterPose = getLighterPose(heavierShare);

    const stageFor = { aditya: 0, chhaya: 0 };
    const poseFor = { aditya: 'standing', chhaya: 'standing' };

    if (heavierUser && overallStage > 0) {
        stageFor[heavierUser] = overallStage;
        poseFor[heavierUser] = STAGE_POSE[overallStage];
        const lighter = heavierUser === 'aditya' ? 'chhaya' : 'aditya';
        if (lighterPose === 'beach' || lighterPose === 'lounge') {
            poseFor[lighter] = lighterPose;
        }
    }

    container.dataset.stageAditya = String(stageFor.aditya);
    container.dataset.stageChhaya = String(stageFor.chhaya);

    ['aditya', 'chhaya'].forEach(who => {
        const fig = figures[who];
        if (!fig) return;
        fig.el.dataset.stage = String(stageFor[who]);
        renderBlocks(fig, stageFor[who]);
        applyPose(fig, poseFor[who]);
    });
}

function initFigures() {
    const container = document.querySelector('.load-balance');
    if (!container) return;
    heartsEl = container.querySelector('.load-hearts');
    container.querySelectorAll('.load-figure').forEach(el => {
        const who = el.dataset.figure;
        const body = el.querySelector('.load-body');
        if (body) body.innerHTML = buildRigSvg(who);
        const eyes = body ? body.querySelector('.rig-eyes') : null;
        if (eyes) eyes.style.setProperty('--blink-delay', '-' + rand(0, 7).toFixed(2) + 's');
        const fig = {
            who,
            el,
            body,
            blocks: el.querySelector('.load-blocks'),
            x: 0,
            pose: 'standing',
            blockStage: 0,
            poseSeq: 0,
            walkAnim: null,
            idleTimer: null,
            celebrateTimer: null
        };
        figures[who] = fig;
        el.dataset.pose = 'standing';
        const name = who === 'chhaya' ? 'Chhaya' : 'Aditya';
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.setAttribute('aria-label', `${name} stick figure. Tap for a sweet moment.`);
        el.addEventListener('click', triggerAffectionBeat);
        el.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            triggerAffectionBeat();
        });
        startDirector(fig);
    });
    scheduleCouple();
}

// =================================================================
// Board rendering — cards are built from merged task defs so chores
// can be renamed / re-pointed / reassigned / retired / added in-app.
// =================================================================

const SECTION_ORDER = [
    ['cat', 'Cat'],
    ['daily', 'Daily'],
    ['weekly', 'Weekly']
];

const CHEVRON_SVG = '<svg class="chevron" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 4l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

let renderedDefsJson = '';

function sectionOf(def) {
    return def.section === 'cat' ? 'cat' : def.cadence;
}

function getActiveUser() {
    return document.body.dataset.activeUser === 'chhaya' ? 'chhaya' : 'aditya';
}

// Together mode: while on, check-offs are credited to 'both' and the
// points split 50/50 in every aggregation. Session-only on purpose — it's
// a "this time we did it together" switch, not a persistent setting.
let togetherMode = false;

function getActiveActor() {
    return togetherMode ? 'both' : getActiveUser();
}

function partnerOf(user) {
    return user === 'aditya' ? 'chhaya' : 'aditya';
}

function setupTogetherToggle() {
    const btn = document.getElementById('together-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
        togetherMode = !togetherMode;
        btn.setAttribute('aria-pressed', String(togetherMode));
        document.body.dataset.together = togetherMode ? 'true' : 'false';
    });
}

function buildTaskRow(def) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.taskId = def.id;

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.className = 'checkbox';
    cb.id = def.id;
    cb.dataset.type = def.cadence;

    const label = document.createElement('label');
    label.className = 'task-name';
    label.htmlFor = def.id;
    label.textContent = def.name;

    const mark = document.createElement('span');
    mark.className = 'actor-mark';
    mark.setAttribute('data-actor-mark', '');

    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.dataset.points = String(def.points);
    badge.title = `${fmtPts(def.points)} pts`;
    badge.textContent = pointsToBadge(def.points);

    const edit = document.createElement('button');
    edit.type = 'button';
    edit.className = 'task-edit-btn';
    edit.title = 'Edit chore';
    edit.setAttribute('aria-label', `Edit ${def.name}`);
    edit.textContent = '⋯';

    li.appendChild(cb);
    li.appendChild(label);
    li.appendChild(mark);
    li.appendChild(badge);
    li.appendChild(edit);

    attachRowInteractions(li, cb, edit);
    cb.addEventListener('change', () => handleRecurringToggle(def.id, cb));
    return li;
}

function buildSection(user, secId, label, secDefs) {
    const section = document.createElement('section');
    section.className = 'section';
    section.dataset.section = `${user}-${secId}`;

    const btn = document.createElement('button');
    btn.className = 'section-title';
    btn.type = 'button';
    btn.innerHTML = (secId === 'cat' ? '<span class="cat-icon" aria-hidden="true">🐈‍⬛</span>' : '')
        + `<span class="section-name">${label}</span>`
        + '<span class="section-progress" data-section-progress></span>'
        + CHEVRON_SVG;
    section.appendChild(btn);

    const content = document.createElement('div');
    content.className = 'section-content';

    let currentRoom;
    let currentList = null;
    secDefs.forEach(def => {
        const room = def.room || '';
        if (!currentList || room !== currentRoom) {
            currentRoom = room;
            currentList = document.createElement('ul');
            currentList.className = 'task-list';
            if (room) {
                const group = document.createElement('div');
                group.className = 'room-group';
                const h = document.createElement('h4');
                h.className = 'room-label';
                h.textContent = room;
                group.appendChild(h);
                group.appendChild(currentList);
                content.appendChild(group);
            } else {
                content.appendChild(currentList);
            }
        }
        currentList.appendChild(buildTaskRow(def));
    });

    section.appendChild(content);
    return section;
}

function renderBoards() {
    if (!state) return false;
    const defs = getMergedDefs(state);
    const json = JSON.stringify(defs.list) + JSON.stringify(Object.keys(defs.allById).filter(id => defs.allById[id].retired));
    if (json === renderedDefsJson) return false;
    renderedDefsJson = json;
    closeEditPanel();

    USERS.forEach(user => {
        const board = document.querySelector(`.card[data-user="${user}"] [data-board]`);
        if (!board) return;
        board.innerHTML = '';
        const userDefs = defs.list.filter(d => d.owner === user);
        SECTION_ORDER.forEach(([secId, label]) => {
            const secDefs = userDefs.filter(d => sectionOf(d) === secId);
            if (secDefs.length === 0) return;
            board.appendChild(buildSection(user, secId, label, secDefs));
        });
    });

    setupCollapsibles();
    renderRetiredLists();
    return true;
}

function syncCheckboxes() {
    if (!state) return;
    if (isHistoryView()) {
        const { status, events } = dayEventsStatus(selectedHistoryDay);
        const ready = status === 'ready';
        const doneIds = new Set(events.map(e => e.taskId));
        document.querySelectorAll('[data-board] .checkbox').forEach(cb => {
            cb.checked = doneIds.has(cb.id);
            // both directions editable: check to backfill, uncheck a mistake
            cb.disabled = !ready;
        });
        return;
    }
    document.querySelectorAll('[data-board] .checkbox').forEach(cb => {
        cb.checked = Boolean(state.tasks[cb.id]);
        cb.disabled = false;
    });
}

// --- Collapsible sections ---

function loadCollapsedSections() {
    try { return JSON.parse(localStorage.getItem(COLLAPSED_SECTIONS_KEY) || '[]'); }
    catch { return []; }
}

function saveCollapsedSections() {
    const ids = Array.from(document.querySelectorAll('.section[data-collapsed="true"]')).map(s => s.dataset.section);
    localStorage.setItem(COLLAPSED_SECTIONS_KEY, JSON.stringify(ids));
}

function setupCollapsibles() {
    const collapsed = loadCollapsedSections();
    document.querySelectorAll('.section').forEach(section => {
        const id = section.dataset.section;
        const isCollapsed = collapsed.includes(id);
        section.dataset.collapsed = isCollapsed ? 'true' : 'false';
        const btn = section.querySelector('.section-title');
        btn.setAttribute('aria-expanded', String(!isCollapsed));
        btn.addEventListener('click', () => {
            const nowCollapsed = section.dataset.collapsed !== 'true';
            section.dataset.collapsed = nowCollapsed ? 'true' : 'false';
            btn.setAttribute('aria-expanded', String(!nowCollapsed));
            saveCollapsedSections();
        });
    });
}

// --- Day history: rolling last-7-days strip ---
// Picking a past day flips the boards into a read-only snapshot of what
// was checked off that day. Current-week days come off the live events
// ledger (pruned only at the Monday rollover); older days are fetched
// from the days/ archive subcollection and cached for the session.

const WEEKDAY_CHIP = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'];
let selectedHistoryDay = null;          // null = live view of today
const archivedDayCache = {};            // dayKey -> events[] | 'loading' | 'missing'

function addDaysToKey(key, n) {
    const [y, m, d] = key.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d + n, 12));
    return formatDateKey(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
}

function weekdayOfKey(key) {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay();
}

function dayKeyLabel(key, style = 'long') {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString(undefined,
        { timeZone: 'UTC', weekday: style, month: 'short', day: 'numeric' });
}

function isHistoryView() {
    return Boolean(selectedHistoryDay && selectedHistoryDay !== getDayKey());
}

// Events for a day: 'live' days read state.events, older ones the archive.
function dayEventsStatus(dayKey) {
    if (dayKey >= getWeekKey()) {
        return { status: 'ready', events: (state.events || []).filter(e => e.day === dayKey) };
    }
    const cached = archivedDayCache[dayKey];
    if (Array.isArray(cached)) return { status: 'ready', events: cached };
    if (cached === 'missing') return { status: 'ready', events: [] };
    if (cached === 'loading') return { status: 'loading', events: [] };
    if (!isFirebaseReady()) return { status: 'offline', events: [] };
    archivedDayCache[dayKey] = 'loading';
    fetchArchivedDay(dayKey).then(doc => {
        archivedDayCache[dayKey] = doc && Array.isArray(doc.events) ? doc.events : 'missing';
        refreshBoardsView();
    });
    return { status: 'loading', events: [] };
}

function dayHadActivity(dayKey) {
    if ((state.events || []).some(e => e.day === dayKey)) return true;
    const h = (state.dailyHistory || []).find(x => x.day === dayKey);
    return Boolean(h && ((h.acts || 0) > 0 || (h.points || 0) > 0 || (h.adityaPoints || 0) > 0 || (h.chhayaPoints || 0) > 0));
}

function selectHistoryDay(dayKey) {
    const todayKey = getDayKey();
    selectedHistoryDay = (dayKey === todayKey || dayKey === selectedHistoryDay) ? null : dayKey;
    refreshBoardsView();
}

// Everything that depends on which day the boards are showing.
function refreshBoardsView() {
    if (!state) return;
    document.body.classList.toggle('history-view', isHistoryView());
    syncCheckboxes();
    renderTravelState();
    updateProgress();
    renderTaskDecorations();
    renderOneTimeTasks();
    renderDayHistory();
}

function renderDayHistory() {
    const strip = document.getElementById('day-strip');
    const detail = document.getElementById('day-detail');
    if (!strip || !detail || !state) return;

    const todayKey = getDayKey();
    strip.innerHTML = '';
    for (let i = 6; i >= 0; i--) {
        const dayKey = addDaysToKey(todayKey, -i);
        const selected = dayKey === (selectedHistoryDay || todayKey);
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'day-chip';
        chip.setAttribute('role', 'tab');
        chip.innerHTML = `<span class="day-chip-label">${WEEKDAY_CHIP[weekdayOfKey(dayKey)]}</span>`
            + `<span class="day-chip-date">${Number(dayKey.slice(8))}</span>`;
        chip.title = dayKeyLabel(dayKey);
        if (dayKey === todayKey) chip.classList.add('is-today');
        if (dayHadActivity(dayKey)) chip.classList.add('has-activity');
        chip.classList.toggle('is-selected', selected);
        chip.setAttribute('aria-selected', String(selected));
        chip.addEventListener('click', () => selectHistoryDay(dayKey));
        strip.appendChild(chip);
    }

    renderDayBanner(detail);
}

function renderDayBanner(detail) {
    if (!isHistoryView()) {
        detail.hidden = true;
        detail.innerHTML = '';
        return;
    }
    const dayKey = selectedHistoryDay;
    const { status, events } = dayEventsStatus(dayKey);
    detail.hidden = false;
    detail.innerHTML = '';

    const banner = document.createElement('div');
    banner.className = 'day-detail-banner';

    const text = document.createElement('span');
    text.className = 'day-detail-header';
    if (status === 'loading') {
        text.textContent = `${dayKeyLabel(dayKey)} · fetching…`;
    } else if (status === 'offline') {
        text.textContent = `${dayKeyLabel(dayKey)} · archive needs a connection`;
    } else if (events.length === 0) {
        text.textContent = `${dayKeyLabel(dayKey)} · nothing was checked off`;
    } else {
        // shared ('both') completions credit half to each side
        const sum = who => events.reduce((s, e) =>
            s + (e.who === who ? (e.pts || 0) : e.who === 'both' ? (e.pts || 0) / 2 : 0), 0);
        text.textContent = `${dayKeyLabel(dayKey)} · ${events.length} ${events.length === 1 ? 'chore' : 'chores'}`
            + ` · aditya ${fmtPts(sum('aditya'))} · chhaya ${fmtPts(sum('chhaya'))} pts`;
    }
    banner.appendChild(text);

    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'day-detail-back';
    back.textContent = '↩ back to today';
    back.addEventListener('click', () => selectHistoryDay(getDayKey()));
    banner.appendChild(back);

    detail.appendChild(banner);

    if (status === 'ready') {
        const hint = document.createElement('div');
        hint.className = 'day-detail-hint';
        hint.textContent = 'edits log to this day — check a missed chore, or uncheck a mistake';
        detail.appendChild(hint);
    }
}

// --- Stats panel ---

function setText(key, value) {
    const el = document.querySelector(`[data-stat="${key}"]`);
    if (el) el.textContent = value;
}

function setWidth(key, value) {
    const el = document.querySelector(`[data-stat="${key}"]`);
    if (el) el.style.width = value;
}

function updateProgress() {
    // travel-paused rows sit out of the counts
    document.querySelectorAll('.card[data-user]').forEach(card => {
        const total = card.querySelectorAll('.task-item:not(.is-travel-paused) .checkbox').length;
        const done = card.querySelectorAll('.task-item:not(.is-travel-paused) .checkbox:checked').length;
        const pill = card.querySelector('[data-progress-pill]');
        if (pill) {
            pill.textContent = `${done} / ${total}`;
            pill.classList.toggle('is-complete', total > 0 && done === total);
        }
    });
    document.querySelectorAll('.section').forEach(section => {
        const total = section.querySelectorAll('.task-item:not(.is-travel-paused) .checkbox').length;
        const done = section.querySelectorAll('.task-item:not(.is-travel-paused) .checkbox:checked').length;
        const progress = section.querySelector('[data-section-progress]');
        if (progress) progress.textContent = `${done}/${total}`;
    });
}

function updateStats() {
    if (!state) return;
    const defs = getMergedDefs(state);
    const tasks = state.tasks;
    const dailyIds = filterTravelPaused(defs, dailyIdsOf(defs), state.travel);
    const weeklyIds = weeklyIdsOf(defs);

    const dailyDone = countChecked(dailyIds, tasks);
    const dailyPts = pointsForChecked(defs, dailyIds, tasks);
    const dailyTotalPts = pointsFor(defs, dailyIds);

    const weeklyDone = countChecked(weeklyIds, tasks);
    const weeklyPts = pointsForChecked(defs, weeklyIds, tasks);
    const weeklyTotalPts = pointsFor(defs, weeklyIds);

    setText('today-count', `${dailyDone} / ${dailyIds.length}`);
    setText('today-pts', `${fmtPts(dailyPts)} / ${fmtPts(dailyTotalPts)} pts`);
    setText('weekly-count', `${weeklyDone} / ${weeklyIds.length}`);
    setText('weekly-pts', `${fmtPts(weeklyPts)} / ${fmtPts(weeklyTotalPts)} pts`);

    const streak = state.streak ?? 0;
    const best = state.bestStreak ?? 0;
    setText('streak-days', String(streak));
    setText('streak-meta', (streak === 1 ? 'day' : 'days') + (travelActive(state) ? ' · ✈ frozen' : ''));
    setText('streak-best', best > 0 ? ` · best ${best}d` : '');

    const totalBoardPts = dailyTotalPts + weeklyTotalPts;
    const totalBoardDonePts = dailyPts + weeklyPts;
    const boardPctTotal = totalBoardPts > 0 ? (totalBoardDonePts / totalBoardPts) * 100 : 0;

    setWidth('gauge-daily', totalBoardPts > 0 ? `${(dailyPts / totalBoardPts) * 100}%` : '0%');
    setWidth('gauge-weekly', totalBoardPts > 0 ? `${(weeklyPts / totalBoardPts) * 100}%` : '0%');
    setText('gauge-total', `${fmtPts(totalBoardDonePts)} / ${fmtPts(totalBoardPts)} pts · ${Math.round(boardPctTotal)}%`);
    setText('gauge-daily-pts', `daily ${fmtPts(dailyPts)} / ${fmtPts(dailyTotalPts)}`);
    setText('gauge-weekly-pts', `weekly ${fmtPts(weeklyPts)} / ${fmtPts(weeklyTotalPts)}`);

    renderHistory();
    renderLoadFigures();
}

function renderHistory() {
    const container = document.querySelector('[data-stat="history-bars"]');
    if (!container) return;
    container.innerHTML = '';

    const defs = getMergedDefs(state);
    const todayKey = getDayKey();
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        days.push(getDayKey(d));
    }

    const histByDay = Object.fromEntries((state.dailyHistory ?? []).map(h => [h.day, h]));

    let sumPct = 0;
    let countDays = 0;
    const dayLabel = key => {
        const [y, m, d] = key.split('-').map(Number);
        return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(undefined, { timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric' });
    };

    days.forEach(day => {
        const bar = document.createElement('div');
        bar.className = 'history-bar';

        const h = histByDay[day];
        if (h && (h.totalPoints || 0) > 0) {
            const pct = (h.points / h.totalPoints) * 100;
            const fill = document.createElement('div');
            fill.className = 'history-bar-fill';
            fill.style.height = `${Math.max(6, pct)}%`;
            bar.appendChild(fill);
            bar.title = `${dayLabel(day)}: ${h.done}/${h.total} tasks · ${fmtPts(h.points)}/${fmtPts(h.totalPoints)} pts (${Math.round(pct)}%) · aditya ${fmtPts(h.adityaPoints || 0)} · chhaya ${fmtPts(h.chhayaPoints || 0)}`;
            sumPct += pct;
            countDays++;
        } else if (day === todayKey) {
            const dailyIds = filterTravelPaused(defs, dailyIdsOf(defs), state.travel);
            const dailyPtsNow = pointsForChecked(defs, dailyIds, state.tasks);
            const totalNow = pointsFor(defs, dailyIds);
            const pct = totalNow > 0 ? (dailyPtsNow / totalNow) * 100 : 0;
            const fill = document.createElement('div');
            fill.className = 'history-bar-fill';
            fill.style.height = `${Math.max(6, pct)}%`;
            bar.appendChild(fill);
            bar.classList.add('is-today');
            bar.title = `${dayLabel(day)} (in progress): ${fmtPts(dailyPtsNow)}/${fmtPts(totalNow)} pts (${Math.round(pct)}%)`;
        } else {
            bar.classList.add('is-empty');
            bar.title = `${dayLabel(day)}: no data`;
        }
        container.appendChild(bar);
    });

    setText('history-avg', countDays > 0 ? `${Math.round(sumPct / countDays)}% avg · ${countDays}d tracked` : 'no data yet');
}

// --- Row decorations: actor marks, interval tags, kudos buttons ---

function renderTaskDecorations() {
    if (!state) return;
    const defs = getMergedDefs(state);
    const history = isHistoryView();
    // in history view the actor comes from that day's ledger, not live state
    const actor = history
        ? Object.fromEntries(dayEventsStatus(selectedHistoryDay).events.map(e => [e.taskId, e.who]))
        : (state.taskActor || {});
    document.querySelectorAll('[data-board] .task-item').forEach(item => {
        const id = item.dataset.taskId;
        const def = defs.byId[id];
        if (!def) return;
        const cb = item.querySelector('.checkbox');
        const mark = item.querySelector('[data-actor-mark]');

        const a = actor[id];
        if (cb.checked && a) {
            mark.textContent = a === def.owner ? '' : a;
            mark.classList.toggle('is-default', a === def.owner);
        } else {
            mark.textContent = '';
            mark.classList.remove('is-default');
        }

        let tag = item.querySelector('.interval-tag');
        if (hasCustomInterval(def)) {
            if (!tag) {
                tag = document.createElement('span');
                tag.className = 'interval-tag';
                item.querySelector('.badge').before(tag);
            }
            tag.textContent = def.interval + 'd';
        } else if (tag) {
            tag.remove();
        }

        const defaultOwner = DEFAULTS_BY_ID[id] ? DEFAULTS_BY_ID[id].owner : def.owner;
        if (def.owner !== defaultOwner) {
            item.dataset.reassigned = '⇄';
        } else {
            delete item.dataset.reassigned;
        }

        // no kudos buttons on a read-only snapshot
        updateKudosButton(item, id, def.name, !history && cb.checked ? a : null);
    });
}

// =================================================================
// Kudos — per-task ⭐ (one per task per sender per day) + the
// love-notes strip with per-user unread badge.
// =================================================================

const KUDOS_EMOJI_MAP = {
    star: '⭐', heart: '❤️', fire: '🔥',
    flex: '💪', sparkle: '✨', clap: '👏'
};

let sessionKudosWatermark = '';
let lnOpen = false;

function latestKudosTs(kudos) {
    return (kudos || []).reduce((m, k) => (k.timestamp || '') > m ? k.timestamp : m, '');
}

function kudosAlreadySentToday(taskKey) {
    const active = getActiveUser();
    const todayIso = new Date().toISOString().slice(0, 10);
    return (state.kudos || []).some(k =>
        k.taskId === taskKey && k.from === active && (k.timestamp || '').slice(0, 10) === todayIso);
}

function updateKudosButton(item, taskKey, taskName, doneBy) {
    const existing = item.querySelector('.kudos-btn');
    if (existing) existing.remove();
    if (!doneBy) return;
    const active = getActiveUser();
    if (doneBy === active) return;
    // shared completion: the kudos goes to the partner ("thanks for pitching in")
    const target = doneBy === 'both' ? partnerOf(active) : doneBy;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'kudos-btn';
    btn.textContent = '⭐';
    const sent = kudosAlreadySentToday(taskKey);
    if (sent) {
        btn.classList.add('is-given');
        btn.disabled = true;
        btn.title = 'Kudos sent';
    } else {
        btn.title = `Send kudos to ${target}`;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            sendKudos({ to: target, taskId: taskKey, taskName });
            btn.classList.add('is-sent', 'is-given');
            btn.disabled = true;
        });
    }
    const mark = item.querySelector('.actor-mark');
    if (mark) mark.after(btn);
}

async function sendKudos({ to, taskId, taskName }) {
    const from = getActiveUser();
    const entry = {
        id: 'k_' + crypto.randomUUID().slice(0, 8),
        from,
        to,
        emoji: 'star',
        taskId: taskId || null,
        taskName: taskName || null,
        message: null,
        timestamp: new Date().toISOString()
    };
    sessionKudosWatermark = entry.timestamp;
    const counterKey = from === 'aditya' ? 'kudosAditya' : 'kudosChhaya';
    const next = {
        ...state,
        kudos: [...(state.kudos || []), entry].slice(-KUDOS_CAP),
        lifetime: { ...state.lifetime, [counterKey]: (state.lifetime?.[counterKey] || 0) + 1 }
    };
    applyStateToDom(next);
    if (isFirebaseReady()) {
        try { await sendKudosToCloud(entry); }
        catch { setStatus(`saved locally · ${RESET_INFO}`, 'warning'); }
    }
    checkAndSaveAchievements(state);
}

function notifyNewKudos(next) {
    const incoming = (next.kudos || []).filter(k => (k.timestamp || '') > sessionKudosWatermark);
    const active = getActiveUser();
    incoming.forEach(k => {
        if (k.to === active) showKudosToast(k);
    });
    const maxTs = latestKudosTs(next.kudos);
    if (maxTs > sessionKudosWatermark) sessionKudosWatermark = maxTs;
}

function showKudosToast(entry) {
    const emoji = KUDOS_EMOJI_MAP[entry.emoji] || '⭐';
    const msg = entry.taskName
        ? `${entry.from} sent ${emoji} for ${entry.taskName}`
        : `${entry.from} sent you ${emoji}`;
    const toast = document.createElement('div');
    toast.className = 'kudos-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    setTimeout(() => {
        toast.classList.remove('is-visible');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function kudosDayLabel(ts) {
    if (!ts) return '';
    const day = getDayKey(new Date(ts));
    const today = getDayKey();
    if (day === today) return 'today';
    const [y, m, d] = day.split('-').map(Number);
    const yesterday = getDayKey(new Date(Date.now() - 86400000));
    if (day === yesterday) return 'yesterday';
    return `${m}/${d}`;
}

function renderLoveNotes() {
    if (!state) return;
    const active = getActiveUser();
    const badge = document.querySelector('[data-ln-badge]');
    const feed = document.querySelector('[data-ln-feed]');
    if (!badge || !feed) return;

    const seen = (state.kudosSeen && state.kudosSeen[active]) || '';
    const unread = (state.kudos || []).filter(k => k.to === active && (k.timestamp || '') > seen).length;
    badge.hidden = unread === 0;
    badge.textContent = `${unread} new`;

    if (!lnOpen) return;
    feed.innerHTML = '';
    // only the past week shows here — older kudos live on in the stats log
    const weekAgoIso = new Date(Date.now() - 7 * 86400000).toISOString();
    const recent = (state.kudos || [])
        .filter(k => (k.timestamp || '') >= weekAgoIso)
        .slice(-14)
        .reverse();
    if (recent.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'ln-empty';
        empty.textContent = (state.kudos || []).length === 0
            ? 'no kudos yet — check off a chore done by your partner and tap the ⭐'
            : 'quiet week — older kudos are on the stats page';
        feed.appendChild(empty);
        return;
    }
    const twoDaysAgoIso = new Date(Date.now() - 2 * 86400000).toISOString();
    recent.forEach(k => {
        const row = document.createElement('div');
        row.className = 'ln-row';
        if ((k.timestamp || '') < twoDaysAgoIso) row.classList.add('is-fading');
        const emoji = KUDOS_EMOJI_MAP[k.emoji] || '⭐';
        const what = k.taskName ? ` · ${k.taskName}` : '';
        row.innerHTML = `<span class="ln-emoji">${emoji}</span>`
            + `<span class="ln-text"><strong>${k.from}</strong> → <strong>${k.to}</strong>${what}</span>`
            + `<span class="ln-when">${kudosDayLabel(k.timestamp)}</span>`;
        feed.appendChild(row);
    });
}

function setupLoveNotes() {
    const toggle = document.getElementById('ln-toggle');
    const feed = document.querySelector('[data-ln-feed]');
    if (!toggle || !feed) return;
    toggle.addEventListener('click', async () => {
        if (!state) return;
        lnOpen = !lnOpen;
        feed.hidden = !lnOpen;
        toggle.setAttribute('aria-expanded', String(lnOpen));
        document.getElementById('love-notes').dataset.open = lnOpen ? 'true' : 'false';
        renderLoveNotes();
        if (lnOpen) {
            const active = getActiveUser();
            const seen = (state.kudosSeen && state.kudosSeen[active]) || '';
            const maxTs = latestKudosTs(state.kudos);
            if (maxTs && maxTs > seen) {
                state = { ...state, kudosSeen: { ...state.kudosSeen, [active]: maxTs } };
                saveLocalState(state);
                renderLoveNotes();
                if (isFirebaseReady()) {
                    try { await markKudosSeenInCloud(active, maxTs); }
                    catch { /* badge will reappear; harmless */ }
                }
            }
        }
    });
}

// --- User tabs ---

// Whoever is "checking as" sees their own card first. The desktop grid
// swap lives in styles.css (body[data-active-user] grid-area rules); this
// reorder covers the stacked flex layouts.
function applyCardOrder(active) {
    const mine = document.querySelector(`.card[data-user="${active}"]`);
    const theirs = document.querySelector(`.card[data-user="${active === 'chhaya' ? 'aditya' : 'chhaya'}"]`);
    if (mine && theirs && (mine.compareDocumentPosition(theirs) & Node.DOCUMENT_POSITION_PRECEDING)) {
        theirs.parentNode.insertBefore(mine, theirs);
    }
}

function setupUserTabs() {
    const stored = localStorage.getItem(ACTIVE_USER_KEY);
    const active = stored === 'chhaya' ? 'chhaya' : 'aditya';
    document.body.dataset.activeUser = active;
    applyCardOrder(active);
    document.querySelectorAll('.user-tab').forEach(tab => {
        tab.setAttribute('aria-selected', String(tab.dataset.user === active));
        tab.addEventListener('click', () => {
            const user = tab.dataset.user;
            document.body.dataset.activeUser = user;
            localStorage.setItem(ACTIVE_USER_KEY, user);
            document.querySelectorAll('.user-tab').forEach(t => {
                t.setAttribute('aria-selected', String(t.dataset.user === user));
            });
            applyCardOrder(user);
            // kudos buttons + unread badge are per-user
            renderTaskDecorations();
            renderOneTimeTasks();
            renderLoveNotes();
        });
    });
}

// --- Travel mode ---
// Toggling ✈ on a card pauses that person's owned dailies (they leave the
// day's denominators but stay checkable for the partner) and freezes both
// streaks for every day/week the trip touches. Both toggles on = all
// dailies paused. The streak math lives in applyResetRules (db.js).

function renderTravelState() {
    if (!state) return;
    const travel = state.travel || {};
    const defs = getMergedDefs(state);
    USERS.forEach(user => {
        const card = document.querySelector(`.card[data-user="${user}"]`);
        if (!card) return;
        const on = Boolean(travel[user]);
        card.classList.toggle('is-traveling', on);
        const btn = card.querySelector('[data-travel-toggle]');
        if (btn) btn.setAttribute('aria-pressed', String(on));
        const note = card.querySelector('[data-travel-note]');
        if (note) note.hidden = !on;
    });
    document.querySelectorAll('[data-board] .task-item').forEach(li => {
        const def = defs.byId[li.dataset.taskId];
        // a historical snapshot shows what happened, not today's pauses
        li.classList.toggle('is-travel-paused', !isHistoryView() && isTaskPausedForTravel(def, travel));
    });
}

function setupTravelToggles() {
    document.querySelectorAll('[data-travel-toggle]').forEach(btn => {
        btn.addEventListener('click', () => handleTravelToggle(btn.dataset.travelToggle));
    });
}

async function handleTravelToggle(who) {
    const current = state || buildDefaultState();
    const travel = { aditya: false, chhaya: false, ...(current.travel || {}) };
    const turningOn = !travel[who];
    travel[who] = turningOn;

    const today = getDayKey();
    // fresh trip starts a new travel window; overlapping trips share one
    let travelSince = current.travelSince || '';
    if (turningOn && (!travelActive(current) || !travelSince)) travelSince = today;

    const logEntry = {
        ts: new Date().toISOString(),
        who: getActiveUser(),
        action: turningOn ? 'travel_on' : 'travel_off',
        taskId: null,
        detail: `${who} ${turningOn ? 'started' : 'ended'} travel mode`
    };
    const next = {
        ...current,
        travel,
        travelSince,
        lastTravelDay: today,
        changeLog: [...(current.changeLog || []), logEntry]
    };
    applyStateToDom(next);
    if (!isFirebaseReady()) {
        setStatus(`saved locally · ${RESET_INFO}`, 'warning');
        return;
    }
    try {
        await updateTravelInCloud({ travel, travelSince, lastTravelDay: today, logEntry });
    } catch {
        setStatus(`saved locally · ${RESET_INFO}`, 'warning');
    }
}

// =================================================================
// Chore editing — ⋯ button or long-press opens the panel; changes
// are written as taskDef overrides and recorded in the change log.
// =================================================================

let longPressTimer = null;
let longPressTriggered = false;
let activeEditPanel = null;
let activeEditTaskId = null;

const SIZE_PRESETS = [
    { label: 'S', value: 1 },
    { label: 'SM', value: 1.33 },
    { label: 'MS', value: 1.67 },
    { label: 'M', value: 2 },
    { label: 'ML', value: 2.67 },
    { label: 'L', value: 4 }
];

const INTERVAL_PRESETS = [
    { label: '1d', value: 1 },
    { label: '3d', value: 3 },
    { label: '7d', value: 7 },
    { label: '10d', value: 10 },
    { label: '14d', value: 14 },
    { label: '30d', value: 30 }
];

function closeEditPanel() {
    if (activeEditPanel) {
        activeEditPanel.remove();
        activeEditPanel = null;
        activeEditTaskId = null;
    }
}

function logEntryFor(action, taskId, detail) {
    return {
        ts: new Date().toISOString(),
        who: getActiveUser(),
        action,
        taskId,
        detail
    };
}

async function applyDefChange(taskId, override, logEntry) {
    const next = { ...state, taskDefs: { ...(state.taskDefs || {}) } };
    if (override) next.taskDefs[taskId] = override;
    else delete next.taskDefs[taskId];
    if (logEntry) next.changeLog = [...(state.changeLog || []), logEntry].slice(-100);
    applyStateToDom(normalizeState(next));
    if (isFirebaseReady()) {
        try { await updateTaskDefInCloud(taskId, override, logEntry); }
        catch { setStatus(`saved locally · ${RESET_INFO}`, 'warning'); }
    }
}

function buildPresetRow(labelText, presets, currentValue, customAttrs) {
    const row = document.createElement('div');
    row.className = 'edit-row';
    const label = document.createElement('span');
    label.className = 'edit-label';
    label.textContent = labelText;
    row.appendChild(label);

    const wrap = document.createElement('div');
    wrap.className = 'edit-presets';
    const stateRef = { value: currentValue };

    const customInput = document.createElement('input');
    customInput.type = 'number';
    customInput.className = 'edit-custom-input';
    customInput.placeholder = '#';
    Object.entries(customAttrs).forEach(([k, v]) => customInput.setAttribute(k, v));

    presets.forEach(p => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'edit-preset-btn';
        btn.textContent = p.label;
        if (Math.abs(p.value - currentValue) < 0.001) btn.classList.add('is-active');
        btn.addEventListener('click', () => {
            stateRef.value = p.value;
            wrap.querySelectorAll('.edit-preset-btn').forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            customInput.value = '';
        });
        wrap.appendChild(btn);
    });

    if (!presets.some(p => Math.abs(p.value - currentValue) < 0.001)) {
        customInput.value = currentValue;
    }
    customInput.addEventListener('input', () => {
        const v = parseFloat(customInput.value);
        if (v > 0) {
            stateRef.value = v;
            wrap.querySelectorAll('.edit-preset-btn').forEach(b => b.classList.remove('is-active'));
        }
    });
    wrap.appendChild(customInput);
    row.appendChild(wrap);
    return { row, stateRef };
}

function openEditPanel(taskItem, taskId) {
    if (isHistoryView()) return; // snapshot is read-only
    if (activeEditTaskId === taskId) {
        closeEditPanel();
        return;
    }
    closeEditPanel();
    const defs = getMergedDefs(state);
    const def = defs.byId[taskId];
    if (!def) return;
    const isCustom = def.custom === true;
    const defaultDef = DEFAULTS_BY_ID[taskId];

    const panel = document.createElement('div');
    panel.className = 'task-edit-panel';

    // name
    const nameRow = document.createElement('div');
    nameRow.className = 'edit-row';
    const nameLabel = document.createElement('span');
    nameLabel.className = 'edit-label';
    nameLabel.textContent = 'name';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'edit-name-input';
    nameInput.maxLength = 60;
    nameInput.value = def.name;
    nameRow.appendChild(nameLabel);
    nameRow.appendChild(nameInput);
    panel.appendChild(nameRow);

    // size (points)
    const { row: sizeRow, stateRef: sizeRef } = buildPresetRow(
        'size', SIZE_PRESETS, def.points, { min: '0.5', max: '99', step: '0.5' });
    panel.appendChild(sizeRow);

    // interval
    const effectiveInterval = Number.isFinite(def.interval) ? def.interval : defaultIntervalFor(def);
    const { row: intRow, stateRef: intRef } = buildPresetRow(
        'repeats every', INTERVAL_PRESETS, effectiveInterval, { min: '1', max: '365', step: '1' });
    panel.appendChild(intRow);

    // assignee
    const assigneeRow = document.createElement('div');
    assigneeRow.className = 'edit-row';
    const assigneeLabel = document.createElement('span');
    assigneeLabel.className = 'edit-label';
    assigneeLabel.textContent = 'assigned to';
    assigneeRow.appendChild(assigneeLabel);
    const assigneeTabs = document.createElement('div');
    assigneeTabs.className = 'edit-assignee-tabs';
    const assigneeRef = { value: def.owner };
    USERS.forEach(who => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'edit-assignee-btn';
        btn.textContent = who;
        if (who === def.owner) btn.classList.add('is-active');
        btn.addEventListener('click', () => {
            assigneeRef.value = who;
            assigneeTabs.querySelectorAll('.edit-assignee-btn').forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
        });
        assigneeTabs.appendChild(btn);
    });
    assigneeRow.appendChild(assigneeTabs);
    panel.appendChild(assigneeRow);

    // actions
    const actions = document.createElement('div');
    actions.className = 'edit-actions';

    const retireBtn = document.createElement('button');
    retireBtn.type = 'button';
    retireBtn.className = 'edit-reset-btn';
    retireBtn.textContent = isCustom ? 'delete chore' : 'retire chore';
    retireBtn.addEventListener('click', async () => {
        closeEditPanel();
        if (isCustom) {
            await applyDefChange(taskId, null, logEntryFor('delete', taskId, `deleted "${def.name}"`));
        } else {
            const override = { ...(state.taskDefs?.[taskId] || {}), retired: true };
            await applyDefChange(taskId, override, logEntryFor('retire', taskId, `retired "${def.name}"`));
        }
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'edit-cancel-btn';
    cancelBtn.textContent = 'cancel';
    cancelBtn.addEventListener('click', closeEditPanel);

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'edit-save-btn';
    saveBtn.textContent = 'save';
    saveBtn.addEventListener('click', async () => {
        const newName = nameInput.value.trim() || def.name;
        const newPoints = sizeRef.value;
        const newInterval = Math.max(1, Math.round(intRef.value));
        const newOwner = assigneeRef.value;

        const diffs = [];
        if (newName !== def.name) diffs.push(`renamed "${def.name}" → "${newName}"`);
        if (Math.abs(newPoints - def.points) > 0.001) diffs.push(`size ${fmtPts(def.points)} → ${fmtPts(newPoints)} pts`);
        if (newInterval !== effectiveInterval) diffs.push(`repeats ${effectiveInterval}d → ${newInterval}d`);
        if (newOwner !== def.owner) diffs.push(`assigned to ${newOwner}`);

        closeEditPanel();
        if (diffs.length === 0) return;

        let override;
        if (isCustom) {
            override = {
                name: newName,
                points: newPoints,
                owner: newOwner,
                cadence: def.cadence,
                custom: true
            };
            if (def.room) override.room = def.room;
            if (newInterval !== defaultIntervalFor(def)) {
                override.interval = newInterval;
                override.lastReset = newInterval !== effectiveInterval ? getDayKey() : def.lastReset;
            }
        } else {
            override = {};
            if (newName !== defaultDef.name) override.name = newName;
            if (Math.abs(newPoints - defaultDef.points) > 0.001) override.points = newPoints;
            if (newOwner !== defaultDef.owner) override.owner = newOwner;
            if (newInterval !== defaultIntervalFor(defaultDef)) {
                override.interval = newInterval;
                override.lastReset = newInterval !== effectiveInterval ? getDayKey() : def.lastReset;
            }
            if (Object.keys(override).length === 0) override = null;
        }
        await applyDefChange(taskId, override,
            logEntryFor('edit', taskId, diffs.join(' · ')));
    });

    if (!isCustom && state.taskDefs?.[taskId]) {
        const resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.className = 'edit-reset-btn';
        resetBtn.textContent = 'reset to default';
        resetBtn.addEventListener('click', async () => {
            closeEditPanel();
            await applyDefChange(taskId, null, logEntryFor('edit', taskId, `reset "${def.name}" to default`));
        });
        actions.appendChild(resetBtn);
    }

    actions.appendChild(retireBtn);
    actions.appendChild(cancelBtn);
    actions.appendChild(saveBtn);
    panel.appendChild(actions);

    taskItem.after(panel);
    activeEditPanel = panel;
    activeEditTaskId = taskId;
    nameInput.blur();
}

// Long-press tracks absolute pointer travel (movementX/Y is unreliable for
// touch on iOS); scrolling fires pointercancel which also aborts.
function attachRowInteractions(item, cb, editBtn) {
    let pressX = 0;
    let pressY = 0;
    let pressing = false;

    const cancelPress = () => {
        clearTimeout(longPressTimer);
        pressing = false;
        item.classList.remove('is-long-press');
    };

    item.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        if (e.target.closest('.task-edit-panel, .task-edit-btn, .kudos-btn')) return;
        pressing = true;
        pressX = e.clientX;
        pressY = e.clientY;
        longPressTriggered = false;
        clearTimeout(longPressTimer);
        longPressTimer = setTimeout(() => {
            longPressTriggered = true;
            item.classList.add('is-long-press');
            openEditPanel(item, item.dataset.taskId);
        }, 500);
    });

    item.addEventListener('pointermove', (e) => {
        if (!pressing) return;
        if (Math.hypot(e.clientX - pressX, e.clientY - pressY) > 8) cancelPress();
    });

    item.addEventListener('pointerup', cancelPress);
    item.addEventListener('pointercancel', () => {
        cancelPress();
        longPressTriggered = false;
    });

    item.addEventListener('contextmenu', (e) => {
        if (pressing || longPressTriggered) e.preventDefault();
    });

    cb.addEventListener('click', (e) => {
        if (longPressTriggered) {
            e.preventDefault();
            e.stopPropagation();
            longPressTriggered = false;
        }
    }, true);

    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditPanel(item, item.dataset.taskId);
    });
}

// --- Add recurring chore + retired list (per-card footer) ---

function setupCardFooters() {
    USERS.forEach(user => {
        const footer = document.querySelector(`.card[data-user="${user}"] [data-card-footer]`);
        if (!footer) return;

        const retired = document.createElement('div');
        retired.className = 'retired-list';
        retired.dataset.retiredList = user;
        footer.appendChild(retired);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'add-task-btn add-chore-btn';
        btn.textContent = '+ add chore';
        footer.appendChild(btn);

        const form = document.createElement('div');
        form.className = 'add-task-form add-chore-form';
        form.innerHTML = `
            <input type="text" class="add-task-name" data-chore-name placeholder="Chore name" maxlength="60" autocomplete="off">
            <div class="add-task-options">
                <div class="size-pick" data-chore-size>
                    <button type="button" class="size-btn" data-points="1">S</button>
                    <button type="button" class="size-btn is-active" data-points="2">M</button>
                    <button type="button" class="size-btn" data-points="4">L</button>
                </div>
                <div class="size-pick" data-chore-cadence>
                    <button type="button" class="size-btn is-active" data-cadence="daily">daily</button>
                    <button type="button" class="size-btn" data-cadence="weekly">weekly</button>
                </div>
            </div>
            <input type="text" class="add-task-name" data-chore-room placeholder="Room (optional)" maxlength="30" autocomplete="off">
            <div class="add-task-actions">
                <button type="button" class="add-task-cancel" data-chore-cancel>cancel</button>
                <button type="button" class="add-task-submit" data-chore-add>add</button>
            </div>`;
        footer.appendChild(form);

        const nameInput = form.querySelector('[data-chore-name]');
        const roomInput = form.querySelector('[data-chore-room]');

        btn.addEventListener('click', () => {
            form.classList.toggle('is-open');
            if (form.classList.contains('is-open')) nameInput.focus();
        });
        form.querySelector('[data-chore-cancel]').addEventListener('click', () => {
            form.classList.remove('is-open');
            nameInput.value = '';
            roomInput.value = '';
        });
        form.querySelectorAll('.size-btn').forEach(b => {
            b.addEventListener('click', () => {
                const group = b.parentElement;
                group.querySelectorAll('.size-btn').forEach(x => x.classList.remove('is-active'));
                b.classList.add('is-active');
            });
        });
        form.querySelector('[data-chore-add]').addEventListener('click', async () => {
            const name = nameInput.value.trim();
            if (!name) return;
            const points = parseFloat(form.querySelector('[data-chore-size] .is-active').dataset.points);
            const cadence = form.querySelector('[data-chore-cadence] .is-active').dataset.cadence;
            const room = roomInput.value.trim();
            const id = 'x_' + crypto.randomUUID().slice(0, 8);
            const override = { name, points, owner: user, cadence, custom: true };
            if (room) override.room = room;
            form.classList.remove('is-open');
            nameInput.value = '';
            roomInput.value = '';
            await applyDefChange(id, override,
                logEntryFor('add', id, `added "${name}" (${cadence}, ${fmtPts(points)} pts, ${user})`));
        });
    });
}

function renderRetiredLists() {
    if (!state) return;
    const defs = getMergedDefs(state);
    USERS.forEach(user => {
        const container = document.querySelector(`[data-retired-list="${user}"]`);
        if (!container) return;
        container.innerHTML = '';
        const retired = Object.values(defs.allById).filter(d => d.retired && d.owner === user);
        retired.forEach(def => {
            const row = document.createElement('div');
            row.className = 'retired-row';
            const name = document.createElement('span');
            name.className = 'retired-name';
            name.textContent = def.name;
            const restore = document.createElement('button');
            restore.type = 'button';
            restore.className = 'retired-restore-btn';
            restore.textContent = 'restore';
            restore.addEventListener('click', async () => {
                if (def.custom) {
                    const override = { ...(state.taskDefs?.[def.id] || {}) };
                    delete override.retired;
                    await applyDefChange(def.id, override, logEntryFor('restore', def.id, `restored "${def.name}"`));
                } else {
                    const override = { ...(state.taskDefs?.[def.id] || {}) };
                    delete override.retired;
                    await applyDefChange(def.id, Object.keys(override).length ? override : null,
                        logEntryFor('restore', def.id, `restored "${def.name}"`));
                }
            });
            row.appendChild(name);
            row.appendChild(restore);
            container.appendChild(row);
        });
    });
}

// =================================================================
// Check / uncheck — every completion is a ledger event so weekly and
// extra points survive into history.
// =================================================================

// Backfill: checking an unchecked chore on a past day logs it to that day.
async function handleBackfillToggle(taskId, cb) {
    const dayKey = selectedHistoryDay;
    const { status, events: dayEvents } = dayEventsStatus(dayKey);
    if (status !== 'ready') { cb.checked = false; return; }

    const current = state || buildDefaultState();
    const fill = buildBackfill(current, taskId, getActiveActor(), dayKey, dayEvents);
    if (!fill) { refreshBoardsView(); return; }

    const next = {
        ...current,
        dailyHistory: mergeHistoryEntry(current.dailyHistory, fill.entry)
    };
    if (fill.isLiveWeek) next.events = [...(current.events || []), fill.event];
    else archivedDayCache[dayKey] = fill.dayEvents;
    if (fill.checkNow) {
        next.tasks = { ...next.tasks, [taskId]: true };
        next.taskActor = { ...(next.taskActor || {}), [taskId]: fill.event.who };
    }
    applyStateToDom(next);

    if (!isFirebaseReady()) {
        setStatus(`saved locally · ${RESET_INFO}`, 'warning');
        return;
    }
    try {
        await backfillCompletionInCloud({
            event: fill.event,
            appendToLive: fill.isLiveWeek,
            checkNow: fill.checkNow,
            historyRewrite: next.dailyHistory,
            archiveDay: {
                ...fill.entry,
                weekKey: getWeekKeyFromDayKey(dayKey),
                events: fill.dayEvents
            }
        });
    } catch {
        setStatus(`saved locally · ${RESET_INFO}`, 'warning');
    }
}

// Unchecking in the snapshot removes that specific day's event.
async function handleRetroUncheckToggle(taskId) {
    const dayKey = selectedHistoryDay;
    const { status, events: dayEvents } = dayEventsStatus(dayKey);
    if (status !== 'ready') { refreshBoardsView(); return; }

    const current = state || buildDefaultState();
    const un = buildRetroUncheck(current, taskId, dayKey, dayEvents);
    if (!un) { refreshBoardsView(); return; }

    const next = {
        ...current,
        dailyHistory: mergeHistoryEntry(current.dailyHistory, un.entry)
    };
    if (un.isLiveWeek) next.events = (current.events || []).filter(e => e.id !== un.event.id);
    else archivedDayCache[dayKey] = un.dayEvents;
    if (un.uncheckNow) {
        next.tasks = { ...next.tasks, [taskId]: false };
        const actorMap = { ...(next.taskActor || {}) };
        delete actorMap[taskId];
        next.taskActor = actorMap;
    }
    applyStateToDom(next);

    if (!isFirebaseReady()) {
        setStatus(`saved locally · ${RESET_INFO}`, 'warning');
        return;
    }
    try {
        await retroUncheckInCloud({
            event: un.event,
            removeFromLive: un.isLiveWeek,
            uncheckNow: un.uncheckNow,
            historyRewrite: next.dailyHistory,
            archiveDay: {
                ...un.entry,
                weekKey: getWeekKeyFromDayKey(dayKey),
                events: un.dayEvents
            }
        });
    } catch {
        setStatus(`saved locally · ${RESET_INFO}`, 'warning');
    }
}

async function handleRecurringToggle(taskId, cb) {
    if (isHistoryView()) {
        if (cb.checked) await handleBackfillToggle(taskId, cb);
        else await handleRetroUncheckToggle(taskId);
        return;
    }
    const actor = getActiveActor();
    const current = state || buildDefaultState();
    const defs = getMergedDefs(current);
    const def = defs.byId[taskId];
    if (!def) return;

    if (cb.checked) {
        const event = buildEvent(def, actor, getDayKey());
        const next = {
            ...current,
            tasks: { ...current.tasks, [taskId]: true },
            taskActor: { ...(current.taskActor || {}), [taskId]: actor },
            events: [...(current.events || []), event]
        };
        applyStateToDom(next);
        celebrateCheck(actor);
        if (!isFirebaseReady()) {
            setStatus(`saved locally · ${RESET_INFO}`, 'warning');
        } else {
            try {
                await syncResetsToCloud(state);
                await updateTaskInCloud({ taskId, checked: true, actor, event, currentState: state });
            } catch {
                setStatus(`saved locally · ${RESET_INFO}`, 'warning');
            }
        }
    } else {
        const { state: next, removedEvent, rearchivedEntry } = removeCompletion(current, taskId);
        applyStateToDom(next);
        if (!isFirebaseReady()) {
            setStatus(`saved locally · ${RESET_INFO}`, 'warning');
        } else {
            try {
                await updateTaskInCloud({
                    taskId,
                    checked: false,
                    event: removedEvent,
                    historyRewrite: rearchivedEntry ? next.dailyHistory : undefined,
                    currentState: state
                });
                if (rearchivedEntry) {
                    await archiveDayToSubcollection(rearchivedEntry.day, {
                        ...rearchivedEntry,
                        weekKey: getWeekKeyFromDayKey(rearchivedEntry.day),
                        events: next.events.filter(e => e.day === rearchivedEntry.day)
                    });
                }
            } catch {
                setStatus(`saved locally · ${RESET_INFO}`, 'warning');
            }
        }
    }
    checkAndSaveAchievements(state);
}

// --- One-time (extra) tasks ---

function renderOneTimeTasks() {
    const container = document.getElementById('extras-list');
    const section = document.getElementById('extras-section');
    const pill = document.getElementById('extras-pill');
    if (!container || !section || !state) return;

    // history view: extras done that day, straight from the ledger
    if (isHistoryView()) {
        const extras = dayEventsStatus(selectedHistoryDay).events.filter(e => e.kind === 'extra');
        section.style.display = extras.length > 0 ? '' : 'none';
        if (pill) {
            pill.textContent = `${extras.length} done`;
            pill.classList.remove('is-complete');
        }
        container.innerHTML = '';
        extras.forEach(e => {
            const li = document.createElement('li');
            li.className = 'task-item is-one-time-done';

            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.className = 'checkbox';
            cb.checked = true;
            cb.disabled = true;

            const label = document.createElement('span');
            label.className = 'task-name';
            label.textContent = e.name;

            const actor = document.createElement('span');
            actor.className = 'actor-mark';
            actor.textContent = e.who;
            actor.style.opacity = '0.7';

            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.dataset.points = String(e.pts);
            badge.textContent = pointsToBadge(e.pts);
            badge.title = `${fmtPts(e.pts)} pts`;

            li.appendChild(cb);
            li.appendChild(label);
            li.appendChild(actor);
            li.appendChild(badge);
            container.appendChild(li);
        });
        return;
    }

    const tasks = state.oneTimeTasks || {};
    const entries = Object.entries(tasks);
    section.style.display = entries.length > 0 ? '' : 'none';

    if (pill) {
        const done = entries.filter(([, t]) => t.done).length;
        pill.textContent = `${done} / ${entries.length}`;
        pill.classList.toggle('is-complete', entries.length > 0 && done === entries.length);
    }

    container.innerHTML = '';
    entries.forEach(([id, t]) => {
        const li = document.createElement('li');
        li.className = 'task-item' + (t.done ? ' is-one-time-done' : '');

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'checkbox';
        cb.id = 'ot_cb_' + id;
        cb.checked = t.done;

        const label = document.createElement('label');
        label.className = 'task-name';
        label.htmlFor = cb.id;
        label.textContent = t.name;

        const actor = document.createElement('span');
        actor.className = 'actor-mark';
        if (t.done && t.doneBy) {
            actor.textContent = t.doneBy;
            actor.style.opacity = '0.7';
        }

        li.appendChild(cb);
        li.appendChild(label);
        li.appendChild(actor);

        if (t.assignee && t.assignee !== 'either') {
            const chip = document.createElement('span');
            chip.className = 'interval-tag ot-assignee-chip';
            chip.textContent = t.assignee;
            li.appendChild(chip);
        }

        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.dataset.points = String(t.points);
        badge.textContent = pointsToBadge(t.points);
        badge.title = `${fmtPts(t.points)} pts`;
        li.appendChild(badge);

        const del = document.createElement('button');
        del.type = 'button';
        del.className = 'ot-delete-btn';
        del.textContent = '×';
        del.title = 'Remove task';
        del.addEventListener('click', () => deleteOneTime(id, t));
        li.appendChild(del);

        if (t.done && t.doneBy) {
            updateKudosButton(li, id, t.name, t.doneBy);
        }

        cb.addEventListener('change', () => handleOneTimeToggle(id, cb));
        container.appendChild(li);
    });
}

async function handleOneTimeToggle(id, cb) {
    if (isHistoryView()) return; // snapshot is read-only
    const actor = getActiveActor();
    const t = state.oneTimeTasks?.[id];
    if (!t) return;

    if (cb.checked) {
        const event = buildEvent({
            id,
            name: t.name,
            points: t.points,
            owner: (t.assignee === 'aditya' || t.assignee === 'chhaya') ? t.assignee : null,
            cadence: 'extra'
        }, actor, getDayKey(), 'extra');
        const updates = { done: true, doneBy: actor, completedAt: getDayKey() };
        const next = {
            ...state,
            oneTimeTasks: { ...state.oneTimeTasks, [id]: { ...t, ...updates } },
            events: [...(state.events || []), event]
        };
        applyStateToDom(next);
        celebrateCheck(actor);
        if (isFirebaseReady()) {
            try { await updateOneTimeTaskInCloud(id, updates, { add: true, entry: event }); }
            catch { setStatus(`saved locally · ${RESET_INFO}`, 'warning'); }
        }
    } else {
        const event = findEventForTask(state.events || [], id);
        const updates = { done: false, doneBy: null, completedAt: null };
        const next = {
            ...state,
            oneTimeTasks: { ...state.oneTimeTasks, [id]: { ...t, ...updates } },
            events: event ? state.events.filter(e => e.id !== event.id) : state.events
        };
        applyStateToDom(next);
        if (isFirebaseReady()) {
            try { await updateOneTimeTaskInCloud(id, updates, event ? { add: false, entry: event } : null); }
            catch { setStatus(`saved locally · ${RESET_INFO}`, 'warning'); }
        }
    }
    checkAndSaveAchievements(state);
}

async function deleteOneTime(id, t) {
    const removedEvent = t.done ? findEventForTask(state.events || [], id) : null;
    const next = {
        ...state,
        oneTimeTasks: { ...state.oneTimeTasks },
        events: removedEvent ? state.events.filter(e => e.id !== removedEvent.id) : state.events
    };
    delete next.oneTimeTasks[id];
    const logEntry = logEntryFor('delete', id, `removed one-time "${t.name}"`);
    next.changeLog = [...(state.changeLog || []), logEntry].slice(-100);
    applyStateToDom(next);
    if (isFirebaseReady()) {
        try { await deleteOneTimeTaskInCloud(id, logEntry, removedEvent); }
        catch { setStatus(`saved locally · ${RESET_INFO}`, 'warning'); }
    }
}

function setupAddTaskForm() {
    const btn = document.getElementById('add-task-btn');
    const form = document.getElementById('add-task-form');
    const nameInput = document.getElementById('add-task-name');
    const submitBtn = document.getElementById('add-task-submit');
    const cancelBtn = document.getElementById('add-task-cancel');
    if (!btn || !form) return;

    btn.addEventListener('click', () => {
        form.classList.toggle('is-open');
        if (form.classList.contains('is-open')) nameInput.focus();
    });

    cancelBtn.addEventListener('click', () => {
        form.classList.remove('is-open');
        nameInput.value = '';
    });

    form.querySelectorAll('.size-btn, .ot-assignee-btn').forEach(b => {
        b.addEventListener('click', () => {
            const group = b.parentElement;
            group.querySelectorAll('button').forEach(x => x.classList.remove('is-active'));
            b.classList.add('is-active');
        });
    });

    const doAdd = async () => {
        const name = nameInput.value.trim();
        if (!name) return;
        const sizeBtn = form.querySelector('.size-pick .is-active');
        const assigneeBtn = form.querySelector('.ot-assignee-pick .is-active');
        const id = 'ot_' + crypto.randomUUID().slice(0, 8);
        const task = {
            name,
            points: sizeBtn ? parseFloat(sizeBtn.dataset.points) : 2,
            assignee: assigneeBtn ? assigneeBtn.dataset.assignee : 'either',
            createdBy: getActiveUser(),
            done: false,
            doneBy: null,
            createdAt: getDayKey(),
            completedAt: null
        };
        const logEntry = logEntryFor('add', id, `added one-time "${name}"`);
        const next = {
            ...state,
            oneTimeTasks: { ...(state.oneTimeTasks || {}), [id]: task },
            changeLog: [...(state.changeLog || []), logEntry].slice(-100)
        };
        applyStateToDom(next);
        nameInput.value = '';
        form.classList.remove('is-open');

        if (isFirebaseReady()) {
            try { await addOneTimeTaskInCloud(id, task, logEntry); }
            catch { setStatus(`saved locally · ${RESET_INFO}`, 'warning'); }
        }
    };

    submitBtn.addEventListener('click', doAdd);
    nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); doAdd(); }
    });
}

// --- Achievements ---

function showAchievementToast(def) {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `<span class="achievement-toast-icon">${def.icon}</span> <strong>${def.name}</strong> unlocked!`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    setTimeout(() => {
        toast.classList.remove('is-visible');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

async function checkAndSaveAchievements(s) {
    if (!s) return;
    const newlyEarned = checkAchievements(s);
    if (Object.keys(newlyEarned).length === 0) return;

    const next = { ...s, achievements: { ...(s.achievements || {}), ...newlyEarned } };
    state = next;
    saveLocalState(next);

    Object.keys(newlyEarned).forEach(id => {
        const def = ACHIEVEMENT_DEFS.find(d => d.id === id);
        if (def) showAchievementToast(def);
    });

    if (isFirebaseReady()) {
        try { await saveAchievementsToCloud(newlyEarned); }
        catch { /* will sync later */ }
    }
}

// --- State application + sync wiring ---

function applyStateToDom(next) {
    notifyNewKudos(next);
    state = next;
    saveLocalState(next);
    renderBoards();
    updateStats();
    refreshBoardsView();
    renderLoveNotes();
}

function startResetWatcher() {
    if (resetInterval) clearInterval(resetInterval);
    resetInterval = window.setInterval(async () => {
        const { state: next, changed } = applyResetRules(state || buildDefaultState());
        if (!changed) return;
        applyStateToDom(next);
        if (isFirebaseReady()) {
            try { await syncResetsToCloud(state); }
            catch { setStatus(`saved locally · ${RESET_INFO}`, 'warning'); }
        }
    }, 60 * 1000);
}

async function handleSnapshot(snapshot) {
    const remote = getSnapshotData(snapshot);
    if (!remote) {
        try { await syncResetsToCloud(state); return; }
        catch { setStatus(`local backup only · ${RESET_INFO}`, 'warning'); return; }
    }
    const { state: next, changed } = applyResetRules(remote);
    applyStateToDom(next);
    if (changed) {
        try { await syncResetsToCloud(state); }
        catch { setStatus(`saved locally · ${RESET_INFO}`, 'warning'); return; }
    }
    setStatus(`synced · ${RESET_INFO}`);
}

async function initializeDashboard() {
    setupUserTabs();
    setupTogetherToggle();
    setupTravelToggles();
    initFigures();
    setupAddTaskForm();
    setupCardFooters();
    setupLoveNotes();
    const localState = loadLocalState();
    const { state: initial } = applyResetRules(localState);
    sessionKudosWatermark = latestKudosTs(initial.kudos);
    applyStateToDom(initial);
    startResetWatcher();
    try {
        await connectFirebase();
        await syncResetsToCloud(state);
        subscribeToSharedState(handleSnapshot, () => {
            setStatus(`cloud unavailable · ${RESET_INFO}`, 'warning');
        });
        setStatus(`synced · ${RESET_INFO}`);
    } catch {
        setStatus(`cloud unavailable · ${RESET_INFO}`, 'warning');
    }
}

document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState !== 'visible') return;
    if (!state) return;
    const { state: next, changed } = applyResetRules(state);
    applyStateToDom(next);
    if (changed && isFirebaseReady()) {
        try { await syncResetsToCloud(state); }
        catch { setStatus(`saved locally · ${RESET_INFO}`, 'warning'); }
    }
});

window.addEventListener('beforeunload', () => {
    teardown();
    if (resetInterval) clearInterval(resetInterval);
    if (coupleTimer) clearTimeout(coupleTimer);
    Object.values(figures).forEach(fig => {
        if (fig.idleTimer) clearTimeout(fig.idleTimer);
        if (fig.celebrateTimer) clearTimeout(fig.celebrateTimer);
        if (fig.walkAnim) fig.walkAnim.cancel();
    });
});

document.addEventListener('click', (e) => {
    if (activeEditPanel && !e.target.closest('.task-edit-panel') && !e.target.closest('.task-item')) {
        closeEditPanel();
    }
});

if (new URLSearchParams(window.location.search).has('reset')) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(ACTIVE_USER_KEY);
    localStorage.removeItem(COLLAPSED_SECTIONS_KEY);
    window.history.replaceState({}, '', window.location.pathname);
    (async () => {
        await connectFirebase();
        await resetCloudState();
        location.reload();
    })();
} else {
    initializeDashboard();
}
