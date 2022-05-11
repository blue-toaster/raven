/**
 * @license Apache License, Version 2.0
 * @copyright Skyra Project, 2019
 *
 * https://github.com/skyra-project/skyra/blob/main/src/lib/structures/listeners/AnalyticsListener.ts
 */

import { envParseBoolean } from '#lib/env/parser'
import { Tags } from '#types'
import type { Point } from '@influxdata/influxdb-client'
import { Listener } from '@sapphire/framework'

export abstract class AnalyticsListener extends Listener {
  public tags: Array<[Tags, string]> = []

  public constructor(context: Listener.Context, options?: AnalyticsListener.Options) {
    super(context, { ...options, enabled: envParseBoolean('INFLUX_ENABLED') })
  }

  public override onLoad(): unknown {
    this.initTags()
    return super.onLoad()
  }

  public writePoint(point: Point): Point {
    return this.container.analytics.writeApi.writePoint(this.injectTags(point))
  }

  public writePoints(points: Point[]): Point {
    points = points.map(point => this.injectTags(point))
    return this.container.analytics.writeApi.writePoints(points)
  }

  protected injectTags(point: Point): Point {
    for (const tag of this.tags) {
      point.tag(tag[0], tag[1])
    }
    return point
  }

  protected initTags(): void {
    this.tags.push([Tags.Client, process.env.CLIENT_ID!], [Tags.OriginEvent, this.event as string])
  }
}

export namespace AnalyticsListener {
  export type Options = Omit<Listener.Options, 'enabled'>
}
