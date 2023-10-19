import { z } from "zod";
import { SnapshotSchema } from "./snapshot";

export const PercyBuildSchema = z.object({
    token: z.string(),
    snapshots: z.record(z.string(),SnapshotSchema)
})

export type PercyBuild = z.infer<typeof PercyBuildSchema>