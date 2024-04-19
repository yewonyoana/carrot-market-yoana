// 프리즈마 클라이언트를 사용하기 위해 만듦

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export default db;
