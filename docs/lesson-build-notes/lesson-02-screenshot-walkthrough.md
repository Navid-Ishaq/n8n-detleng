# Lesson 02 — Verified Screenshot Walkthrough

This document preserves the visual evidence used to redesign Lesson 02. The screenshots follow the learner's actual n8n journey and verify the current interface labels, expressions, outputs, failure modes, repairs, dynamic test, and export path.

> These screenshots provide visual support and product evidence. Learners still perform every action inside their own n8n instance.

## 1. Explore Edit Fields

### Choose Manual Mapping or JSON

![Mode menu showing Manual Mapping and JSON](lesson-02-screenshots/01-mode-menu.png)

### Open the JSON editor

![JSON mode starter editor](lesson-02-screenshots/02-json-mode-starter.png)

## 2. Create and inspect the sample order

### Inspect the sample in Table view

![Sample order table output](lesson-02-screenshots/03-sample-order-table.png)

### Inspect the same sample in JSON view

![Sample order JSON output](lesson-02-screenshots/04-sample-order-json.png)

### Confirm the initial two-node workflow

![Manual Trigger connected to Create Sample Order](lesson-02-screenshots/05-two-node-workflow.png)

### Use the node context menu while building

![Node context menu](lesson-02-screenshots/06-node-context-menu.png)

## 3. Build Normalize Order

### Read the incoming schema

![Create Sample Order input schema](lesson-02-screenshots/07-normalizer-input-schema.png)

### Add the first field

![Add Field control](lesson-02-screenshots/08-add-field.png)

### Map `customerName`

![customerName expression and preview](lesson-02-screenshots/09-customer-name.png)

### Map the three string fields

![customerName customerCountry and orderId](lesson-02-screenshots/10-three-string-fields.png)

### Select the correct field type

![Field type menu](lesson-02-screenshots/11-field-type-menu.png)

### Calculate `itemCount`

![itemCount expression](lesson-02-screenshots/12-item-count.png)

### Calculate `orderTotal`

![orderTotal reduce expression](lesson-02-screenshots/13-order-total.png)

### Verify the five-field output

![Normalized five-field output](lesson-02-screenshots/14-normalized-output.png)

### Confirm the completed three-node workflow

![Start Manually Create Sample Order Normalize Order](lesson-02-screenshots/15-three-node-workflow.png)

## 4. Repair a missing country

### Observe `null` when country is missing

![Missing country null output](lesson-02-screenshots/16-missing-country-null.png)

### Add the `Unknown` fallback

![customerCountry fallback to Unknown](lesson-02-screenshots/17-country-fallback.png)

### Restore country and verify `ES`

![Restored country output](lesson-02-screenshots/18-country-restored.png)

## 5. Repair a renamed customer field

### Rename `name` to `fullName` and observe the failure

![Renamed name field causing null](lesson-02-screenshots/19-name-renamed-failure.png)

### Add a dual-path fallback

![customerName dual fallback expression](lesson-02-screenshots/20-name-dual-fallback.png)

### Restore the original sample shape

![Original customer name restored](lesson-02-screenshots/21-name-restored.png)

### Confirm the workflow still executes

![Successful workflow after repair](lesson-02-screenshots/22-workflow-success.png)

## 6. Repair an invalid `items` shape

### Replace the array with an object and observe the result

![Invalid items shape producing null calculations](lesson-02-screenshots/23-items-object-failure.png)

The payload remains valid JSON, but it no longer matches the structure expected by the expressions.

### Guard calculations with `Array.isArray()`

![Array guards returning zero](lesson-02-screenshots/24-array-guards.png)

### Restore the items array

![Items array restored and totals correct](lesson-02-screenshots/25-items-restored.png)

## 7. Explore array indexing

These two fields were temporary teaching experiments and are not part of the final five-field contract.

### Read the first item name

![First item name expression](lesson-02-screenshots/26-first-item-name.png)

### Keep the first item price as a number

![First item price as Number](lesson-02-screenshots/27-first-item-price.png)

### Return to the five-field contract

![Optional fields removed](lesson-02-screenshots/28-five-field-contract.png)

## 8. Run a different order

### Verify Sara Noor, three items, and total 260

![Dynamic order test output](lesson-02-screenshots/29-dynamic-test-output.png)

### Inspect the dynamic test payload

![Sara Noor sample payload](lesson-02-screenshots/30-dynamic-test-payload.png)

### Restore the original Ali Khan sample

![Original Ali Khan sample restored](lesson-02-screenshots/31-original-sample-restored.png)

## 9. Export the completed workflow

### Open the workflow menu and choose Export JSON

![Workflow menu with Export JSON](lesson-02-screenshots/32-export-json-menu.png)

## Verified result

The final lesson intentionally uses this simple local workflow:

```text
Start Manually → Create Sample Order → Normalize Order
```

The required normalized output is:

```json
{
  "customerName": "Ali Khan",
  "customerCountry": "ES",
  "orderId": "ORD-101",
  "itemCount": 2,
  "orderTotal": 125
}
```

Lesson 02 requires no Webhook URL, Production URL, external credential, or live Detleng checkpoint.
