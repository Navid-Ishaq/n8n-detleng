import type { WorkflowValidation } from './types'

type N8nNode = { name?: unknown; type?: unknown; parameters?: unknown }
type N8nWorkflow = { nodes?: unknown; connections?: unknown }
const includesText = (value: unknown, search: string) => String(JSON.stringify(value) ?? '').toLowerCase().includes(search.toLowerCase())

export function validateN8nWorkflowText(text: string): WorkflowValidation {
  let parsed: N8nWorkflow
  try { parsed = JSON.parse(text) as N8nWorkflow } catch { return { passed: false, checks: [{ id: 'json', label: 'Valid JSON', passed: false, detail: 'Could not parse this file as JSON.' }] } }
  const nodes = Array.isArray(parsed.nodes) ? parsed.nodes as N8nNode[] : []
  const connections = parsed.connections && typeof parsed.connections === 'object' ? parsed.connections as Record<string, { main?: unknown }> : {}
  const manual = nodes.find((node) => includesText(node.type, 'manualTrigger'))
  const editNodes = nodes.filter((node) => includesText(node.type, '.set') || includesText(node.type, 'editFields'))
  const ifNode = nodes.find((node) => includesText(node.type, '.if'))
  const ifName = typeof ifNode?.name === 'string' ? ifNode.name : ''
  const mainOutputs = ifName && Array.isArray(connections[ifName]?.main) ? connections[ifName].main as unknown[] : []
  const branchCount = mainOutputs.filter((output) => Array.isArray(output) && output.length > 0).length
  const workflowText = JSON.stringify(parsed)
  const fieldsPassed = ['customerName', 'department', 'priority', 'budget', 'route', 'status'].every((field) => workflowText.includes(field))
  const checks = [
    { id: 'json', label: 'Valid JSON', passed: true },
    { id: 'workflow', label: 'Recognizable n8n workflow structure', passed: nodes.length > 0 && !!parsed.connections, detail: 'No recognizable n8n nodes/connections structure was found.' },
    { id: 'manual', label: 'Manual Trigger found', passed: !!manual, detail: 'Add a Manual Trigger node.' },
    { id: 'edit', label: 'Edit Fields node found', passed: editNodes.length >= 1, detail: 'Add an Edit Fields (Set-style) node for the request data.' },
    { id: 'if', label: 'IF node found', passed: !!ifNode, detail: 'Add an IF node for the priority condition.' },
    { id: 'branches', label: 'Two IF branches found', passed: branchCount >= 2, detail: 'Connect both the true/high and false/normal IF outputs.' },
    { id: 'priority', label: 'priority condition/field found', passed: includesText(ifNode?.parameters, 'priority'), detail: 'Configure the IF condition to inspect the priority field.' },
    { id: 'downstream', label: 'Downstream branch steps found', passed: editNodes.length >= 3, detail: 'Add separate Edit Fields nodes for the escalated and standard branches.' },
    { id: 'fields', label: 'Relevant request and result fields found', passed: fieldsPassed, detail: 'Expected fields: customerName, department, priority, budget, route and status.' },
  ]
  return { passed: checks.every((check) => check.passed), checks }
}

function unwrapOutput(value: unknown): Record<string, unknown> | null {
  if (Array.isArray(value)) return value.length ? unwrapOutput(value[0]) : null
  if (!value || typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  if (record.json && typeof record.json === 'object') return unwrapOutput(record.json)
  return record
}

export function validateExecutionOutput(text: string, expectedRoute: 'escalated' | 'standard') {
  let parsed: unknown
  try { parsed = JSON.parse(text) } catch { return { passed: false, message: 'Could not parse this as JSON.' } }
  const output = unwrapOutput(parsed)
  if (!output) return { passed: false, message: 'Valid JSON received, but no output object was found.' }
  if (output.route !== expectedRoute) return { passed: false, message: `Valid JSON received, but route was '${String(output.route)}'; expected '${expectedRoute}'.` }
  if (output.status !== 'ready') return { passed: false, message: `Route is correct, but status was '${String(output.status)}'; expected 'ready'.` }
  return { passed: true, message: `Passed: route is '${expectedRoute}' and status is 'ready'.` }
}
