# Next.js Forms Documentation

## Standard Pattern for Forms

All forms in the application must follow this pattern using `useAppForm`, Zod schemas, and server actions.

---

## 1. Client Component - Form

```tsx
"use client";

import { startTransition, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { myAction } from "@/actions/my-action";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { useAppForm } from "@/hooks/form/use-app-form";
import { mySchema, type MySchema } from "@/schemas/my-schema";
import { useActionToast } from "@/hooks/use-action-toast";
import type { ServerActionResult } from "@/types/server-action";

interface MyFormProps {
    // props...
}

export default function MyForm(props: MyFormProps) {
    const [state, formAction, isPending] = useActionState<
        ServerActionResult<ReturnType>,
        MySchema
    >(myAction, null);

    useActionToast(state);

    const form = useAppForm({
        defaultValues: {
            // initial values
        } as MySchema,
        onSubmit: async ({ value }) => {
            startTransition(() => {
                formAction(value);
            });
        },
        validators: {
            onSubmit: mySchema,
        },
    });

    return (
        <form.AppForm>
            <FieldSet>
                <FieldGroup>
                    <form.AppField name="fieldName">
                        {(field) => <field.CustomField label="Label" />}
                    </form.AppField>
                </FieldGroup>
            </FieldSet>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                    Annuler
                </Button>
                <form.FormSubmit label="Enregistrer" isPending={isPending} />
            </DialogFooter>
        </form.AppForm>
    );
}
```

### Key Points

1. **Always use `useAppForm`** from `@/hooks/form/use-app-form`
2. **Always use `useActionState`** with proper generics:
   - First generic: `ServerActionResult<ReturnType>`
   - Second generic: The schema type
3. **Always use `useActionToast`** for automatic success/error toasts
4. **Use `FormSubmit` component** from `form.FormSubmit` for the submit button

### Adding Custom Fields

If a field component doesn't exist, create it in `src/components/form/`:

```tsx
// src/components/form/my-custom-field.tsx
"use client";

import { useFieldContext } from "@/hooks/form/use-app-form";
import {
    Field,
    FieldContent,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface MyCustomFieldProps {
    label: string;
    placeholder?: string;
}

export function MyCustomField({ label, placeholder }: MyCustomFieldProps) {
    const field = useFieldContext<string | undefined>();

    return (
        <Field data-invalid={!field.state.meta.isValid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            <FieldContent>
                <Input
                    aria-invalid={!field.state.meta.isValid}
                    id={field.name}
                    name={field.name}
                    placeholder={placeholder}
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                />
            </FieldContent>
            <FieldError errors={field.state.meta.errors} />
        </Field>
    );
}
```

Then register it in `src/hooks/form/use-app-form.ts`:

```tsx
import { MyCustomField } from "@/components/form/my-custom-field";

// Add to fieldComponents object
fieldComponents: {
    // ... existing fields
    MyCustomField,
},
```

---

## 2. Zod Schema

Create the schema in `src/schemas/`:

```tsx
// src/schemas/my-schema.ts
import { z } from "zod";
import { myConstant, type MyConstantValue } from "@/constants/my-constant";

export const mySchema = z.object({
    id: z.number("L'ID est requis"),
    field1: z.string().optional(),
    field2: z.enum(myConstant.map((c) => c.value)).optional(),
    field3: z.number().nullable().optional(),
});

export type MySchema = z.infer<typeof mySchema>;
```

### Key Points

1. **Always define the schema with Zod**
2. **Export the inferred type** for use in components and actions
3. **Use constants from `@/constants/`** for enums/select options
4. **Make fields optional** with `.optional()` if they are not required

---

## 3. Server Action

Create the action in `src/actions/`:

```tsx
// src/actions/my-action.ts
"use server";

import { mySchema, type MySchema } from "@/schemas/my-schema";
import { revalidatePath } from "next/cache";
import type { ServerActionResult } from "@/types/server-action";
import { createErrorResult } from "@/types/server-action";
import { getPayloadClient } from "@/lib/payload";
import type { MyModel } from "@/payload-types";

export async function myAction(
    _prevState: ServerActionResult<MyModel> | null,
    value: MySchema,
): Promise<ServerActionResult<MyModel>> {
    try {
        // 1. Validate with Zod
        const validationResult = mySchema.safeParse(value);

        if (!validationResult.success) {
            return createErrorResult(
                validationResult.error.message || "Erreur de validation",
            );
        }

        const { id, ...data } = validationResult.data;

        const payload = await getPayloadClient();

        // 2. Perform the action (update, create, etc.)
        const updated = await payload.update({
            collection: "my-collection",
            id,
            data,
        });

        if (!updated) {
            return createErrorResult("Élément non trouvé");
        }

        // 3. Revalidate paths
        revalidatePath("/dashboard/my-path");
        revalidatePath(`/dashboard/my-path/${id}`);

        // 4. Return success with the updated data
        return {
            success: true,
            error: "Mise à jour réussie",
            data: updated,
        };
    } catch (error) {
        console.error("Error in myAction:", error);

        if (error && typeof error === "object" && "message" in error) {
            return createErrorResult(error.message as string);
        }

        return createErrorResult("Erreur lors de la mise à jour");
    }
}
```

### Key Points

1. **Always use `"use server"`** directive at the top
2. **First parameter type**: `ServerActionResult<ReturnType> | null`
3. **Second parameter**: The schema type
4. **Return type**: `Promise<ServerActionResult<ReturnType>>`
5. **Always validate with Zod** at the beginning using `safeParse()`
6. **Always return** `ServerActionResult` with proper typing:
   - `success: true` with `error` (success message) and optional `data`
   - `success: false` with `error` (error message)
7. **Use `createErrorResult()`** helper for error cases
8. **Revalidate paths** after successful mutation
9. **Log errors** to console for debugging

---

## Type Reference

### ServerActionResult

```tsx
// src/types/server-action.ts
export interface ServerActionResult<T = void> {
    success: boolean;
    error?: string;
    zodError?: ZodError;
    data?: T;
}

export type ActionResult = ServerActionResult;
```

---

## Checklist

When creating a new form, verify:

- [ ] Schema created in `src/schemas/` with Zod
- [ ] Server action created with proper types and Zod validation
- [ ] Client component uses `useAppForm`
- [ ] Client component uses `useActionState` with correct generics
- [ ] Client component uses `useActionToast` for notifications
- [ ] Custom fields created in `src/components/form/` if needed
- [ ] Custom fields registered in `src/hooks/form/use-app-form.ts`
- [ ] Form uses `FormSubmit` component for submit button
- [ ] Action returns `ServerActionResult<CorrectType>`
