import { AnalyticsListener } from '#lib/structures/AnalyticListener'
import { Actions, Events, Points, Tags } from '#types'
import { Point } from '@influxdata/influxdb-client'
import { ApplyOptions } from '@sapphire/decorators'

@ApplyOptions<AnalyticsListener.Options>({
  event: Events.AnalyticSync
})
export default class Sync extends AnalyticsListener {
  public run() {
    const guilds = this.container.client.guilds.cache.size
    const users = this.container.client.guilds.cache.reduce((acc, guild) => acc + (guild.memberCount ?? 0), 0)

    this.writePoints([this.syncGuilds(guilds), this.syncUsers(users), this.syncMessages()])

    return this.container.analytics.writeApi.flush()
  }

  private syncGuilds(n: number) {
    return new Point(Points.Guilds).tag(Tags.Action, Actions.Sync).intField('value', n)
  }

  private syncUsers(n: number) {
    return new Point(Points.Users).tag(Tags.Action, Actions.Sync).intField('value', n)
  }

  private syncMessages() {
    const messages = this.container.analytics.messages
    this.container.analytics.messages = 0

    return new Point(Points.Messages).tag(Tags.Action, Actions.Sync).intField('value', messages)
  }
}
