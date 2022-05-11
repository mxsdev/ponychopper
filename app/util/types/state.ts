export type UpdateStateArgument<T> = T
export type UpdateState<T> = (data: NonNullable<UpdateStateArgument<T>>, localOnly?: boolean) => void