/* eslint-disable @typescript-eslint/no-unused-vars */
import { store } from "@app/store";
import * as ToolsConstants from "@constants/tools.constants";
import { RegisterToolbarButtonWithName } from "@features/toolbar-item/ToolsButtonMapper.helper";

import { ActiveToolbarItem, LaunchAttrs, SimpleToolbarItemButtonBuilder } from "../../ToolbarItem";
import { actions } from "../../toolbarItemsSlice";
import { RegisterToolbarWithName } from "../ToolsMapper.helper";

class DrawMolClass implements ActiveToolbarItem {
    i: number = 0;

    onActivate(attrs?: LaunchAttrs) {
        if (!attrs) return;
        const { editor } = attrs;
        if (!editor) {
            throw new Error("DrawMolClass.onActivate: missing attributes or editor");
        }

        if (this.i !== 0) {
            return;
        }
        this.i += 1;
        const payload = {
            content:
                "mannitol.mol\n  Ketcher  51622 0392D 1   1.00000     0.00000     0\n\n 13 11  0  0  0  0            999 V2000\n   13.1079   -7.3500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   12.2421   -7.8500    0.0000 I   0  0  0  0  0  0  0  0  0  0  0  0\n   13.9741   -7.8500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   13.1079   -6.3500    0.0000 Br  0  0  0  0  0  0  0  0  0  0  0  0\n   11.3759   -7.3500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   12.2421   -8.8500    0.0000 S   0  0  0  0  0  0  0  0  0  0  0  0\n   14.8399   -7.3500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   13.9741   -8.8500    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n   10.5101   -7.8500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   11.3759   -6.3500    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   15.7060   -7.8500    0.0000 I   0  0  0  0  0  0  0  0  0  0  0  0\n    9.6440   -7.3500    0.0000 P   0  0  0  0  0  0  0  0  0  0  0  0\n    7.6440   -7.3500    0.0000 Xe   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  2  0  0  0  0\n  1  3  1  0  0  0  0\n  1  4  1  6  0  0  0\n  2  5  2  0  0  0  0\n  2  6  1  6  0  0  0\n  3  7  1  0  0  0  0\n  3  8  1  1  0  0  0\n  5  9  1  0  0  0  0\n  5 10  1  1  0  0  0\n  7 11  3  0  0  0  0\n  9 12  1  0  0  0  0\nM  END\n",
            format: "mol",
            replace: true,
        };
        store.dispatch(actions.loadFile(payload));
        editor.createHistoryUpdate();
    }
    // {
    //     name: "Load an example .mol file (debug)",
    //     tool: {
    //         onActivate: () => {
    //             if (i !== 0) {
    //                 return;
    //             }
    //             i += 1;
    //             const payload = {
    //                 content:
    //                     "mannitol.mol\n  Ketcher  51622 0392D 1   1.00000     0.00000     0\n\n 13 11  0  0  0  0            999 V2000\n   13.1079   -7.3500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   12.2421   -7.8500    0.0000 I   0  0  0  0  0  0  0  0  0  0  0  0\n   13.9741   -7.8500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   13.1079   -6.3500    0.0000 Br  0  0  0  0  0  0  0  0  0  0  0  0\n   11.3759   -7.3500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   12.2421   -8.8500    0.0000 S   0  0  0  0  0  0  0  0  0  0  0  0\n   14.8399   -7.3500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   13.9741   -8.8500    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n   10.5101   -7.8500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   11.3759   -6.3500    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   15.7060   -7.8500    0.0000 I   0  0  0  0  0  0  0  0  0  0  0  0\n    9.6440   -7.3500    0.0000 P   0  0  0  0  0  0  0  0  0  0  0  0\n    7.6440   -7.3500    0.0000 Xe   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  2  0  0  0  0\n  1  3  1  0  0  0  0\n  1  4  1  6  0  0  0\n  2  5  2  0  0  0  0\n  2  6  1  6  0  0  0\n  3  7  1  0  0  0  0\n  3  8  1  1  0  0  0\n  5  9  1  0  0  0  0\n  5 10  1  1  0  0  0\n  7 11  3  0  0  0  0\n  9 12  1  0  0  0  0\nM  END\n",
    //                 format: "mol",
    //                 replace: true,
    //             };
    //             store.dispatch(actions.load_file(payload));
    //         },
    //     },
    //     keyboardKeys: ["A"],
    // } as ToolbarItemButton,
}

const drawMolTool = new DrawMolClass();

RegisterToolbarWithName(ToolsConstants.ToolsNames.DebugLoadExampleMol, drawMolTool);

const DrawMol = new SimpleToolbarItemButtonBuilder(
    "draw example .mol (debug)",
    ToolsConstants.ToolsNames.DebugLoadExampleMol
);

RegisterToolbarButtonWithName(DrawMol);

export default [DrawMol];
