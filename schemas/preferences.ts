import { z } from "zod";
import { DiscoveryOptionsSchema } from "./discovery";
import { SnapshotOptionsSchema } from "./snapshot";

export const PreferncesSchema = z.object({
    defaultSnapshotOptions: SnapshotOptionsSchema.partial().default({
        widths:[375,1280],
        "min-height":"1024",
        "enable-javascript":false
    }),
    discoveryOptions: DiscoveryOptionsSchema.optional()
})

export type Preferences = z.infer<typeof PreferncesSchema>