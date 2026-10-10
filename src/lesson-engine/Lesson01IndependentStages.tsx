import { CheckCircle2, Replace, Split, Zap } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import {
  highTeachingRequest,
  normalTeachingRequest,
  simulateLesson01,
  type TeachingRequest,
} from './lesson01-simulator'
import {
  MirrorInN8nPanel,
  TeachingConnector,
  TeachingExecution,
  TeachingField,
  TeachingJson,
  TeachingNode,
  TeachingRunButton,
  TeachingWorkflow,
  WhyThisWorked,
} from './TeachingWorkflow'

function StageHeader({ number, title, text }: { number:string; title:string; text:string }) {
  return <header className="stage-header"><span>{number}</span><div><h2>{title}</h2><p>{text}</p></div></header>
}

function Continue({ enabled, onClick, children }: { enabled:boolean; onClick:()=>void; children:string }) {
  return <button className="button button--primary lab-primary-action" disabled={!enabled} onClick={onClick}><CheckCircle2 size={19}/>{children}</button>
}

function OptionalN8n({ children }: { children:ReactNode }) {
  return <details className="mirror-panel optional-proof"><summary><span><b>Optional n8n practice</b><small>This does not block lesson progress.</small></span><span>+</span></summary><div className="mirror-panel-body">{children}</div></details>
}

export function Lesson01IndependentBuild({ onDone }: { onDone:()=>void }) {
  const [step,setStep]=useState(0)
  const [request,setRequest]=useState<TeachingRequest>(highTeachingRequest)
  const exact=request.customerName==='Ali Khan'&&request.department==='Support'&&request.priority==='high'&&request.budget===1500
  const advance=(expected:number)=>{ if(step===expected) setStep(expected+1) }
  return <div>
    <StageHeader number="02" title="Build your first workflow twin" text="Create, configure and run every node inside Detleng. Your own n8n is optional practice."/>
    <TeachingWorkflow label="Operations Intake teaching workflow">
      <TeachingNode title="Manual Trigger" type="Trigger" purpose="Starts the workflow when you choose to run it." state={step>0?'passed':'active'}>
        <TeachingRunButton disabled={step!==0} onClick={()=>advance(0)}>Activate Manual Trigger</TeachingRunButton>
      </TeachingNode>
      <TeachingConnector/>
      <TeachingNode title="Create Request" type="Edit Fields" purpose="Creates one item with four fields." state={step>1?'passed':step===1?'active':'ready'}>
        <div className="teaching-fields">
          <TeachingField name="customerName" type="String" value={request.customerName} onChange={(value)=>setRequest({...request,customerName:value})}/>
          <TeachingField name="department" type="String" value={request.department} onChange={(value)=>setRequest({...request,department:value})}/>
          <TeachingField name="priority" type="String" value={request.priority} onChange={(value)=>setRequest({...request,priority:value})}/>
          <TeachingField name="budget" type="Number" value={request.budget} onChange={(value)=>setRequest({...request,budget:Number(value)})}/>
        </div>
        <TeachingRunButton disabled={step!==1||!exact} onClick={()=>advance(1)}>Run Create Request</TeachingRunButton>
        {step>1&&<TeachingJson label="Output" value={request}/>} 
      </TeachingNode>
      <TeachingConnector/>
      <TeachingNode title="Check Priority" type="IF" purpose="Compares priority with high." state={step>2?'passed':step===2?'active':'ready'}>
        <div className="condition-builder"><code>priority</code><span>equals</span><code>high</code></div>
        <TeachingRunButton disabled={step!==2} onClick={()=>advance(2)}>Run Check Priority</TeachingRunButton>
        {step>2&&<TeachingExecution trace={['Create Request','Check Priority','TRUE']} result={{condition:'priority equals high',result:true}}/>}
      </TeachingNode>
      <TeachingConnector label="two branches"/>
      <div className="teaching-branches">
        <TeachingNode title="Escalated" type="TRUE branch" purpose="Returns the high-priority result." state={step>3?'passed':step===3?'active':'ready'}>
          <TeachingRunButton disabled={step!==3} onClick={()=>advance(3)}>Run Escalated</TeachingRunButton>
          {step>3&&<TeachingJson label="Output" value={{route:'escalated',status:'ready'}}/>}
        </TeachingNode>
        <TeachingNode title="Standard" type="FALSE branch" purpose="Returns the normal-priority result." state={step>4?'passed':step===4?'active':'ready'}>
          <TeachingRunButton disabled={step!==4} onClick={()=>advance(4)}>Run Standard</TeachingRunButton>
          {step>4&&<TeachingJson label="Output" value={{route:'standard',status:'ready'}}/>}
        </TeachingNode>
      </div>
    </TeachingWorkflow>
    {step>4&&<WhyThisWorked>You built the complete node chain and inspected its data without needing an external account, URL or credential.</WhyThisWorked>}
    <OptionalN8n><MirrorInN8nPanel title="Mirror the same workflow in n8n" steps={['Add Manual Trigger.','Add Edit Fields and create the four sample fields.','Add IF with priority equals high.','Add Escalated to TRUE and Standard to FALSE.']} expected="The same five-node workflow appears on your n8n canvas."/></OptionalN8n>
    <Continue enabled={step>4} onClick={onDone}>Detleng workflow built</Continue>
  </div>
}

