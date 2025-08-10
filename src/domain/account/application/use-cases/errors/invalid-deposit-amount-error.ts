import type { UseCaseError } from "@/core/errors/use-case-error";

export class InvalidDepositAmountError extends Error implements UseCaseError {
	constructor() {
		super("Invalid deposit amount");
	}
}
