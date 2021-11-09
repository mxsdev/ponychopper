import React from "react";
import { Character, Song, Season } from "locale";
interface OwnProps {
}
export declare type ChopID = {
    song: Song;
    chop_filename: string;
};
export declare type ChopTransformed = ChopID & {
    character: Character;
    season: Season;
    slug: string;
};
export declare type FilterOpts = {
    songs: Song[];
    seasons: Season[];
    characters: Character[];
};
declare const _default: React.FunctionComponent<OwnProps>;
export default _default;
