import { Body, Controller, Post, Res } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { DepositUseCase } from "@/domain/account/application/use-cases/deposit";
import { TransferUseCase } from "@/domain/account/application/use-cases/transfer";
import { WithdrawUseCase } from "@/domain/account/application/use-cases/withdraw";

type EventDTO =
	| { type: "deposit"; destination: string; amount: number }
	| { type: "withdraw"; origin: string; amount: number }
	| { type: "transfer"; origin: string; destination: string; amount: number };

@Controller()
export class EventsController {
	constructor(
		private readonly depositUseCase: DepositUseCase,
		private readonly withdrawUseCase: WithdrawUseCase,
		private readonly transferUseCase: TransferUseCase,
	) {}

	@Post("event")
	handle(@Body() body: EventDTO, @Res() reply: FastifyReply) {
		switch (body.type) {
			case "deposit": {
				const depositResult = this.depositUseCase.execute({
					destination: body.destination,
					amount: body.amount,
				});

				return reply.status(201).send(depositResult.value);
			}
			case "withdraw": {
				const withdrawResult = this.withdrawUseCase.execute({
					destination: body.origin,
					amount: body.amount,
				});

				if (withdrawResult.isLeft()) {
					return reply.status(404).type("text/plain").send("0");
				}

				return reply.status(201).send(withdrawResult.value);
			}
			case "transfer": {
				const transferResult = this.transferUseCase.execute({
					origin: body.origin,
					destination: body.destination,
					amount: body.amount,
				});

				if (transferResult.isLeft()) {
					return reply.status(404).type("text/plain").send("0");
				}

				return reply.status(201).send(transferResult.value);
			}
		}
	}
}
