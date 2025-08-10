import type { UseCaseError } from "@/core/errors/use-case-error";

export class InvalidWithdrawAmountError extends Error implements UseCaseError {
	constructor() {
		super("Invalid withdraw amount");
	}
}
