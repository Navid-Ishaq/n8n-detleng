import type { Session } from '@supabase/supabase-js'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

export type CapstoneEvent = { sequence:number; type:string; actor:string; outcome:string; message:string; details:Record<string,unknown>; at:string }
export type CapstoneRun = {
  id:string; lessonAttemptNumber:number; scenarioKey:string; requestType:string; input:Record<string,unknown>; classification:Record<string,unknown>|null;
  aiUsed:boolean; ragUsed:boolean; citations:string[]; riskLevel:string|null; approvalRequired:boolean; approval:{status:string;reason:string|null;requestedAt:string;decidedAt:string|null}|null;
  decision:string|null; actionState:string; retryCount:number; errorCode:string|null; status:string; startedAt:string; completedAt:string|null; durationMs:number|null;
  events:CapstoneEvent[]; actions:{type:string;status:string;receipt:string|null;executedAt:string|null}[]
}
export type Monitoring = { totalRuns:number; successful:number; pendingApprovals:number; rejected:number; handledFailures:number; averageDurationMs:number }

async function request<T>(path:string, session:Session|null, init:RequestInit={}) {
  if (!apiBaseUrl) throw new Error('The live capstone API is not configured.')
  if (!session?.access_token) throw new Error('Please log in again.')
  const response=await fetch(`${apiBaseUrl}${path}`,{...init,headers:{authorization:`Bearer ${session.access_token}`,'content-type':'application/json',...(init.headers||{})}})
  const data=await response.json().catch(()=>({})) as T&{error?:string}
  if(!response.ok) throw new Error(data.error||'The capstone service could not complete this request.')
  return data
}

export const capstoneApi = {
  start:(session:Session|null, body:Record<string,unknown>)=>request<{runId:string;status:string}>('/api/lessons/production-capstone/runs',session,{method:'POST',body:JSON.stringify(body)}),
  get:(session:Session|null,id:string)=>request<{run:CapstoneRun}>(`/api/lessons/production-capstone/runs/${id}`,session),
  list:(session:Session|null,attempt:number)=>request<{runs:CapstoneRun[]}>(`/api/lessons/production-capstone/attempts/${attempt}/runs`,session),
  decide:(session:Session|null,id:string,decision:'approve'|'reject')=>request<{run:CapstoneRun}>(`/api/lessons/production-capstone/runs/${id}/${decision}`,session,{method:'POST',body:'{}'}),
  verify:(session:Session|null,id:string)=>request<{verification:{passed:boolean;scenarioKey:string}}>(`/api/lessons/production-capstone/runs/${id}/verify`,session,{method:'POST',body:'{}'}),
  monitoring:(session:Session|null)=>request<{monitoring:Monitoring}>('/api/lessons/production-capstone/monitoring',session),
  seed:(session:Session|null)=>request<{embedded:number;message:string}>('/api/lessons/production-capstone/knowledge/seed',session,{method:'POST',body:'{}'}),
}

