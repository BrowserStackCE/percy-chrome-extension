const { z } = require('zod')

const DiscoveryOptions = z.object({
    "allowed-hostnames": z.array(z.string()).optional(),
    "disallowed-hostnames": z.array(z.string()).optional(),
    "request-headers": z.record(z.string(), z.string()).default({}),
    "authorization": z.object({
        username: z.string().optional(),
        password: z.string().optional()
    }).optional(),
    "disable-cache": z.boolean().optional(),
    "cookies": z.string().optional(),
    "device-pixel-ratio": z.string().optional().transform((v) => v == null ? v : Number(v)),
    "user-agent": z.string().optional(),
    "network-idle-timeout": z.number().optional(),
    "concurrency": z.number().optional(),
    "launch-options": z.object({
        executable: z.string().optional(),
        timeout: z.number().optional(),
        args: z.array(z.string()).optional()
    }).passthrough().optional()
})

const SnapshotOptions = z.object({
    "widths": z.array(z.number().or(z.string())).max(10).default([375, 1280]).transform((v) => v.map((i) => Number(i))),
    "min-height": z.string().or(z.number()).default("1024").transform((v) => Number(v)),
    "percy-css": z.string().optional(),
    "scope": z.string().optional(),
    "enable-javascript": z.boolean().default(false)
})

const PercyConfig = z.object({
    version: z.literal("2").default("2"),
    percy: z.object({
        token: z.string().min(1)
    }),
    snapshot: SnapshotOptions.default({}),
    discovery: DiscoveryOptions.default({})
})

module.exports = { DiscoveryOptions, SnapshotOptions, PercyConfig }
