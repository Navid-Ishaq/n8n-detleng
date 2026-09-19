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
  const connectedNodeName = (index: number) => {
    const output = mainOutputs[index]
    if (!Array.isArray(output) || !output.length || !output[0] || typeof output[0] !== 'object') return ''
    const name = (output[0] as { node?: unknown }).node
    return typeof name === 'string' ? name : ''
  }
  const trueTargetName = connectedNodeName(0)
  const falseTargetName = connectedNodeName(1)
  const trueTarget = nodes.find((node) => node.name === trueTargetName)
  const falseTarget = nodes.find((node) => node.name === falseTargetName)
  const workflowText = JSON.stringify(parsed)
  const fieldsPassed = ['customerName', 'department', 'priority', 'budget', 'route', 'status'].every((field) => workflowText.includes(field))
  const checks = [
    { id: 'json', label: 'Valid JSON', passed: true },
    { id: 'workflow', label: 'Recognizable n8n workflow structure', passed: nodes.length > 0 && !!parsed.connections, detail: 'No recognizable n8n nodes/connections structure was found.' },
    { id: 'manual', label: 'Manual Trigger found', passed: !!manual, detail: 'Add a Manual Trigger node.' },
    { id: 'edit', label: 'Edit Fields node found', passed: editNodes.length >= 1, detail: 'Add an Edit Fields (Set-style) node for the request data.' },
    { id: 'if', label: 'IF node found', passed: !!ifNode, detail: 'Add an IF node for the priority condition.' },
    { id: 'branches', label: 'Two IF branches found', passed: branchCount >= 2, detail: 'Connect both the true/high and false/normal IF outputs.' },
    { id: 'priority', label: 'IF checks priority equals high', passed: includesText(ifNode?.parameters, 'priority') && includesText(ifNode?.parameters, 'high'), detail: 'Configure the IF condition so priority equals high.' },
    { id: 'true-branch', label: 'TRUE output connects to Escalated', passed: includesText(trueTargetName, 'escalated'), detail: 'Connect the IF true output to the Escalated Edit Fields node.' },
    { id: 'false-branch', label: 'FALSE output connects to Standard', passed: includesText(falseTargetName, 'standard'), detail: 'Connect the IF false output to the Standard Edit Fields node.' },
    { id: 'escalated-values', label: 'Escalated sets route and status', passed: includesText(trueTarget?.parameters, 'route') && includesText(trueTarget?.parameters, 'escalated') && includesText(trueTarget?.parameters, 'status') && includesText(trueTarget?.parameters, 'ready'), detail: 'Escalated must set route = escalated and status = ready.' },
    { id: 'standard-values', label: 'Standard sets route and status', passed: includesText(falseTarget?.parameters, 'route') && includesText(falseTarget?.parameters, 'standard') && includesText(falseTarget?.parameters, 'status') && includesText(falseTarget?.parameters, 'ready'), detail: 'Standard must set route = standard and status = ready.' },
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
