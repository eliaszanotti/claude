# Server Actions Guidelines

## Règle Fondamentale

Toutes les actions serveur DOIVENT utiliser `useActionState` de Next.js (et non pas `useFormState`).

## Structure de Fichiers Obligatoire

### 1. Action Wrapper (TOUJOURS créer)

Dans chaque projet, créer obligatoirement le fichier `/action/action-wrapper.ts` :

```typescript
// /action/action-wrapper.ts
import { z } from "zod";
import type { ActionState, ActionError } from "@/utils/action-state-types";

export function withActionHandling<T>(
	schema: z.ZodSchema<T>,
	action: (data: T) => Promise<ActionState>
) {
	return async (
		prevState: ActionState | null,
		formData: FormData
	): Promise<ActionState> => {
		try {
			// 1. Extraire les données du FormData
			const rawValues: Record<string, any> = {};
			for (const [key, value] of formData.entries()) {
				rawValues[key] = value;
			}

			// 2. Validation automatique avec Zod
			const validatedData = schema.parse(rawValues);

			// 3. Exécuter votre logique métier
			return await action(validatedData);
		} catch (error) {
			if (error instanceof z.ZodError) {
				// 4. Gestion automatique des erreurs de validation Zod
				const errors: ActionError[] = error.issues.map((issue) => ({
					field: issue.path.join(".") || "global",
					code: "VALIDATION_ERROR",
					message: issue.message,
				}));

				return {
					success: false,
					message: "Erreur de validation des données",
					errors,
				};
			}

			// 5. Gestion générique des erreurs serveur
			return {
				success: false,
				message: "Erreur serveur",
				errors: [
					{
						field: "global",
						code: "SERVER_ERROR",
						message:
							"Une erreur interne est survenue, veuillez réessayer plus tard",
					},
				],
			};
		}
	};
}
```

### 2. Schéma Zod (Obligatoire)

Pour chaque action, créer un fichier de schéma séparé dans `/schemas/` :

```typescript
// schemas/nom-action.schema.ts
import { z } from "zod";

export const nomActionSchema = z.object({
	// champs validés
});
```

### 3. Types d'Action (Obligatoire)

Pour chaque action, créer un fichier de type dans `/types/actions/` :

```typescript
// types/actions/nom-action-type.ts
export type NomActionData = {
	// Type des données retournées dans ActionState<T>
	id: string;
	// autres champs
};

export type NomActionState = ActionState<NomActionData>;
```

## Structure d'une Action

```typescript
// actions/nom-action.ts
import { withActionHandling } from "@/action/action-wrapper";
import { nomActionSchema } from "@/schemas/nom-action.schema";
import type { NomActionState } from "@/types/actions/nom-action-type";

export const nomAction = withActionHandling(
	nomActionSchema,
	async (data): Promise<NomActionState> => {
		// data est déjà validée et typée grâce au schéma Zod

		// votre logique métier ici

		return {
			success: true,
			message: "Opération réussie",
			data: {
				id: "generated-id",
				// autres données
			},
		};
	}
);
```

## Format de Retour Obligatoire

Toutes les actions doivent retourner `ActionState<T>` en utilisant les types de `@/utils/action-state-types` :

```typescript
import type { ActionState } from "@/utils/action-state-types";
```

## Gestion des Erreurs

-   Erreurs de validation : gérées automatiquement par le wrapper
-   Erreurs métier : retourner un `ActionState` avec `errors` approprié
-   Erreurs serveur : gérées automatiquement par le wrapper

## Importations Standard

```typescript
import { withActionHandling } from "@/action/action-wrapper";
import { nomActionSchema } from "@/schemas/nom-action.schema";
import type { NomActionState } from "@/types/actions/nom-action-type";
```
