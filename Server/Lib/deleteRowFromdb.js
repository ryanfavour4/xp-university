const deleteRowFromdb = (pool, dbToDeleteFrom, rowToDelete, inputParamArray, postgresSchema) => {
    if (pool.options.user == 'postgres') {
        return pool.query(`DELETE FROM "${postgresSchema}"."${dbToDeleteFrom}" WHERE "${rowToDelete}" = $1 RETURNING *`, [inputParamArray[0]]);
    }
    if (pool.options.user == 'sql') {
        return pool
            .request()
            .input(inputParamArray[0], inputParamArray[1], inputParamArray[2])
            .query(`DELETE FROM ${dbToDeleteFrom} WHERE ${rowToDelete} = @${inputParamArray[0]}`);
    }
}

module.exports = deleteRowFromdb;
