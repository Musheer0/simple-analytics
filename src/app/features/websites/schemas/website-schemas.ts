import z from 'zod'
export const AddWebsiteSchema = z.object({
    domain :z.string()
});
export type AddWebsiteSchemaType = z.infer<typeof AddWebsiteSchema>