import { AddEventListener, PCEventListener, RemoveEventListener, WindowEvents } from "client/event/events";
import { useEffect } from "react";

export const useEvent = <C extends keyof WindowEvents>(channel: C, handler: PCEventListener<C>, deps: any[] = []) => {
    useEffect(() => {
        AddEventListener(channel, handler)

        return () => RemoveEventListener(channel, handler)
    }, deps)
}