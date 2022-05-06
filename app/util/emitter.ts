import TypedEmitter, { EventMap } from 'typed-emitter';

export type TypedEmitterInstance<T extends EventMap> = new () => TypedEmitter<T>