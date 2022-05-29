// !!! delete
import { useAppDispatch } from "@app/hooks";
// !!! delete
import { store } from "@app/store";
import { Direction } from "@constants/enum.constants";

import DebugTools from "../debug_tools";
import { ToolbarItem } from "../ToolbarItem";
import type { IToolbarItemsProps } from "../ToolbarItems";
// !!! delete
import { actions } from "../toolbarItemsSlice";
import { bondToolBarItems, Chain, Delete } from "../tools";

let i = 0;
const toolbarItemsList: ToolbarItem[] = [
    Delete.deleteBox,
    bondToolBarItems.singleBond,
    bondToolBarItems.doubleBond,
    bondToolBarItems.tripleBond,
    bondToolBarItems.wedgeBackBond,
    bondToolBarItems.wedgeFrontBond,
    Chain,
    {
        name: "Load an example .mol file (debug)",
        onActivate: () => {
            if (i !== 0) {
                return;
            }
            i += 1;
            const payload = {
                content:
                    "mannitol.mol\n  Ketcher  51622 0392D 1   1.00000     0.00000     0\n\n 13 11  0  0  0  0            999 V2000\n   13.1079   -7.3500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   12.2421   -7.8500    0.0000 I   0  0  0  0  0  0  0  0  0  0  0  0\n   13.9741   -7.8500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   13.1079   -6.3500    0.0000 Br  0  0  0  0  0  0  0  0  0  0  0  0\n   11.3759   -7.3500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   12.2421   -8.8500    0.0000 S   0  0  0  0  0  0  0  0  0  0  0  0\n   14.8399   -7.3500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   13.9741   -8.8500    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n   10.5101   -7.8500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   11.3759   -6.3500    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   15.7060   -7.8500    0.0000 I   0  0  0  0  0  0  0  0  0  0  0  0\n    9.6440   -7.3500    0.0000 P   0  0  0  0  0  0  0  0  0  0  0  0\n    7.6440   -7.3500    0.0000 Xe   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  2  0  0  0  0\n  1  3  1  0  0  0  0\n  1  4  1  6  0  0  0\n  2  5  2  0  0  0  0\n  2  6  1  6  0  0  0\n  3  7  1  0  0  0  0\n  3  8  1  1  0  0  0\n  5  9  1  0  0  0  0\n  5 10  1  1  0  0  0\n  7 11  3  0  0  0  0\n  9 12  1  0  0  0  0\nM  END\n",
                format: "mol",
                replace: true,
            };
            store.dispatch(actions.load_file(payload));
        },
        keyboardKeys: ["A"],
    } as ToolbarItem,
    DebugTools.DrawAtoms,
    DebugTools.DrawBonds,
];

const props: IToolbarItemsProps = {
    toolbarItemsList,
    direction: Direction.Left,
};

export default props;
