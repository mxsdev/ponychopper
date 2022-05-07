import React, { FunctionComponent } from "react"
import cl from 'classnames'

type Props = {
    className?: string,
    onChop?: () => void,
    onPrev?: () => void,
    onNext?: () => void,

    chopsEnabled: boolean
}

export const ChopControls: FunctionComponent<Props> = ({onChop, onPrev, onNext, ...props}) => {
    return (<>
        <div>
            <div>
                <Button onClick={onChop} disabled={!props.chopsEnabled}>
                    <span>🔪</span>
                </Button>
            </div>
            
            <div>
                <div>
                    <Button onClick={onPrev}>
                        ←
                    </Button>
                    <Button onClick={onNext}>
                        →
                    </Button>
                </div>
            </div>
        </div>
    </>)
}