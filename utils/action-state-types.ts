export interface ActionError {
	field: string;
	code: string;
	message: string;
}

export interface ActionState<T = unknown> {
	success: boolean;
	message?: string;
	data?: T;
	errors?: ActionError[];
}
