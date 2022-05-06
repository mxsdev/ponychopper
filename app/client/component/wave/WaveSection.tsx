import React, { FunctionComponent, ComponentProps } from "react"
import cl from 'classnames'
import { WaveForm } from './WaveForm'
import { ChopControls } from './ChopControls'

type Props = ComponentProps<typeof WaveForm> & ComponentProps<typeof ChopControls> & {
    className?: string
}

export const WaveSection: FunctionComponent<Props> = ({ className, setWS, chopLoading, onChop, onNext, onPrev, onDragStart }) => {
    return (<>
        <div className={cl("flex items-center self-center justify-center", className)}>
            <div className="text-center overflow-hidden" draggable={true}>
                <WaveForm setWS={setWS} chopLoading={chopLoading} onDragStart={onDragStart} />
            </div>

            <div className="ml-10 w-16">
                <ChopControls
                    onChop={onChop}
                    onNext={onNext}
                    onPrev={onPrev}
                />
            </div>
        </div>
    </>)
}