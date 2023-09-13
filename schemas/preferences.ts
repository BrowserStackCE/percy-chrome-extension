import { z } from "zod";
import { SnapshotOptionsSchema } from "./snapshot";

export const PreferncesSchema = z.object({
    defaultOptions: SnapshotOptionsSchema.partial().default({
        widths:[375,1280],
        "min-height":"1024",
        "enable-javascript":false
    })
})

export type Preferences = z.infer<typeof PreferncesSchema>