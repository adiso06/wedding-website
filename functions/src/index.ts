import { onSchedule } from "firebase-functions/v2/scheduler";
import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { applyResetRules, RESET_TIME_ZONE } from "./reset";

initializeApp();

const COLLECTION_NAME = "dashboards";
const DOCUMENT_ID = "hidden-chores-tasklist";

/**
 * The browser also performs this transaction on startup, so the reset is
 * idempotent. Running it at 00:05 ET keeps the board current even when nobody
 * has the dashboard open at midnight.
 */
export const dailyReset = onSchedule(
    {
        schedule: "5 0 * * *",
        timeZone: RESET_TIME_ZONE,
        region: "us-east1"
    },
    async () => {
        const db = getFirestore();
        const docRef = db.collection(COLLECTION_NAME).doc(DOCUMENT_ID);

        await db.runTransaction(async transaction => {
            const snapshot = await transaction.get(docRef);
            if (!snapshot.exists) {
                console.log("No dashboard document found; skipping reset.");
                return;
            }

            const result = applyResetRules(snapshot.data() || {});
            if (!result.changed) {
                console.log("Dashboard already current; no reset needed.");
                return;
            }

            result.archivedDays.forEach(day => {
                transaction.set(docRef.collection("days").doc(day.day), day, { merge: true });
            });

            const state = result.state;
            transaction.update(docRef, {
                taskDefs: state.taskDefs,
                tasks: state.tasks,
                taskActor: state.taskActor,
                taskSkips: state.taskSkips,
                oneTimeTasks: state.oneTimeTasks,
                events: state.events,
                lifetime: state.lifetime,
                lastDailyReset: state.lastDailyReset,
                lastWeeklyReset: state.lastWeeklyReset,
                travel: state.travel || { aditya: false, chhaya: false },
                travelSince: state.travelSince || "",
                lastTravelDay: state.lastTravelDay || "",
                streak: state.streak || 0,
                bestStreak: state.bestStreak || 0,
                streakShieldWeek: state.streakShieldWeek || "",
                weeklyStreak: state.weeklyStreak || 0,
                bestWeeklyStreak: state.bestWeeklyStreak || 0,
                goldenMonths: state.goldenMonths || 0,
                lastMonthProcessed: state.lastMonthProcessed || "",
                dailyHistory: state.dailyHistory,
                updatedAt: FieldValue.serverTimestamp(),
                updatedBy: "cloud-function-reset-v3"
            });

            console.log(`Reset complete; archived ${result.archivedDays.length} day(s).`);
        });
    }
);
