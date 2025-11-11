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