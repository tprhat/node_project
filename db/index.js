const {Pool} = require('pg');

const pool = new Pool({
    user: 'epucyihpfwlnzy',
    host: 'ec2-54-246-115-40.eu-west-1.compute.amazonaws.com',
    database: 'd1g7p4t0at81te',
    password: '702fcb510ac29771938c5c78a49567e73ad008b56445cfe62f14a033a7d3c7f2',
    port: 5432,
    //connectionString: 'postgres://epucyihpfwlnzy:702fcb510ac29771938c5c78a49567e73ad008b56445cfe62f14a033a7d3c7f2@ec2-54-246-115-40.eu-west-1.compute.amazonaws.com:5432/d1g7p4t0at81te',
    ssl: {rejectUnauthorized: false},
});



module.exports = {
    query: (text, params) => {
        const start = Date.now();
        return pool.query(text, params)
            .then(res => {
                const duration = Date.now() - start;
                //console.log('executed query', {text, params, duration, rows: res.rows});
                return res;
            });
    },
    pool: pool
}
