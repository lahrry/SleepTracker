import { SleepRecord } from './sleep-types';

export function calculateAverageSleep(sleepRecords: SleepRecord[]): number {
    if (sleepRecords.length === 0) return 0;
    const totalSleep = sleepRecords.reduce((sum, record) => sum + record.sleep_time, 0);
    return totalSleep / sleepRecords.length;
}

export function filterSleepByDate(sleepRecords: SleepRecord[], date: string): SleepRecord[] {
    return sleepRecords.filter(record => record.date === date);
}
