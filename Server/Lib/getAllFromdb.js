const getAllFromdb = (pool, dbToGetFrom, postgresSchema) => {
    if (pool.options.user == 'postgres') {
        return pool.query(`SELECT * FROM "${postgresSchema}"."${dbToGetFrom}"`)
    }
    if (pool.options.user == 'sql') {
        return pool.request().query(`SELECT * from ${dbToGetFrom}`);
    }
}

module.exports = getAllFromdb;
