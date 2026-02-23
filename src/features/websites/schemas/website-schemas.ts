import z from 'zod'
export const AddWebsiteSchema = z.object({
 domain: z
        .string()
        .min(1, { message: 'Domain is required' })
        .url()});
export type AddWebsiteSchemaType = z.infer<typeof AddWebsiteSchema>