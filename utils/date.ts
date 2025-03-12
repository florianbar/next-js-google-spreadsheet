export function getTodayISOString(): string {
    const now = new Date();
    const isoDateTime = now.toISOString().slice(0, 19);
    return isoDateTime;
}