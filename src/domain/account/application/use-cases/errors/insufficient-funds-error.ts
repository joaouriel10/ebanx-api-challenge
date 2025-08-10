import type { UseCaseError } from "@/core/errors/use-case-error";

export class InsufficientFundsError extends Error implements UseCaseError {
	constructor() {
		super("Insufficient funds");
	}
}
