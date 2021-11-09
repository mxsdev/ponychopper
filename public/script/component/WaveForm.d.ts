import React from "react";
import WaveSurfer from "wavesurfer.js";
import { ChopID } from "main";
interface OwnProps {
    ws: WaveSurfer | null;
    setWS: (ws: WaveSurfer) => void;
    chopLoading: boolean;
    setChopLoading: (loading: boolean) => void;
    currChopID: ChopID | null;
}
declare const _default: React.FunctionComponent<OwnProps>;
export default _default;
