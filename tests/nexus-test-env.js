const { Client } = require('pg')
const NodeEnvironment = require('jest-environment-node')
const { nanoid } = require('nanoid')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const prismaBinary = '.\\node_modules\\.bin\\prisma'

class PrismaTestEnvironment extends NodeEnvironment {
    constructor(config) {
        super(config);

        this.schema = `test_${nanoid()}`

        this.databaseUrl = `postgres://postgres:postgres@localhost:5432/testing?schema=${this.schema}`
    }

    async setup() {
        process.env.DATABASE_URL = this.databaseUrl
        this.global.process.env.DATABASE_URL = this.databaseUrl

        await exec(`${prismaBinary} migrate up --create-db --experimental`)

        return super.setup()
    }

    async teardown() {
        const client = new Client({
            connectionString: this.databaseUrl,
        })
        await client.connect()
        await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`)
        await client.end()
    }
}

module.exports = PrismaTestEnvironment