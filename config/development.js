'use strict';

module.exports = {
    debug: true,
    port: 3000,
    staticBasePath: '/',
    db: {
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: 'mwlto7lycm',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
    }
};
