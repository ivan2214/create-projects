import type { Prisma } from "@/app/generated/prisma";


type UserArgs = { select?: Prisma.UserSelect; include?: Prisma.UserInclude };
type SessionArgs = {
	select?: Prisma.SessionSelect;
	include?: Prisma.SessionInclude;
};
type AccountArgs = {
	select?: Prisma.AccountSelect;
	include?: Prisma.AccountInclude;
};
type VerificationArgs = {
	select?: Prisma.VerificationSelect;
};

export type User<T extends UserArgs = {}> = Prisma.UserGetPayload<T>;
export type Session<T extends SessionArgs = {}> = Prisma.SessionGetPayload<T>;
export type Account<T extends AccountArgs = {}> = Prisma.AccountGetPayload<T>;
export type Verification<T extends VerificationArgs = {}> =
	Prisma.VerificationGetPayload<T>;
