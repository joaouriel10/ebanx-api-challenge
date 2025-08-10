import type { AccountRepository } from "@/domain/account/application/repositories/account-repository";
import type { Account } from "@/domain/account/enterprise/entities/account";

export class InMemoryAccountRepository implements AccountRepository {
	private items: Account[] = [];

	public findById(id: number): Account | null {
		return this.items.find((item) => item.id === id) || null;
	}

	public save(account: Account): void {
		this.items.push(account);
	}

	public update(account: Account): void {
		const index = this.items.findIndex((item) => item.id === account.id);
		if (index !== -1) {
			this.items[index] = account;
		}
	}
}