export function Lesson01IndependentRun({ onDone }: { onDone:()=>void }) {
  const [high,setHigh]=useState(false); const [normal,setNormal]=useState(false)
  const highRun=simulateLesson01(highTeachingRequest); const normalRun=simulateLesson01(normalTeachingRequest)
  return <div><StageHeader number="03" title="Run the decision yourself" text="Execute and inspect both branches inside Detleng."/>
    <div className="execution-playground">
      <article><span>High request</span><TeachingJson label="Input" value={highTeachingRequest}/><TeachingRunButton onClick={()=>setHigh(true)}>Run High request</TeachingRunButton>{high&&<TeachingExecution trace={highRun.trace} result={{route:highRun.route,status:highRun.status}}/>}</article>
      <article><span>Normal request</span><TeachingJson label="Input" value={normalTeachingRequest}/><TeachingRunButton onClick={()=>setNormal(true)}>Run Normal request</TeachingRunButton>{normal&&<TeachingExecution trace={normalRun.trace} result={{route:normalRun.route,status:normalRun.status}}/>}</article>
    </div>
    {high&&normal&&<WhyThisWorked>The condition stayed the same. Changing only the priority value selected a different output branch.</WhyThisWorked>}
    <OptionalN8n><MirrorInN8nPanel title="Repeat both runs in n8n" steps={['Run once with priority high.','Run again with priority normal.','Inspect which branch turns green.']} expected="High → Escalated; Normal → Standard."/></OptionalN8n>
    <Continue enabled={high&&normal} onClick={onDone}>Both Detleng routes passed</Continue>
  </div>
}

const mappings=[['customerName','Ali Khan','{{$json.body.customerName}}'],['department','Support','{{$json.body.department}}'],['priority','high','{{$json.body.priority}}'],['budget','1500','{{$json.body.budget}}']]

export function Lesson01IndependentWebhook({ onDone }: { onDone:()=>void }) {
  const [replaced,setReplaced]=useState(false); const [mapped,setMapped]=useState(false)
  return <div><StageHeader number="04" title="Upgrade to a Webhook" text="Replace the manual start and convert fixed values into incoming mappings inside Detleng."/>
    <div className="trigger-replacement"><div><small>Before</small><strong>YOU</strong><span>↓</span><b>Manual Trigger</b></div><button className="button button--primary" onClick={()=>setReplaced(true)}><Replace/> Replace with Webhook</button><div className={replaced?'is-active':''}><small>After</small><strong>External system</strong><span>↓ POST</span><b>Webhook</b></div></div>
    {replaced&&<TeachingWorkflow label="Webhook teaching workflow"><TeachingNode title="Webhook" type="POST trigger" purpose="Receives an event from another system." state="passed"/><TeachingConnector/><TeachingNode title="Create Request" type="Mapped values" purpose="Keeps field names stable while reading values from the body." state={mapped?'passed':'active'}><div className="mapping-table"><div><b>Field name</b><b>Fixed</b><b>Incoming</b></div>{mappings.map(([name,before,after])=><div key={name}><code>{name}</code><span>{before}</span><code>{after}</code></div>)}</div><TeachingRunButton onClick={()=>setMapped(true)}>Apply all mappings</TeachingRunButton>{mapped&&<WhyThisWorked>The output contract stayed stable; only the source of each value changed.</WhyThisWorked>}</TeachingNode></TeachingWorkflow>}
    <OptionalN8n><MirrorInN8nPanel title="Mirror the Webhook upgrade in n8n" steps={['Replace Manual Trigger with Webhook.','Choose POST.','Map all four body values in Create Request.','Keep the IF and both branches unchanged.']} expected="A POST event can enter the same decision workflow."/></OptionalN8n>
    <Continue enabled={replaced&&mapped} onClick={onDone}>Detleng Webhook upgrade complete</Continue>
  </div>
}

export function Lesson01IndependentEvent({ onDone }: { onDone:()=>void }) {
  const [listening,setListening]=useState(false); const [received,setReceived]=useState(false)
  return <div><StageHeader number="05" title="Send your first event" text="Detleng is the sender and receiver, so a Test URL cannot block your progress."/>
    <TeachingWorkflow label="Detleng event journey"><TeachingNode title="Webhook" type="Teaching listener" purpose="Waits for the sample event." state={received?'passed':listening?'active':'ready'}><TeachingRunButton onClick={()=>setListening(true)}>{listening?'Listening in Detleng':'Start listening'}</TeachingRunButton></TeachingNode><TeachingConnector label="sample POST"/><TeachingNode title="Workflow execution" type="Mapped result" purpose="Processes the incoming body through the decision." state={received?'passed':'ready'}>{listening&&<TeachingRunButton onClick={()=>setReceived(true)}>Send sample event</TeachingRunButton>}{received&&<><TeachingJson label="Incoming body" value={highTeachingRequest}/><TeachingExecution trace={['Webhook','Create Request','Check Priority','TRUE','Escalated']} result={{route:'escalated',status:'ready'}}/></>}</TeachingNode></TeachingWorkflow>
    {received&&<WhyThisWorked>The event reached the listener, became one data item and followed the expected route.</WhyThisWorked>}
    <Continue enabled={received} onClick={onDone}>Detleng event received</Continue>
  </div>
}

