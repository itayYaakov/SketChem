/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { store } from "@app/store";
import { ToolsConstants } from "@constants/tools.constants";
import { actions } from "@features/toolbar-item/toolbarItemsSlice";
import { SaveFileAction } from "@src/types";

import { ActiveToolbarItem, SimpleToolbarItemButtonBuilder } from "../../ToolbarItem";
import { RegisterToolbarWithName } from "../ToolsMapper.helper";

class ExportMolToConsole implements ActiveToolbarItem {
    onActivate() {
        const payload: SaveFileAction = {
            format: "mol",
        };
        store.dispatch(actions.exportToFile(payload));
    }
}

const exportMolToConsole = new ExportMolToConsole();

RegisterToolbarWithName(ToolsConstants.ToolsNames.DebugExportMolToConsole, exportMolToConsole);

const ExportMolToConsoleTool = new SimpleToolbarItemButtonBuilder(
    "export mol to console (debug) ",
    ToolsConstants.ToolsNames.DebugExportMolToConsole,
    ["A"]
);

export { ExportMolToConsoleTool };
