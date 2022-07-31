import * as ToolsConstants from "@constants/tools.constants";
import type { ToolbarItemButton } from "@features/toolbar-item/ToolbarItem";
import { AtomToolbarItemButton } from "@features/toolbar-item/tools/AtomTool";
import React from "react";

// bonds
import { ReactComponent as BondDoubleIcon } from "./bond_double.svg";
import { ReactComponent as BondSingleIcon } from "./bond_single.svg";
import { ReactComponent as BondSingleOrDoubleIcon } from "./bond_single_or_double.svg";
import { ReactComponent as BondTripleIcon } from "./bond_triple.svg";
import { ReactComponent as BondWedgeBackIcon } from "./bond_wedge_back.svg";
import { ReactComponent as BondWedgeFrontIcon } from "./bond_wedge_front.svg";
// icons
import { ReactComponent as ChainIcon } from "./chain.svg";
import { ReactComponent as ChargeMinus } from "./charge_minus.svg";
import { ReactComponent as ChargePlus } from "./charge_plus.svg";
import { ReactComponent as ClearCanvasIcon } from "./clear_canvas.svg";
import { ReactComponent as CopyIcon } from "./copy.svg";
import { ReactComponent as EraseIcon } from "./erase.svg";
import { ReactComponent as ExportIcon } from "./export.svg";
import { ReactComponent as ImportIcon } from "./import.svg";
import { ReactComponent as PasteIcon } from "./paste.svg";
import { ReactComponent as PeriodicTable } from "./periodic_table.svg";
import { ReactComponent as RedoIcon } from "./redo.svg";
import { ReactComponent as SelectBoxIcon } from "./select_box.svg";
import { ReactComponent as SelectLassoIcon } from "./select_lasso.svg";
import { ReactComponent as UndoIcon } from "./undo.svg";

type ButtonType = React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
        title?: string | undefined;
    }
>;
// create a map, where the key is the tool name and the value is the icon
const IconsMap = new Map<string, ButtonType>();
IconsMap.set(ToolsConstants.ToolsNames.Chain, ChainIcon);
IconsMap.set(ToolsConstants.ToolsNames.Clear, ClearCanvasIcon);
IconsMap.set(ToolsConstants.ToolsNames.Copy, CopyIcon);
IconsMap.set(ToolsConstants.ToolsNames.Erase, EraseIcon);
IconsMap.set(ToolsConstants.ToolsNames.Export, ExportIcon);
IconsMap.set(ToolsConstants.ToolsNames.Import, ImportIcon);
IconsMap.set(ToolsConstants.ToolsNames.Paste, PasteIcon);
IconsMap.set(ToolsConstants.ToolsNames.PeriodicTable, PeriodicTable);
IconsMap.set(ToolsConstants.ToolsNames.SelectBox, SelectBoxIcon);
IconsMap.set(ToolsConstants.ToolsNames.SelectLasso, SelectLassoIcon);

// bonds
IconsMap.set(ToolsConstants.SubToolsNames.BondDouble, BondDoubleIcon);
IconsMap.set(ToolsConstants.SubToolsNames.BondSingle, BondSingleIcon);
IconsMap.set(ToolsConstants.SubToolsNames.BondTriple, BondTripleIcon);
IconsMap.set(ToolsConstants.SubToolsNames.BondSingleOrDouble, BondSingleOrDoubleIcon);
IconsMap.set(ToolsConstants.SubToolsNames.BondWedgeBack, BondWedgeBackIcon);
IconsMap.set(ToolsConstants.SubToolsNames.BondWedgeFront, BondWedgeFrontIcon);

// charge
IconsMap.set(ToolsConstants.SubToolsNames.ChargeMinus, ChargeMinus);
IconsMap.set(ToolsConstants.SubToolsNames.ChargePlus, ChargePlus);

// undo redo
IconsMap.set(ToolsConstants.ToolsNames.Undo, UndoIcon);
IconsMap.set(ToolsConstants.ToolsNames.Redo, RedoIcon);

const IconSize = "2.5rem";
const IconFontSize = "2rem";

// function generateAtomIcon(tool: AtomToolbarItemButton): JSX.Element {
function generateAtomIcon(tool: AtomToolbarItemButton): (props: any) => JSX.Element {
    const { attributes } = tool;
    const { label, color } = attributes;

    // create an div with label in horizontal and vertical center, and with the color
    function Icon(props: any) {
        const { height } = props;
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color,
                    fontWeight: "600",
                    // fontSize: IconSize,
                    // lineHeight: height / 2,
                    // width: width / 2,
                    // height: height / 2,
                    fontSize: IconFontSize,
                    lineHeight: height,
                    // borderRadius: "50%",
                }}
                {...props}
            >
                {label}
            </div>
        );
    }

    return Icon;
}

function generateDebugIcon(tool: ToolbarItemButton): (props: any) => JSX.Element {
    const { name } = tool;

    function Icon() {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "400",
                    fontSize: "0.65em",
                    lineHeight: "0.8em",
                    height: "4em",
                    width: IconSize,
                }}
            >
                {name}
            </div>
        );
    }

    return Icon;
}

export default function getToolbarIconByName(tool: ToolbarItemButton, ...props: any) {
    const name = tool.subToolName ?? tool.toolName;
    let Icon;
    if (tool.toolName === ToolsConstants.ToolsNames.Atom) {
        Icon = generateAtomIcon(tool as AtomToolbarItemButton);
    } else if (tool.toolName && tool.toolName.startsWith("debug")) {
        Icon = generateDebugIcon(tool);
    }
    Icon = Icon ?? IconsMap.get(name);
    if (!Icon) {
        return <div />;
    }
    return <Icon width={IconSize} height={IconSize} fill="#424242" stroke="#424242" {...props} />;
}
