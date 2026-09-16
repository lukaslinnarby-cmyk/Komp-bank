export type ShiftId = "dag" | "kvall" | "natt";

export interface TimeRange { start: string; end: string }
export interface Shift { id: ShiftId; name: string; label: string; start: string; end: string; unpaidBreaks: TimeRange[] }

export const SHIFTS: Shift[] = [
  { id: "dag", name: "Dag", label: "Dagskift", start: "06:30", end: "15:18", unpaidBreaks: [{ start: "11:00", end: "11:30" }] },
  { id: "kvall", name: "Kväll", label: "Kvällsskift", start: "15:18", end: "23:54", unpaidBreaks: [{ start: "18:00", end: "18:30" }] },
  { id: "natt", name: "Natt", label: "Nattskift", start: "21:54", end: "06:30", unpaidBreaks: [] },
];

// Exakt tid saknades i underlaget. Sätt först när den är bekräftad.
export const SUNDAY_NIGHT_UNPAID_BREAK: TimeRange | null = null;
export const getShift = (id: ShiftId) => SHIFTS.find((s) => s.id === id) ?? SHIFTS[0]!;
export const toMinutes = (hhmm: string) => { const [h=0,m=0]=hhmm.split(":").map(Number); return h*60+m; };
const pos = (time: string, start: string) => { const d=toMinutes(time)-toMinutes(start); return d<0?d+1440:d; };
export const shiftEndForDate = (shift: Shift, date: string) => {
  const firstNight = shift.id === "natt" && new Date(`${date}T12:00:00`).getDay() === 0;
  return { ...shift, start: firstNight ? "21:54" : shift.id === "natt" ? "23:54" : shift.start };
};
export const isWeekday = (date: string) => { const d=new Date(`${date}T12:00:00`).getDay(); return d>=1&&d<=5; };
export const isWorkday = (date: string, shiftId: ShiftId) => { const d=new Date(`${date}T12:00:00`).getDay(); return shiftId === "natt" ? d === 0 || (d >= 1 && d <= 4) : d >= 1 && d <= 5; };
export const deductionSeconds = (date: string, shiftId: ShiftId, from: string, to?: string) => {
  const shift=shiftEndForDate(getShift(shiftId), date); const end=to ?? shift.end;
  const a=pos(from,shift.start), b=pos(end,shift.start); if(a<0||b<=a) return null;
  let seconds=(b-a)*60; const unpaid=[...shift.unpaidBreaks];
  if(shiftId==="natt" && new Date(`${date}T12:00:00`).getDay()===0) {
    if(!SUNDAY_NIGHT_UNPAID_BREAK) return null;
    unpaid.push(SUNDAY_NIGHT_UNPAID_BREAK);
  }
  for(const br of unpaid){ const x=pos(br.start,shift.start), y=pos(br.end,shift.start); seconds-=Math.max(0,Math.min(b,y)-Math.max(a,x))*60; }
  return Math.max(0,seconds);
};

export const fullShiftSeconds = (date: string, shiftId: ShiftId) => {
  const shift=shiftEndForDate(getShift(shiftId),date);
  const a=pos(shift.start,shift.start), b=pos(shift.end,shift.start);
  let seconds=(b-a)*60;
  const unpaid=[...shift.unpaidBreaks];
  if(shiftId==="natt" && new Date(`${date}T12:00:00`).getDay()===0 && SUNDAY_NIGHT_UNPAID_BREAK) unpaid.push(SUNDAY_NIGHT_UNPAID_BREAK);
  for(const br of unpaid){const x=pos(br.start,shift.start),y=pos(br.end,shift.start);seconds-=Math.max(0,Math.min(b,y)-Math.max(a,x))*60;}
  return Math.max(0,seconds);
};
