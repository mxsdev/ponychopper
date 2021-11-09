import React from "react";
export declare type PlayerContextType = {
    getWS: () => WaveSurfer | null;
    setWS: (ws: WaveSurfer) => void;
};
declare const _default: React.Context<PlayerContextType>;
export default _default;
export declare const usePlayerContext: () => PlayerContextType;
