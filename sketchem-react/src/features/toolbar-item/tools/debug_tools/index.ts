import { DrawAllPeriodic } from "./drawAllPeriodicTable";
import drawMol from "./drawMol";
import drawTree from "./drawTree";
import { ExportMolToConsoleTool } from "./printMolToConsole";

const DebugTools = [...drawTree, ...drawMol, DrawAllPeriodic, ExportMolToConsoleTool];

export default DebugTools;
