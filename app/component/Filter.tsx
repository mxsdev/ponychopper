import { useLocalStorage } from "helpers"
import { Character, listCharacters, listSeasons, listSongs, Season, Song } from "locale"
import { FilterOpts } from "main"
import React, { FunctionComponent, PropsWithChildren } from "react"

interface OwnProps {
    filterOpts: FilterOpts,
    updateFilterOpts: (opts: Partial<FilterOpts>) => void
}

type Props = OwnProps

const charaList = listCharacters()
const seasonList = listSeasons()
const songList = listSongs()

export default (({ filterOpts, updateFilterOpts }) => {
    const [open, setOpen] = useLocalStorage<boolean>('filterOpen', false)


    const toggleCharacter = (id: Character, toggled: boolean) => {
        updateFilterOpts({
             characters: [
                ...filterOpts.characters.filter(c => c !== id),
                ...(toggled ? [id] : [])
            ] 
        })
    }

    const toggleSeason = (season: Season, toggled: boolean) => {
        updateFilterOpts({
            seasons: [
                ...filterOpts.seasons.filter(s => s !== season),
                ...(toggled ? [season] : [])
            ]
        })
    }

    const toggleSong = (song: Song, toggled: boolean) => {
        updateFilterOpts({
            songs: [
                ...filterOpts.songs.filter(s => s !== song),
                ...(toggled ? [song] : [])
            ]
        })
    }

    return (<>
        <p className="font-mono mt-4 text-left text-lg font-bold select-none hover:cursor-pointer" onClick={() => setOpen(!open)}>Filter {!open ? '▲' : '▼'}</p>

        {open ? 
            <div className='filter-container'>
                <FilterRow>
                    <FilterCol1>
                        <FilterBox 
                            key={'characters'}
                            id={'characters'}

                            onCheck={(c) => updateFilterOpts({
                                characters: c ? charaList.map(c => c.key) : []
                            })}
                            defaultChecked={true}

                            label="Characters"
                        />
                    </FilterCol1>
                    <FilterCol2>
                        { charaList.map(char => (<>
                            <FilterBox 
                                key={char.key} 
                                id={char.key} 
                                checked={filterOpts.characters.includes(char.key)}
                                onCheck={(c) => toggleCharacter(char.key, c)}
                                label={char.name}
                            />
                        </>)) }
                    </FilterCol2>
                </FilterRow>

                <FilterRow>
                    <FilterCol1>
                        <FilterBox 
                            key={'seasons'}
                            id={'seasons'}

                            onCheck={(c) => updateFilterOpts({
                                seasons: c ? seasonList : []
                            })}

                            defaultChecked={true}

                            label="Seasons"
                        />
                    </FilterCol1>
                    <FilterCol2>
                        { seasonList.map(season => (<>
                            <FilterBox 
                                key={season}
                                id={`season-${season}`}

                                checked={filterOpts.seasons.includes(season)}
                                onCheck={(c) => toggleSeason(season, c)}

                                label={season}
                            />
                        </>)) }
                    </FilterCol2>
                </FilterRow>
                
                <FilterRow>
                    <FilterCol1>
                        <FilterBox 
                            key={'songs'}
                            id={'songs'}

                            onCheck={(c) => updateFilterOpts({
                                songs: c ? songList.map(s => s.key) : []
                            })}

                            defaultChecked={true}

                            label="Songs"
                        />
                    </FilterCol1>
                    <FilterCol2>
                        { songList.map(song => (<>
                            <FilterBox 
                                key={`song-${song.key}`}
                                id={`song-${song.key}`}

                                checked={filterOpts.songs.includes(song.key)}

                                onCheck={(c) => toggleSong(song.key, c)}

                                label={song.name}
                            />
                        </>)) }
                    </FilterCol2>
                </FilterRow>
            </div>
        : ''}
    </>)
}) as FunctionComponent<Props>

const FilterCheckbox: FunctionComponent<{ label: string, checked: boolean, setChecked: (checked: boolean) => void, id: string }> = (props) => <div>
    <input id={props.id} />
    <span className=""></span>
    
</div>

const FilterRow: FunctionComponent<PropsWithChildren<{}>> = ({children}) => <div className='flex justify-around'>{children}</div>
const FilterCol1: FunctionComponent<PropsWithChildren<{}>> = ({children}) => <div className="flex-col w-36 flex-initial">{children}</div>
const FilterCol2: FunctionComponent<PropsWithChildren<{}>> = ({children}) => <div className="flex-col flex-1">{children}</div>
const FilterBox: FunctionComponent<{id: string, checked?: boolean, defaultChecked?: boolean, onCheck: (checked: boolean) => void, label?: string}> = ({id, checked, onCheck, label, defaultChecked}) => <div className={"inline-block select-none" + ((label) ? " mr-2" : "")}>
    <input id={id} type="checkbox" 
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={(e) => onCheck(e.target.checked)}
    />
    {label ? <label htmlFor={id} className="select-none ml-1">{label}</label> : <></>}
</div>