import { Module } from "@nestjs/common";
import { AccountRepository } from "@/domain/account/application/repositories/account-repository";
import { InMemoryAccountRepository } from "./in-memory/repositories/account-repository";

@Module({
	providers: [
		{
			provide: AccountRepository,
			useClass: InMemoryAccountRepository,
		},
	],
	exports: [AccountRepository],
})
export class DatabaseModule {}
