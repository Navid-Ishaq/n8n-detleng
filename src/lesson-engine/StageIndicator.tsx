import { AlertTriangle, Check, Circle } from 'lucide-react'
import type { StageState } from './types'

type Stage = { id: string; label: string }

export function StageIndicator({ stages, current, states, onSelect, isEnabled }: { stages: readonly Stage[]; current: string; states: Record<string, StageState>; onSelect: (id: string) => void; isEnabled: (id: string) => boolean }) {
  return <nav className="lab-stage-nav" aria-label="Lesson stages">{stages.map((stage, index) => {
    const state = states[stage.id] ?? 'not_started'
    const enabled = isEnabled(stage.id)
    return <button type="button" className={`lab-stage lab-stage--${state} ${current === stage.id ? 'is-current' : ''}`} onClick={() => onSelect(stage.id)} disabled={!enabled} key={stage.id} aria-current={current === stage.id ? 'step' : undefined}>
      <span>{state === 'passed' ? <Check size={16}/> : state === 'needs_attention' ? <AlertTriangle size={16}/> : <Circle size={14}/>}</span><small>{String(index + 1).padStart(2, '0')}</small>{stage.label}
    </button>
  })}</nav>
}
