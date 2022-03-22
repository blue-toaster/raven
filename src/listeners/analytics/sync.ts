import { AnalyticsListener } from '#lib/structures/AnalyticListener'
import { Actions, Events, Points, Tags } from '#types'
import { Point } from '@influxdata/influxdb-client'
import { ApplyOptions } from '@sapphire/decorators'

@ApplyOptions<AnalyticsListener.Options>({
  event: Events.AnalyticSync
})
export default class Sync extends AnalyticsListener {
  public run() {
    const rawUserCount = this.container.client.guilds.cache.reduce((acc, guild) => acc + (guild.memberCount ?? 0), 0)

    this.writePoints([this.syncUsers(rawUserCount), this.syncMessages()])

    return this.container.analytics.writeApi.flush()
  }

  private syncUsers(users: number) {
    return new Point(Points.Users).tag(Tags.Action, Actions.Sync).intField('value', users)
  }

  private syncMessages() {
    const messages = this.container.analytics.messages
    this.container.analytics.messages = 0

    return new Point(Points.Messages).tag(Tags.Action, Actions.Sync).intField('value', messages)
  }
}
