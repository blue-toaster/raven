import { AnalyticsListener } from '#lib/structures/AnalyticListener'
import { ApplyOptions } from '@sapphire/decorators'
import { Events } from '@sapphire/framework'

@ApplyOptions<AnalyticsListener.Options>({
  event: Events.MessageCreate
})
export default class MessageAnalytics extends AnalyticsListener {
  public run() {
    this.container.analytics.messages++
  }
}
