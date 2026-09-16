import type { ShiftId } from "./shifts";
import { fullShiftSeconds, isWorkday } from "./shifts";

export type EntryType = "auto" | "ledig" | "start" | "justering" | "full_comp" | "leave_early" | "paid_leave" | "vacation_day";
export type CalendarType = "LEDIG" | "PAID_LEAVE" | "VACATION_DAY" | "FULL_COMP_DAY" | "LEAVE_EARLY";
export const ACCRUAL_SEC: Record<ShiftId,number>={dag:2520,kvall:2520,natt:1164};
export const ACCRUAL_MIN: Record<ShiftId,number>={dag:42,kvall:42,natt:19.4};
export const SHIFT_NAME: Record<ShiftId,string>={dag:"Dag",kvall:"Kväll",natt:"Natt"};
export interface HistoryEntry { id:string; date:string; deltaSec:number; type:EntryType; label:string; balanceAfterSec:number; manual:boolean; calendarEntryId?:string }
export interface CalendarEntry { id:string; date:string; type:CalendarType; shift:ShiftId; shiftStart:string; shiftEnd:string; leaveTime?:string; deductionSec:number; balanceEffectSec?:number; createdAt:string; updatedAt:string }
export interface KompState { initialized:boolean; balanceSec:number; lastAccrual:string; shift:ShiftId; history:HistoryEntry[]; calendar:CalendarEntry[]; vacationStartWeek:number; vacationEndWeek:number; version:4 }
const KEY="kompsaldo:v1";
export const todayKey=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const parts=(date:string):[number,number,number]=>{const [y=1970,m=1,d=1]=date.split("-").map(Number);return[y,m,d]};
export const daysBetween=(from:string,to:string)=>{const [fy,fm,fd]=parts(from),[ty,tm,td]=parts(to);return Math.floor((Date.UTC(ty,tm-1,td)-Date.UTC(fy,fm-1,fd))/86400000)};
// Kept explicit to avoid timezone/DST drift.
export const addDays=(date:string,n:number)=>{const[y,m,d]=parts(date);const x=new Date(Date.UTC(y,m-1,d+n));return `${x.getUTCFullYear()}-${String(x.getUTCMonth()+1).padStart(2,"0")}-${String(x.getUTCDate()).padStart(2,"0")}`};
export const defaultState=():KompState=>({initialized:false,balanceSec:0,lastAccrual:todayKey(),shift:"dag",history:[],calendar:[],vacationStartWeek:29,vacationEndWeek:32,version:4});
export const formatHmSec=(sec:number)=>{const sign=sec<0?"−":"";const mins=Math.round(Math.abs(sec)/60),h=Math.floor(mins/60),m=mins%60;return h===0?`${sign}${m} min`:m===0?`${sign}${h} h`:`${sign}${h} h ${m} min`};
export const formatExactMin=(minutes:number)=>{const v=Math.round(minutes*10)/10,s=Number.isInteger(v)?String(v):v.toFixed(1).replace(".",",");return `${v>=0?"+":""}${s} min`};
export const parseHours=(raw:string)=>{const n=Number(raw.trim().replace(",",".").replace(/\s/g,""));return raw.trim()&&Number.isFinite(n)?n:null};
const newId=()=>`${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
const normalizeType=(t:any):CalendarType=>t==="SCHEDULED_OFF"?"LEDIG":t==="SICK"?"PAID_LEAVE":t;
const migrate=(raw:any):KompState=>{const base=defaultState();let balanceSec=typeof raw?.balanceSec==="number"?raw.balanceSec:typeof raw?.balanceMin==="number"?Math.round(raw.balanceMin*60):typeof raw?.balance==="number"?Math.round(raw.balance*3600):0;const calendar=(raw?.calendar??[]).map((e:any)=>{const wasSick=e.type==="SICK";const oldEffect=typeof e.balanceEffectSec==="number"?e.balanceEffectSec:(e.deductionSec?-e.deductionSec:0);if(wasSick)balanceSec-=oldEffect;return {...e,type:normalizeType(e.type),balanceEffectSec:wasSick?0:oldEffect}});return {...base,...raw,balanceSec,calendar,history:Array.isArray(raw?.history)?raw.history:[],vacationStartWeek:raw?.vacationStartWeek??29,vacationEndWeek:raw?.vacationEndWeek??32,version:4};};
export const load=():KompState=>{if(typeof window==="undefined")return defaultState();try{const raw=localStorage.getItem(KEY);return raw?migrate(JSON.parse(raw)):defaultState()}catch{return defaultState()}};
export const save=(s:KompState)=>{if(typeof window!=="undefined")try{localStorage.setItem(KEY,JSON.stringify(s))}catch{}};
export const clearAll=()=>{if(typeof window!=="undefined")localStorage.removeItem(KEY)};
export const isoWeek=(date:string)=>{const d=new Date(`${date}T12:00:00`);const x=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const day=x.getUTCDay()||7;x.setUTCDate(x.getUTCDate()+4-day);const y=new Date(Date.UTC(x.getUTCFullYear(),0,1));return Math.ceil((((x.getTime()-y.getTime())/86400000)+1)/7)};
export const isCompanyVacation=(s:KompState,date:string)=>{const w=isoWeek(date);return s.vacationStartWeek<=s.vacationEndWeek?w>=s.vacationStartWeek&&w<=s.vacationEndWeek:w>=s.vacationStartWeek||w<=s.vacationEndWeek};
const blocksAccrual=(s:KompState,date:string)=>isCompanyVacation(s,date)||s.calendar.some(e=>e.date===date&&e.type==="VACATION_DAY");
export const applyAccrual=(state:KompState):KompState=>{if(!state.initialized)return state;const today=todayKey(),missing=daysBetween(state.lastAccrual,today);if(missing<=0)return state;let balanceSec=state.balanceSec;const entries:HistoryEntry[]=[];for(let i=1;i<=missing;i++){const date=addDays(state.lastAccrual,i);if(!isWorkday(date,state.shift)||blocksAccrual(state,date)||state.history.some(h=>h.type==="auto"&&h.date===date))continue;const deltaSec=ACCRUAL_SEC[state.shift];balanceSec+=deltaSec;entries.push({id:newId(),date,deltaSec,type:"auto",label:`Automatisk intjäning – ${SHIFT_NAME[state.shift]}`,balanceAfterSec:balanceSec,manual:false})}return{...state,balanceSec,lastAccrual:today,history:[...entries.reverse(),...state.history]}};
const autoForDate=(s:KompState,date:string)=>s.history.find(h=>h.type==="auto"&&h.date===date);
const effectFor=(s:KompState,e:CalendarEntry)=>{if(e.type==="VACATION_DAY"){const auto=autoForDate(s,e.date);return auto?-auto.deltaSec:0}if(e.type==="LEDIG"||e.type==="FULL_COMP_DAY"||e.type==="LEAVE_EARLY")return -e.deductionSec;return 0};
export const upsertCalendar=(s:KompState,e:CalendarEntry):KompState=>{const old=s.calendar.find(x=>x.date===e.date);let next=s;if(old){next={...next,balanceSec:next.balanceSec-(old.balanceEffectSec??0),history:next.history.filter(h=>h.calendarEntryId!==old.id)}}const clean={...e,id:old?.id??e.id,createdAt:old?.createdAt??e.createdAt};const effect=effectFor(next,clean);const saved={...clean,balanceEffectSec:effect};return{...next,balanceSec:next.balanceSec+effect,calendar:[...next.calendar.filter(x=>x.date!==e.date),saved]}};
export const removeCalendar=(s:KompState,id:string):KompState=>{const e=s.calendar.find(x=>x.id===id);if(!e)return s;return{...s,balanceSec:s.balanceSec-(e.balanceEffectSec??0),calendar:s.calendar.filter(x=>x.id!==id),history:s.history.filter(h=>h.calendarEntryId!==id)}};
export const pruneOldCalendar=(s:KompState):KompState=>{const cutoff=new Date();cutoff.setMonth(cutoff.getMonth()-3);cutoff.setHours(0,0,0,0);const calendar=s.calendar.filter(e=>new Date(`${e.date}T12:00:00`)>=cutoff);return calendar.length===s.calendar.length?s:{...s,calendar}};
export const fullDayDeduction=(date:string,shift:ShiftId)=>fullShiftSeconds(date,shift);
export const makeId=newId;
