import { ArrowLeft, ArrowRight, Camera, ExternalLink, LogOut, Network } from 'lucide-react'
import { Footer } from '../components/Footer'
import { useAuth } from '../context/AuthContext'

type VisualStep = { title: string; note: string; image: string }
type VisualSection = { id: string; title: string; purpose: string; steps: VisualStep[] }

const screenshotModules = import.meta.glob('../../docs/lesson-build-notes/lesson-02-screenshots/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const shot = (file: string) => screenshotModules[`../../docs/lesson-build-notes/lesson-02-screenshots/${file}`]

const lesson02VisualSections: VisualSection[] = [
  { id:'modes', title:'1. Understand Edit Fields', purpose:'See where JSON mode and Manual Mapping live before changing any data.', steps:[
    {title:'Choose a mode',note:'The Mode menu contains Manual Mapping and JSON.',image:shot('01-mode-menu.png')},
    {title:'Open JSON mode',note:'The JSON editor accepts one complete object.',image:shot('02-json-mode-starter.png')},
  ]},
  { id:'sample', title:'2. Create the sample order', purpose:'Build known input first, execute it, and inspect the same item in two views.', steps:[
    {title:'Inspect Table view',note:'Nested customer and order values are visible as one item.',image:shot('03-sample-order-table.png')},
    {title:'Inspect JSON view',note:'JSON view makes braces, arrays, and nesting explicit.',image:shot('04-sample-order-json.png')},
    {title:'Confirm two nodes',note:'Start Manually flows into Create Sample Order.',image:shot('05-two-node-workflow.png')},
    {title:'Use the node menu',note:'The context menu provides rename, duplicate, and execute actions.',image:shot('06-node-context-menu.png')},
  ]},
  { id:'normalize', title:'3. Build Normalize Order', purpose:'Turn nested input into a small five-field contract.', steps:[
    {title:'Read the input schema',note:'Confirm the customer and order paths before mapping.',image:shot('07-normalizer-input-schema.png')},
    {title:'Add a field',note:'Use Add Field once for each normalized output value.',image:shot('08-add-field.png')},
    {title:'Map customerName',note:'The expression preview should resolve to Ali Khan.',image:shot('09-customer-name.png')},
    {title:'Map string fields',note:'Add customerName, customerCountry, and orderId.',image:shot('10-three-string-fields.png')},
    {title:'Choose field types',note:'Names and IDs are strings; counts and totals are numbers.',image:shot('11-field-type-menu.png')},
    {title:'Calculate itemCount',note:'Read the length of the items array.',image:shot('12-item-count.png')},
    {title:'Calculate orderTotal',note:'Reduce the array by adding quantity multiplied by price.',image:shot('13-order-total.png')},
    {title:'Verify the output',note:'The expected total is 125 and the expected item count is 2.',image:shot('14-normalized-output.png')},
    {title:'Confirm three nodes',note:'The complete learning workflow now has three connected nodes.',image:shot('15-three-node-workflow.png')},
  ]},
  { id:'country', title:'4. Repair a missing country', purpose:'Experience a missing value, add a fallback, and restore the sample.', steps:[
    {title:'Observe null',note:'Removing country makes the original path undefined and the output null.',image:shot('16-missing-country-null.png')},
    {title:'Add Unknown',note:'The fallback keeps the output contract predictable.',image:shot('17-country-fallback.png')},
    {title:'Restore ES',note:'Restore the original value and confirm the expression still works.',image:shot('18-country-restored.png')},
  ]},
  { id:'name', title:'5. Repair a renamed field', purpose:'Handle schema drift when one source calls the same value fullName.', steps:[
    {title:'Rename the input',note:'Changing name to fullName breaks the original path.',image:shot('19-name-renamed-failure.png')},
    {title:'Add dual fallback',note:'Try name, then fullName, then Unknown.',image:shot('20-name-dual-fallback.png')},
    {title:'Restore the sample',note:'Return to the original input after proving the repair.',image:shot('21-name-restored.png')},
    {title:'Confirm success',note:'The complete workflow should execute successfully again.',image:shot('22-workflow-success.png')},
  ]},
  { id:'items', title:'6. Repair an invalid items shape', purpose:'Learn that valid JSON can still have the wrong shape for an expression.', steps:[
    {title:'Replace the array',note:'An object is valid JSON, but length and reduce no longer match it.',image:shot('23-items-object-failure.png')},
    {title:'Add array guards',note:'Array.isArray() safely returns zero for the wrong shape.',image:shot('24-array-guards.png')},
    {title:'Restore the array',note:'The original count and total return after the repair.',image:shot('25-items-restored.png')},
  ]},
  { id:'indexing', title:'7. Explore array indexing', purpose:'Temporarily read one item directly, then return to the required contract.', steps:[
    {title:'Read the first name',note:'Array index 0 selects the first item: Keyboard.',image:shot('26-first-item-name.png')},
    {title:'Read the first price',note:'Set the field type to Number so 50 remains numeric.',image:shot('27-first-item-price.png')},
    {title:'Remove optional fields',note:'Return to the five fields required by the lesson.',image:shot('28-five-field-contract.png')},
  ]},
  { id:'dynamic', title:'8. Run a different order', purpose:'Prove the expressions calculate from data rather than memorized values.', steps:[
    {title:'Verify the new result',note:'Sara Noor has 3 items with an order total of 260.',image:shot('29-dynamic-test-output.png')},
    {title:'Inspect the new payload',note:'Monitor, Cable, and Adapter produce the new total.',image:shot('30-dynamic-test-payload.png')},
    {title:'Restore Ali Khan',note:'Return to the original sample before export.',image:shot('31-original-sample-restored.png')},
  ]},
  { id:'export', title:'9. Export the workflow', purpose:'Save a portable workflow JSON after the final execution succeeds.', steps:[
    {title:'Choose Export JSON',note:'Open the workflow menu and select Export JSON.',image:shot('32-export-json-menu.png')},
  ]},
]

export function Lesson02VisualGuide() {
  const { logout } = useAuth()
  return <div className="portal-page visual-guide-page">
    <header className="portal-header"><a className="back-link" href="/lessons/json"><ArrowLeft size={18}/> Lesson 02</a><div className="portal-header-actions"><a className="brand brand--compact" href="/"><span className="brand-mark"><Network size={19}/></span><span>n8n <strong>Detleng</strong></span></a><button className="button button--ghost" onClick={()=>void logout()}><LogOut size={17}/> Log out</button></div></header>
    <main className="portal-main visual-guide-shell">
      <section className="visual-guide-hero"><div><p className="eyebrow">Lesson 02 · Optional Visual Companion</p><h1>Build it with the real screens beside you.</h1><p>This guide follows the same practical lesson without creating separate progress. Keep n8n open in another window, match each screen, and return to Lesson 02 whenever you are ready to confirm a stage.</p><div className="visual-guide-actions"><a className="button button--primary" href="/lessons/json">Continue Lesson 02 <ArrowRight size={17}/></a><a className="button button--light" href="#visual-steps">Browse screenshots <Camera size={17}/></a></div></div><aside><strong>How to use this guide</strong><ol><li>Read the action in Lesson 02.</li><li>Use the matching screenshot here.</li><li>Perform the action in your own n8n.</li><li>Verify your output, then continue.</li></ol><small>This page does not alter lesson progress.</small></aside></section>
      <nav className="visual-guide-nav" aria-label="Visual guide sections">{lesson02VisualSections.map(section=><a key={section.id} href={`#${section.id}`}>{section.title.replace(/^\d+\. /,'')}</a>)}</nav>
      <div className="visual-guide-sections" id="visual-steps">{lesson02VisualSections.map(section=><section className="visual-guide-section" id={section.id} key={section.id}><header><p className="eyebrow">Visual checkpoint</p><h2>{section.title}</h2><p>{section.purpose}</p></header><div className="visual-shot-grid">{section.steps.map((step,index)=><figure className="visual-shot" key={step.image}><a href={step.image} target="_blank" rel="noreferrer"><img src={step.image} alt={step.title} loading="lazy"/><span>Open full size <ExternalLink size={15}/></span></a><figcaption><b>{String(index+1).padStart(2,'0')}</b><div><strong>{step.title}</strong><p>{step.note}</p></div></figcaption></figure>)}</div></section>)}</div>
      <section className="visual-guide-finish"><div><p className="eyebrow">Return to the practical lab</p><h2>Screenshots guide you. Your own workflow proves the learning.</h2><p>Nothing on this page changes or duplicates Lesson 02 progress.</p></div><a className="button button--dark" href="/lessons/json">Return to Lesson 02 <ArrowRight size={17}/></a></section>
    </main><Footer/>
  </div>
}
