import { Injectable } from "@nestjs/common";
import { type Either, right } from "@/core/either";
import { AccountRepository } from "../repositories/account-repository";

type ResetResponse = Either<null, null>;

@Injectable()
export class ResetUseCase {
	constructor(private accountRepository: AccountRepository) {}

	public execute(): ResetResponse {
		this.accountRepository.reset();
		return right(null);
	}
}
