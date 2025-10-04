import z from 'zod'

const courseModel = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export type Course = z.infer<typeof courseModel>

export const coursesModel = z.array(courseModel)
