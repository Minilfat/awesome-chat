'use strict';

module.exports = {
    debug: true,
    port: 3000,
    staticBasePath: '/',
    db: {
        connectionString: 'postgres://orzhodecptewug:2fc124280b207f3ae3ca8ac8b8de8686b02c88948b25cee7983c65ae798e17f5@ec2-54-243-54-6.compute-1.amazonaws.com:5432/d4ibdt8ajkfrf0?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
    }
};
