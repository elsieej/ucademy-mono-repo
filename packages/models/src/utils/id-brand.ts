import z from 'zod'

const zId = <B extends string>(_: B) => z.string().uuid().brand<B>()

export const zIdBrand = zId
