import type { Account } from "@/domain/account/enterprise/entities/account";

export abstract class AccountRepository {
	abstract findById(id: number): Account | null;
	abstract save(account: Account): void;
	abstract update(account: Account): void;
}
