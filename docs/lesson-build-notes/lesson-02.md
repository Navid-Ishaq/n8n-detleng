# Lesson 02 — verified n8n build notes

Tested manually in the learner's current n8n Cloud editor on 24 September 2026.

## Final workflow

`Start Manually → Create Sample Order → Normalize Order`

- Trigger search result: **Manual Trigger** — “Runs the flow on clicking a button in n8n”
- Data node: **Edit Fields (Set)** — “Modify, add, or remove item fields”
- Sample-data mode: **JSON** — “Customize item output with JSON”
- Normalizer mode: **Manual Mapping**
- Run controls observed: **Execute step** and **Execute workflow**
- Export control: workflow-name **...** menu → **Export JSON**

## Verified output

```json
{
  "customerName": "Ali Khan",
  "customerCountry": "ES",
  "orderId": "ORD-101",
  "itemCount": 2,
  "orderTotal": 125
}
```

The three-item test returned Sara Noor, DE, ORD-202, itemCount 3 and orderTotal 260.

## Verified failures and repairs

- Missing `customer.country`: expression preview showed `undefined`; final JSON showed `null`. The fallback returns `Unknown`.
- Renamed `customer.name` → `customer.fullName`: customerName became `null`. The dual-path fallback restored Ali Khan and still supported the original shape.
- `order.items` supplied as an object instead of an array: JSON remained syntactically valid, but itemCount and orderTotal became `null`. `Array.isArray` guards returned 0.

## Product decision

Lesson 02 teaches JSON directly inside n8n. Test URLs, Production URLs, live Detleng webhook calls and external credentials are not required. Webhook behavior is taught separately in Lesson 04.
