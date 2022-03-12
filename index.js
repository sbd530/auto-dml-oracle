import "dotenv/config"
import { createReadStream } from 'fs'
import readline from 'readline'
import { getConnection } from './connection.js'

const filename = process.argv[2]

const connection = await getConnection()

async function select(query) {
    try {

        const result = await connection.execute(query)

        console.log(result.rows)

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

async function dml(sql) {

    try {
        await connection.execute(sql);
    } catch (error) {
        console.error(error)
        if (process.env.ERROR_ROLLBACK === 'true')
            throw new Error()
    }
}

const rl = readline.createInterface({
    input: createReadStream(filename),
    crlfDelay: Infinity,
})

try {
    for await (const line of rl) {
        const sql = line.replace(';', '')
        await dml(sql)
        if (process.env.LOG === 'true')
            console.log(sql);
    }
    await connection.commit()
    console.log('\n\nCommitted.\n')
} catch (error) {
    console.error(error)
    console.error('\n\nRollbacked.\n')
    throw new Error('DML Error occured.')
} finally {
    if (connection) {
        try {
            await connection.close()
        } catch (error) {
            console.error(error)
        }
    }
}