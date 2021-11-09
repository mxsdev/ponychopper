import { FilterOpts } from "main";
import React from "react";
interface OwnProps {
    filterOpts: FilterOpts;
    updateFilterOpts: (opts: Partial<FilterOpts>) => void;
}
declare const _default: React.FunctionComponent<OwnProps>;
export default _default;
