import { Module } from "@nestjs/common";
import { DepositUseCase } from "@/domain/account/application/use-cases/deposit";
import { GetBalanceUseCase } from "@/domain/account/application/use-cases/get-balance";
import { ResetUseCase } from "@/domain/account/application/use-cases/reset";
import { TransferUseCase } from "@/domain/account/application/use-cases/transfer";
import { WithdrawUseCase } from "@/domain/account/application/use-cases/withdraw";
import { DatabaseModule } from "../database/database.module";
import { EventsController } from "./controllers/events.controller";
import { GetBalanceController } from "./controllers/get-balance.controller";
import { ResetController } from "./controllers/reset.controller";

@Module({
	imports: [DatabaseModule],
	controllers: [GetBalanceController, ResetController, EventsController],
	providers: [
		GetBalanceUseCase,
		ResetUseCase,
		DepositUseCase,
		WithdrawUseCase,
		TransferUseCase,
	],
})
export class HttpModule {}
