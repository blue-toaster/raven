import Client from '#lib/Raven'
import '#lib/setup'

const client = new Client()

const main = async () => {
  try {
    client.logger.info('Starting Raven...')
    await client.start()
    client.logger.info('Logged in!')
  } catch (error) {
    client.logger.fatal(error)
    client.destroy()
    process.exit(1)
  }
}

void main()
