process.env.NODE_ENV = "test";
process.env.DATABASE_URL ??= "postgresql://postgres:postgres@localhost:5432/work_allocation_test?schema=public";
process.env.JWT_ACCESS_SECRET ??= "test-access-secret-with-sufficient-length";
process.env.JWT_REFRESH_SECRET ??= "test-refresh-secret-with-sufficient-length";
process.env.ACCESS_TOKEN_EXPIRES_IN ??= "15m";
process.env.REFRESH_TOKEN_EXPIRES_IN ??= "7d";
process.env.PORT ??= "4001";
process.env.CLIENT_URL ??= "http://localhost:5173";
