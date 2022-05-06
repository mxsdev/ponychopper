import React, { FunctionComponent } from "react"
import { Button } from "../ui/Button"
import cl from 'classnames'

type Props = {
    className?: string,
    onChop?: () => void,
    onPrev?: () => void,
    onNext?: () => void
}

export const ChopControls: FunctionComponent<Props> = ({onChop, onPrev, onNext, ...props}) => {
    return (<>
        <div className={cl("flex flex-col gap-1", props.className)}>
            <div className="w-full pb-[100%] h-0 relative overflow-hidden">
                <Button onClick={onChop} className="block w-full h-full absolute top-0 left-0">
                    <span className="text-4xl select-none">🔪</span>
                </Button>
            </div>
            
            <div className="w-full pb-[50%] h-0 relative overflow-hidden">
                <div className="w-full h-full absolute top-0 left-0 flex flex-row gap-1">
                    <Button onClick={onPrev} className="w-full text-center">
                        ←
                    </Button>
                    <Button onClick={onNext} className="w-full">
                        →
                    </Button>
                </div>
            </div>
        </div>
    </>)
}