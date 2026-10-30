import { useEffect } from 'react';
import { remindersApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { SLOTS } from '../data/constants';
import { todayISO } from '../utils/helpers';

/**
 * Simulated medicine reminders: polls db.json every 30 seconds with setInterval and
 * shows a toast when the current time falls inside a dose window (30 min after slot time).
 */
export default function useReminderAlerts(userId, enabled = true) {
  const toast = useToast();

  useEffect(() => {
    if (!userId || !enabled) return undefined;

    const check = async () => {
      try {
        const list = await remindersApi.list({ userId });
        const now = new Date();
        const mins = now.getHours() * 60 + now.getMinutes();
        const today = todayISO();
        list.forEach((r) => {
          Object.entries(SLOTS).forEach(([key, slot]) => {
            if (!r[key]) return;
            const [h, m] = slot.time.split(':').map(Number);
            const start = h * 60 + m;
            if (mins < start || mins >= start + 30) return;
            const taken = r.taken?.date === today && r.taken.slots?.includes(key);
            const flag = `alert:${today}:${r.id}:${key}`;
            if (taken || sessionStorage.getItem(flag)) return;
            sessionStorage.setItem(flag, '1');
            toast.info(`Time for ${r.medicine} (${slot.label}, ${r.food.toLowerCase()} food)`);
          });
        });
      } catch { /* server offline - ignore */ }
    };

    check();
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  }, [userId, enabled, toast]);
}
