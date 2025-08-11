import { Controller, Get, Query, Res } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { AccountNotFoundError } from "@/domain/account/application/use-cases/errors/account-not-found-error";
import { GetBalanceUseCase } from "@/domain/account/application/use-cases/get-balance";

@Controller("/balance")
export class GetBalanceController {
	constructor(private getBalance: GetBalanceUseCase) {}

	@Get()
	async handle(
		@Query("account_id") accountId: string,
		@Res() reply: FastifyReply,
	) {
		const result = this.getBalance.execute({
			accountId,
		});

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case AccountNotFoundError:
					return reply.status(404).type("text/plain").send("0");
				default:
					return reply.status(400).type("text/plain").send("0");
			}
		}

		return reply.status(200).send(result.value.balance);
	}
}
