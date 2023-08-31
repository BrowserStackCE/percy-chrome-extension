import { z } from "zod";
import { SnapshotSchema } from "./snapshot";

export const PercyBuildSchema = z.object({
    snapshots: z.array(SnapshotSchema).default([])
})

export type PercyBuild = z.infer<typeof PercyBuildSchema>