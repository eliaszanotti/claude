# Form & Action Guidelines

## Règle Fondamentale

Toutes les actions serveur DOIVENT utiliser `useActionState` de Next.js (et non pas `useFormState`).

## Structure de Fichiers Obligatoire

### 1. ActionState Types (COPIER EXACTEMENT)

Dans `/src/types/action-state.ts` :

```typescript
export type ActionError = {
	field: string;
	code: string;
	message: string;
};

export type ActionState<T = unknown, R = unknown> = {
	success: boolean;
	message?: string;
	data?: T;
	errors?: ActionError[];
	return?: R;
};
```

### 2. Action Wrapper (COPIER EXACTEMENT)

Dans `/src/action/action-wrapper.ts` :

```typescript
import { z } from "zod";
import type { ActionState, ActionError } from "@/types/action-state";

export function withActionHandling<T extends z.ZodSchema>(
	schema: T,
	action: (data: z.infer<T>, prevState: ActionState<z.infer<T>> | null) => Promise<ActionState<z.infer<T>>>
) {
	return async (
		prevState: ActionState<z.infer<T>> | null,
		formData: FormData
	): Promise<ActionState<z.infer<T>>> => {
		// Extract raw values outside try-catch so they're accessible in catch block
		const rawValues: Record<string, FormDataEntryValue> = {};
		for (const [key, value] of formData.entries()) {
			rawValues[key] = value;
		}

		try {
			const validatedData = schema.parse(rawValues);
			return await action(validatedData, prevState);
		} catch (error) {
			if (error instanceof z.ZodError) {
				const errors: ActionError[] = error.issues.map((issue) => ({
					field: issue.path.join(".") || "global",
					code: "VALIDATION_ERROR",
					message: issue.message,
				}));

				return {
					success: false,
					message: "Validation error",
					errors,
					data: rawValues as z.infer<T>,
				};
			}

			return {
				success: false,
				message: "Server error",
				errors: [
					{
						field: "global",
						code: "SERVER_ERROR",
						message:
							"An internal error occurred, please try again later",
					},
				],
				data: rawValues as z.infer<T>,
			};
		}
	};
}
```

### 3. Schéma Zod (Obligatoire)

Créer un fichier de schéma dans `/schemas/` :

```typescript
// schemas/nom-action.ts
import { z } from "zod";

export const nomActionSchema = z.object({
	// champs validés
});

// Type des données du formulaire (PAS DE FICHIER DE TYPE SÉPARÉ)
export type NomActionFormData = z.infer<typeof nomActionSchema>;
```

### 4. Form Utils (COPIER EXACTEMENT)

Dans `/src/lib/form-utils.ts` :

```typescript
import type { ActionState } from "@/types/action-state";

export function getFieldError(state: ActionState | null, fieldName: string) {
	if (!state || !state.errors) return [];

	const error = state.errors.find((error) => error.field === fieldName);
	return error ? [{ message: error.message }] : [];
}

export function getGlobalErrors(state: ActionState | null) {
	return state?.errors?.filter((e) => e.field === "global") || [];
}
```

### 5. SubmitButton (COPIER EXACTEMENT)

Dans `/src/components/submit-button.tsx` :

```typescript
import * as React from "react";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

interface SubmitButtonProps extends Omit<
	React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}, "children" | "disabled"
> {
	children: React.ReactNode;
	pendingMessage?: string;
	isPending: boolean;
}

export function SubmitButton({
	children,
	pendingMessage = "Loading...",
	isPending,
	...props
}: SubmitButtonProps) {
	return (
		<Button disabled={isPending} {...props}>
			{isPending ? (
				<>
					<Loader className="mr-2 h-4 w-4 animate-spin" />
					{pendingMessage}
				</>
			) : (
				children
			)}
		</Button>
	);
}
```

## Structure d'une Action

```typescript
// actions/nom-action.ts
"use server";

import { withActionHandling } from "@/action/action-wrapper";
import { nomActionSchema, type NomActionFormData } from "@/schemas/nom-action";
import type { ActionState } from "@/types/action-state";

export const nomAction = withActionHandling(
	nomActionSchema,
	async (data, prevState): Promise<ActionState<NomActionFormData, unknown>> => {
		// data est déjà validée et typée grâce au schéma Zod
		// votre logique métier ici

		return {
			success: true,
			message: "Operation completed successfully",
			data: data, // Preserve form data
			return: response, // Any return data
		};
	}
);
```

## Structure du Formulaire (COPIER EXACTEMENT)

```typescript
// components/nom-form.tsx
"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
import { nomAction } from "@/actions/nom-action";
import { getFieldError, getGlobalErrors } from "@/lib/form-utils";
import type { NomActionFormData } from "@/schemas/nom-action";
import { SubmitButton } from "@/components/submit-button";

export const NomForm = () => {
	const [state, formAction, pending] = useActionState(nomAction, null);
	const preservedData = state?.data as NomActionFormData | null;

	return (
		<form action={formAction} className="space-y-6">
			<FieldSet>
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="fieldName">Field Label</FieldLabel>
						<Input
							id="fieldName"
							name="fieldName"
							type="text"
							placeholder="Enter value"
							defaultValue={preservedData?.fieldName || ""}
							required
						/>
						<FieldError errors={getFieldError(state, "fieldName")} />
					</Field>

					{/* Autres champs... */}
				</FieldGroup>
			</FieldSet>

			{/* Global errors */}
			<FieldError errors={getGlobalErrors(state)} className="mb-4" />

			{/* Success message */}
			{state?.success && (
				<div className="mb-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
					{state.message}
				</div>
			)}

			<SubmitButton isPending={pending} pendingMessage="Processing...">
				Submit
			</SubmitButton>
		</form>
	);
};
```

## Règles Importantes

- ✅ **Utiliser `z.infer<typeof schema>`** pour les types de formulaire (PAS de fichiers de types séparés)
- ✅ **Utiliser `useActionState`** exclusivement
- ✅ **Structure FieldSet > FieldGroup > Field** obligatoire
- ✅ **Préserver les données** avec `defaultValue={preservedData?.field || ""}`
- ✅ **Gérer les erreurs** avec `getFieldError` et `getGlobalErrors`
- ✅ **Utiliser SubmitButton** pour tous les formulaires
- ✅ **Messages en anglais** obligatoirement
- ✅ **Retourner `data`** pour préserver la saisie
- ✅ **Retourner `return`** pour les données métier

## Importations Standard

```typescript
// Actions
import { withActionHandling } from "@/action/action-wrapper";
import { nomActionSchema, type NomActionFormData } from "@/schemas/nom-action";
import type { ActionState } from "@/types/action-state";

// Formulaires
import { getFieldError, getGlobalErrors } from "@/lib/form-utils";
import { SubmitButton } from "@/components/submit-button";
```