import "dotenv/config"
import oracledb from 'oracledb'

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

// let connection

async function getConnection() {
    // if (!connection) return Promise.resolve(connection)
    try {
        return await oracledb.getConnection({
            user: process.env.USER,
            password: process.env.PASSWORD,
            connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1522))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=XE)))'
        })
    } catch (error) {
        console.error(error)
        throw new Error('DB connection Error!')
    }
}

async function select() {
    let connection = await getConnection()
    try {
        const result = await connection.execute(
            'SELECT * FROM TN_DT'
        )

        console.log(`type of result : ${typeof result}`)
        console.log(result)
        console.log('')
        console.log(`조회결과: ${result}`)
        console.log(`result.rows: ${result.rows}`)


    } catch (error) {
        console.error(error)
    } finally {
        if (connection) {
            try {
                await connection.close()
            } catch (error) {
                console.error(error)
            }
        }
    }
}

await select();