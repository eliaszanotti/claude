import { z } from "zod";
import type { ActionState, ActionError } from "./action-state-types";

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