export function Lesson01IndependentPublish({ onDone }: { onDone:()=>void }) {
  const [published,setPublished]=useState(false); const [connected,setConnected]=useState(false)
  return <div><StageHeader number="06" title="Publish and connect" text="Publish and connect the teaching workflow inside Detleng—no external URL or credential required."/>
    <TeachingWorkflow label="Detleng publishing model"><TeachingNode title="Operations Intake" type={published?'Published workflow':'Draft workflow'} purpose="Moves from editable draft to a stable callable workflow." state={published?'passed':'active'}><TeachingRunButton onClick={()=>setPublished(true)}>{published?'Published in Detleng':'Publish teaching workflow'}</TeachingRunButton>{published&&<TeachingJson label="Teaching endpoint" value={{method:'POST',endpoint:'detleng://lesson-01/operations-intake',status:'published'}}/>}</TeachingNode><TeachingConnector label="connect"/><TeachingNode title="Detleng Connection" type="Learning connection" purpose="Connects the published workflow to the lesson runner." state={connected?'passed':published?'active':'ready'}>{published&&<TeachingRunButton onClick={()=>setConnected(true)}>Connect teaching workflow</TeachingRunButton>}{connected&&<p className="lab-feedback lab-feedback--pass"><CheckCircle2/>Connected inside Detleng.</p>}</TeachingNode></TeachingWorkflow>
    <OptionalN8n><MirrorInN8nPanel title="Publish your real n8n workflow" steps={['Publish or activate your workflow.','Open the Webhook node and select Production URL.','Notice /webhook/ instead of /webhook-test/.']} expected="The workflow can receive events without listening mode."/></OptionalN8n>
    <Continue enabled={connected} onClick={onDone}>Detleng connection ready</Continue>
  </div>
}

export function Lesson01IndependentBreakFix({ onDone }: { onDone:()=>void }) {
  const [high,setHigh]=useState(false); const [normal,setNormal]=useState(false); const [broken,setBroken]=useState(false); const [repaired,setRepaired]=useState(false)
  const healthy=simulateLesson01(highTeachingRequest); const ordinary=simulateLesson01(normalTeachingRequest); const mismatch=simulateLesson01(highTeachingRequest,'priorityLevel')
  return <div><StageHeader number="07" title="Test, break, diagnose and repair" text="Finish the complete engineering loop inside Detleng."/>
    <div className="execution-playground"><article><span>High route</span><TeachingRunButton onClick={()=>setHigh(true)}>Run High test</TeachingRunButton>{high&&<TeachingExecution trace={healthy.trace} result={{route:healthy.route,status:healthy.status}}/>}</article><article><span>Normal route</span><TeachingRunButton onClick={()=>setNormal(true)}>Run Normal test</TeachingRunButton>{normal&&<TeachingExecution trace={ordinary.trace} result={{route:ordinary.route,status:ordinary.status}}/>}</article></div>
    {high&&normal&&<section className="contract-twin"><header><Split/><div><small>Detleng contract lab</small><h3>Break the producer-consumer agreement</h3></div></header><div className="contract-compare"><article><span>Producer</span><code>{broken&&!repaired?'priorityLevel':'priority'} = high</code></article><b className={broken&&!repaired?'is-mismatch':'is-match'}>{broken&&!repaired?'MISMATCH ✕':'MATCH ✓'}</b><article><span>Consumer</span><code>looking for priority</code></article></div><div className="contract-actions"><button className="button button--warning" onClick={()=>{setBroken(true);setRepaired(false)}}><Zap/> Break field name</button><button className="button button--light" disabled={!broken} onClick={()=>setRepaired(true)}><Replace/> Restore priority</button></div>{broken&&!repaired&&<TeachingExecution trace={mismatch.trace} result={{expected:'escalated',actual:mismatch.route,cause:'priorityLevel does not match priority'}}/>}{repaired&&<><TeachingExecution trace={healthy.trace} result={{route:healthy.route,status:healthy.status,repair:'priority restored'}}/><WhyThisWorked>The network was healthy. The failure came from two nodes disagreeing on one field name.</WhyThisWorked></>}</section>}
    <OptionalN8n><MirrorInN8nPanel title="Repeat the break and repair in n8n" steps={['Rename priority to priorityLevel in Create Request.','Keep IF looking for priority and run.','Inspect the wrong route.','Restore priority and run both routes again.']} expected="You can explain and repair the contract mismatch."/></OptionalN8n>
    <Continue enabled={high&&normal&&broken&&repaired} onClick={onDone}>Detleng repair verified</Continue>
  </div>
}
