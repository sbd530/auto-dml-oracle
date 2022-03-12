import oracledb from 'oracledb'

export async function getConnection() {
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT
    try {
        return await oracledb.getConnection({
            user: process.env.USER,
            password: process.env.PASSWORD,
            connectString: process.env.CONNECT_STRING
        })
    } catch (error) {
        console.error(error)
        throw new Error('DB connection Error!')
    }
}