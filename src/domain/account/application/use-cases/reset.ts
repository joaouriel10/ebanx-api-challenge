import { type Either, right } from "@/core/either";
import { Account } from "../../enterprise/entities/account";
import type { AccountRepository } from "../repositories/account-repository";

type ResetResponse = Either<null, null>;

export class ResetUseCase {
	constructor(private accountRepository: AccountRepository) {}

	public execute(): ResetResponse {
		this.accountRepository.reset();

		this.accountRepository.save(
			Account.create(
				{
					balance: 0,
				},
				100,
			),
		);

		this.accountRepository.save(
			Account.create(
				{
					balance: 0,
				},
				300,
			),
		);

		return right(null);
	}
}
