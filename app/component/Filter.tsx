import { useLocalStorage } from "helpers"
import { FilterOpts } from "main"
import React, { FunctionComponent } from "react"

interface OwnProps {
    filterOpts: FilterOpts,
    updateFilterOpts: (opts: Partial<FilterOpts>) => void
}

type Props = OwnProps

export default (({ filterOpts, updateFilterOpts }) => {
    const [open, setOpen] = useLocalStorage<boolean>('filterOpen', false)

    return (<>
        <p className="font-mono mt-4 text-left text-lg font-bold select-none hover:cursor-pointer" onClick={() => setOpen(!open)}>Filter {!open ? '▲' : '▼'}</p>

        {open ? 
            <div className='filter-container'>
                <FilterRow>
                    <FilterCol1>
                        <p className="body-text">Test</p>
                    </FilterCol1>
                    <FilterCol2>
                        <p className="body-text">Test2</p>
                    </FilterCol2>
                </FilterRow>
                <FilterRow>
                    <FilterCol1>
                        <p className="body-text">Test</p>
                    </FilterCol1>
                    <FilterCol2>
                        <p className="body-text">Test2</p>
                    </FilterCol2>
                </FilterRow>
            </div>
        : ''}
    </>)
}) as FunctionComponent<Props>

const FilterRow: FunctionComponent<{}> = ({children}) => <div className='flex'>{children}</div>
const FilterCol1: FunctionComponent<{}> = ({children}) => <div className="flex-col w-1/5">{children}</div>
const FilterCol2: FunctionComponent<{}> = ({children}) => <div className="flex-col w-4/5">{children}</div>