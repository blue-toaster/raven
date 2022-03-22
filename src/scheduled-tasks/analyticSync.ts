import { Events } from '#lib/@types'
import { ApplyOptions } from '@sapphire/decorators'
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks'

@ApplyOptions<ScheduledTask.Options>({
  cron: '0 * * * *',
  bullJobOptions: {
    removeOnComplete: true
  }
})
export default class reminder extends ScheduledTask {
  public run() {
    return this.container.client.emit(Events.AnalyticSync)
  }
}
