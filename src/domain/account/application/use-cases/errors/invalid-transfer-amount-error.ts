import { UseCaseError } from "@/core/errors/use-case-error";

export class InvalidTransferAmountError extends Error implements UseCaseError {
	constructor() {
		super("Invalid transfer amount");
	}
}
