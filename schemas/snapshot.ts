import { z } from "zod";

export const SnapshotOptionsSchema = z.object({
    "widths": z.array(z.number().or(z.string())).max(10).default([375,1280]),
    "min-height": z.string().default("1024"),
    "percy-css": z.string().optional(),
    "scope": z.string().optional(),
    "enable-javascript": z.boolean().default(false)
})
export const SnapshotSchema = z.object({
    dom: z.any(),
    options: SnapshotOptionsSchema.and(z.object({
        name: z.string()
    })).default({
        widths: [375, 1280],
        "min-height": "1024",
        "enable-javascript": false
    }),
    url: z.string().url(),
    headers: z.record(z.string()).optional(),
    screenshot: z.string().optional()
})

export type SnapshotOptions = z.infer<typeof SnapshotOptionsSchema>
export type Snapshot = z.infer<typeof SnapshotSchema>