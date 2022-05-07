import React, { FunctionComponent, ComponentProps } from "react"
import cl from 'classnames'
import { WaveForm } from './WaveForm'
import { ChopControls } from './ChopControls'

type Props = ComponentProps<typeof WaveForm> & ComponentProps<typeof ChopControls> & {
    className?: string
}

export const WaveSection: FunctionComponent<Props> = ({ className, setWS, chopLoading, onChop, onNext, onPrev, onDragStart, chopsEnabled }) => {
    return (<>
        <div>
            <div draggable={true}>
                <WaveForm setWS={setWS} chopLoading={chopLoading} onDragStart={onDragStart} />
            </div>

            <div>
                <ChopControls
                    chopsEnabled={chopsEnabled}
                    onChop={onChop}
                    onNext={onNext}
                    onPrev={onPrev}
                />
            </div>
        </div>
    </>)
}