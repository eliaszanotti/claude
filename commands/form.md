# Form Guidelines

## Mandatory structure for all form fields

Always respect this exact hierarchy:

```
FieldSet > FieldGroup (optional, if multiple groups) > Field (never FieldContent inside) > FieldLabel, FieldDescription, Input, Select, etc
```

## Special case: Checkboxes

For checkboxes, always use this structure:

```jsx
<Field orientation="horizontal">
	<Checkbox id="unique-id" />
	<FieldLabel htmlFor="unique-id" className="font-normal">
		Label text
	</FieldLabel>
</Field>
```

-   Always use `orientation="horizontal"`
-   The checkbox must always be BEFORE the label
-   The FieldLabel's `htmlFor` must match the Checkbox's `id`

## Error handling

Always use `FieldError` to display errors:

```jsx
<FieldError errors={errorsArray} />
```

Accepted props:

-   `errors`: Array<{ message?: string } | undefined> (optional)
-   `className`: string (optional)

Perfect integration with useActionState and getFieldError according to project guidelines.

## Gestion des Erreurs avec Actions

### Helper pour FormErrors

```typescript
// lib/form-errors.ts
import type { ActionState } from "@/utils/action-state-types";

export function getFieldErrorsForField(
	state: ActionState | null,
	fieldName: string
) {
	if (!state || !state.errors) return [];

	const error = state.errors.find((error) => error.field === fieldName);
	return error ? [{ message: error.message }] : [];
}

export function getGlobalErrors(state: ActionState | null) {
	return state?.errors?.filter((e) => e.field === "global") || [];
}
```

### Utilisation avec useActionState

```tsx
"use client";

import { useActionState } from "react-dom";
import { getFieldError } from "@/lib/form-utils";
import { myAction } from "@/actions/my-action";
import { FieldError } from "@/components/ui/field";

export function MyForm() {
	const [state, formAction] = useActionState(myAction, null);

	return (
		<form action={formAction}>
			<div>
				<label>Email</label>
				<input name="email" type="email" />
				<FieldError errors={getFieldErrorsForField(state, "email")} />
			</div>

			<FieldError
				errors={getGlobalErrors(state)}
				className="global-error"
			/>

			{state?.success && <div className="success">{state.message}</div>}
		</form>
	);
}
```
