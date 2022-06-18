/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { store } from "@app/store";
import * as ToolsConstants from "@constants/tools.constants";
import { actions } from "@features/toolbar-item/toolbarItemsSlice";
import { RegisterToolbarButtonWithName } from "@features/toolbar-item/ToolsButtonMapper.helper";
import { SaveFileAction } from "@src/types";
import { exportFileFromMolecule } from "@src/utils/KekuleUtils";

import { ActiveToolbarItem, LaunchAttrs, SimpleToolbarItemButtonBuilder } from "../../ToolbarItem";
import { RegisterToolbarWithName } from "../ToolsMapper.helper";

class ExportMolToConsole implements ActiveToolbarItem {
    onActivate(attrs?: LaunchAttrs) {
        if (!attrs) return;
        const { editor } = attrs;
        if (!editor) {
            throw new Error("Paste.onActivate: missing attributes or editor");
        }
        editor.updateAllKekuleNodes();
        const content = exportFileFromMolecule("mdl");
        console.log(content);
    }
}

const exportMolToConsole = new ExportMolToConsole();

RegisterToolbarWithName(ToolsConstants.ToolsNames.DebugExportMolToConsole, exportMolToConsole);

const ExportMolToConsoleTool = new SimpleToolbarItemButtonBuilder(
    "export mol to console (debug) ",
    ToolsConstants.ToolsNames.DebugExportMolToConsole,
    ["A"]
);

RegisterToolbarButtonWithName(ExportMolToConsoleTool);

export { ExportMolToConsoleTool };
