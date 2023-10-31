import { z } from 'zod'
export const DiscoveryOptionsSchema = z.object({
    "allowed-hostnames": z.array(z.string()).optional(),
    "disallowed-hostnames": z.array(z.string()).optional(),
    "request-headers": z.array(z.record(z.enum(['key', 'value']), z.string())).default([]),
    "authorization": z.object({
        username: z.string().optional(),
        password: z.string().optional()
    }).optional(),
    "disable-cache": z.boolean().optional(),
    "cookies": z.string().optional(),
    "device-pixel-ratio": z.string().optional().transform((v) => Number(v)),
    "user-agent": z.string().optional(),
    "network-idle-timeout": z.number().optional(),
    "concurrency": z.number().optional()
})