import { Events } from '#types'
import { ApplyOptions } from '@sapphire/decorators'
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks'

@ApplyOptions<ScheduledTask.Options>({
  cron: '0 * * * *'
})
export default class AnalyticsSync extends ScheduledTask {
  public run(): boolean {
    return this.container.client.emit(Events.AnalyticSync)
  }
}
