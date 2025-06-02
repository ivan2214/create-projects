import type { Account, Session, User } from "@/app/generated/prisma";

export interface UserWithEntities extends User {
	sessions?: SessionWithEntities[] | null;
	accounts?: AccountWithEntities[] | null;
}

export interface SessionWithEntities extends Session {
	user?: UserWithEntities | null;
}

export interface AccountWithEntities extends Account {
	user?: UserWithEntities | null;
}
