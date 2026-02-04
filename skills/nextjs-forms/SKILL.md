---
name: nextjs-forms
description: Next.js form patterns using useAppForm, useActionState, useActionToast. Use when creating or modifying forms, form components, or server actions for forms.
---

# Next.js Forms Pattern

All forms must follow this pattern using `useAppForm`, Zod schemas, and server actions.

## Quick Checklist

When creating a new form:
- Schema in `src/schemas/` with Zod + exported type
- Server action with proper `ServerActionResult` typing
- Client component with `useAppForm` + `useActionState` + `useActionToast`
- Custom fields in `src/components/form/` if needed
- Register custom fields in `src/hooks/form/use-app-form.ts`

## File Structure

```
src/
├── schemas/
│   └── my-schema.ts          # Zod schema + exported type
├── actions/
│   └── my-action.ts          # Server action with "use server"
├── components/
│   └── form/
│       └── my-custom-field.tsx  # Custom field components
└── hooks/
    └── form/
        └── use-app-form.ts   # Register custom fields here
```

---

## 1. Client Component Form

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

export default function MyForm() {
    const [state, formAction, isPending] = useActionState<
        ServerActionResult<ReturnType>,
        MySchema
    >(myAction, null);

    useActionToast(state);

    const form = useAppForm({
        defaultValues: {} as MySchema,
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
                <form.FormSubmit label="Enregistrer" isPending={isPending} />
            </DialogFooter>
        </form.AppForm>
    );
}
```

**Key Points:**
- Always use `useAppForm` from `@/hooks/form/use-app-form`
- Always use `useActionState` with: `ServerActionResult<ReturnType>` + Schema type
- Always use `useActionToast` for automatic success/error toasts
- Use `FormSubmit` component from `form.FormSubmit`

---

## 2. Zod Schema

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

**Key Points:**
- Always export the inferred type for components and actions
- Use constants from `@/constants/` for enums/select options
- Make fields optional with `.optional()` when not required

---

## 3. Server Action

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

        // 2. Perform the action
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

        // 4. Return success
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

**Key Points:**
- Always use `"use server"` directive at the top
- First parameter: `ServerActionResult<ReturnType> | null`
- Second parameter: The schema type
- Always validate with Zod using `safeParse()`
- Return `ServerActionResult` with proper typing
- Use `createErrorResult()` helper for errors
- Revalidate paths after successful mutation
- Log errors to console

---

## 4. Custom Field Component

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

fieldComponents: {
    // ... existing fields
    MyCustomField,
},
```

---

## Type Reference

```tsx
// src/types/server-action.ts
export interface ServerActionResult<T = void> {
    success: boolean;
    error?: string;
    zodError?: ZodError;
    data?: T;
}
```
