/* eslint-disable no-undef */
import { BondOrder } from "@constants/enum.constants";
import { EntitiesMapsStorage } from "@features/shared/storage";

// Kekule.js is imported in ./public/index.html

let chemDocument = 8;
chemDocument = new Kekule.ChemDocument(1);
const mol = new Kekule.Molecule();
chemDocument.appendChild(mol);

export function getChemDocument() {
    return chemDocument;
}

export function getFileFormatsOptions(rawKekuleFormats) {
    // Example for rawKekuleFormat
    // {
    //     "id": "sd",
    //     "mimeType": "chemical/x-mdl-sdfile",
    //     "fileExts": [
    //         "sd",
    //         "sdf"
    //     ],
    //     "dataType": "text",
    //     "title": "MDL Structure-Data format"
    // }

    // result:
    // <option value="sd" title="chemical/x-mdl-sdfile">MDL Structure-Data format (*.sd, *.sdf)</option> //
    const result = [];
    rawKekuleFormats.forEach((formatRaw) => {
        if (!formatRaw.id || !(formatRaw.fileExts && formatRaw.fileExts.length > 0)) {
            console.error("Non supported file", formatRaw);
            return;
        }

        let extensionString = "";
        formatRaw.fileExts.forEach((ext) => {
            if (extensionString) {
                extensionString += ", ";
            }
            extensionString = `${extensionString}*.${ext}`;
        });

        const format = {
            value: formatRaw.id,
            title: formatRaw.mimeType ?? formatRaw.id,
            name: `${formatRaw.title ?? formatRaw.mimeType ?? formatRaw.id} (${extensionString})`,
        };
        result.push(format);
    });
    return result;
}

export function getKekule() {
    return Kekule;
}

export function importMoleculeFromFile(file, format) {
    try {
        const fileMol = Kekule.IO.loadFormatData(file, format);
        chemDocument.appendChild(fileMol);
        return fileMol;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export function exportFileFromMolecule(format) {
    try {
        const data = Kekule.IO.saveFormatData(chemDocument, format);
        return data;
    } catch (error) {
        console.error(error);
        return "";
    }
}

export function enableBabel() {
    if (Kekule.OpenBabel.isScriptLoaded() === true) return;
    Kekule.OpenBabel.enable(); // .enableOpenBabelFormats();
    //  ! should take a few seconds, may be check if the following is true and create a callback:
}

export function enableIndigo() {
    if (Kekule.Indigo.isScriptLoaded() === true) return;
    Kekule.Indigo.enable();
}

export function getSupportedReadFormats() {
    const formats = Kekule.IO.ChemDataReaderManager.getAllReadableFormats();
    return getFileFormatsOptions(formats);
}

export function getSupportedWriteFormats() {
    const formats = Kekule.IO.ChemDataWriterManager.getAllWritableFormats();
    return getFileFormatsOptions(formats);
}

export function getLinkedBonds(node) {
    return node.getLinkedBonds();
}

export function isAtom(bond) {
    return node.getLinkedBonds();
}

export function destroy(item) {
    return item.finalize();
}

export function getNumericId(id) {
    switch (typeof id) {
        case "string": {
            const result = parseInt(id.match(/[0-9]+$/)[0], 10);
            if (Number.isNaN(result)) {
                throw new Error(`Id type unknown ${id}`);
            }
            return result;
        }
        case "number":
            return id;
        default:
            throw new Error(`Id type unknown ${id}`);
    }
}

export function registerAtomFromAttributes(attributes) {
    // AtomAttributes:
    // id: number;
    // center: Vector2;
    // charge: number;
    // symbol: string;
    // color: string;
    const atom = new Kekule.Atom();
    mol.appendNode(atom);

    atom.id = attributes.id;
    const { symbol, charge, center } = attributes;
    atom.setSymbol(symbol);
    atom.setCharge(charge);
    atom.setCoord2D(center.get());

    return atom;
}

export function registerBondFromAttributes(attributes) {
    // id: number;
    // type: BondOrder;
    // stereo: BondStereoKekule;
    // atomStartId: number;
    // atomEndId: number;
    const { id, order, stereo, atomStartId, atomEndId } = attributes;

    const { atomsMap } = EntitiesMapsStorage;
    const startAtom = EntitiesMapsStorage.getAtomById(atomStartId).getKekuleNode();
    const endAtom = EntitiesMapsStorage.getAtomById(atomEndId).getKekuleNode();

    const bond = new Kekule.Bond();
    mol.appendConnector(bond);

    bond.setId(id);
    bond.setBondOrder(order);
    bond.setConnectedObjs([startAtom, endAtom]);
    bond.setStereo(stereo);

    return bond;
}

export function getImplicitHydrogensCount(atom) {
    const count = atom.getImplicitHydrogenCount();
    if (Number.isNaN(count)) {
        return 0;
    }
    return count;
}

export function getImplicitValence(atom) {
    const count = atom.getImplicitValence();
    if (Number.isNaN(count)) {
        return 0;
    }
    return count;
}

// try catch wrapper for functions with arguments that can throw an error
function tryCatchWrapper(func, ...args) {
    try {
        return func(...args);
    } catch (error) {
        console.error(`Kekule error: ${error}`);
        return undefined;
    }
}

export function getAtomConnectorsList(atom) {
    return tryCatchWrapper(() => {
        const result = [];
        atom.getLinkedConnectors().forEach((connector) => {
            if (connector instanceof Kekule.Bond) {
                result.push(connector);
            }
        });

        return result;
    });
}

export function isHydrogenBond(bond) {
    return tryCatchWrapper(() => {
        if (!(bond instanceof Kekule.Bond)) return false;
        let isHydrogenBondFlag = false;
        bond.getConnectedObjs().forEach((node) => {
            if (node instanceof Kekule.Atom) {
                if (node.isHydrogenAtom()) isHydrogenBondFlag = true;
            }
        });
        return isHydrogenBondFlag;
    });
}

export function getAtomConnectorsObjectWithHydrogenData(atom) {
    return tryCatchWrapper(() => {
        const result = {
            hydrogensBonds: [],
            nonHydrogensBonds: [],
        };
        getAtomConnectorsList(atom).forEach((connector) => {
            if (connector instanceof Kekule.Bond) {
                if (isHydrogenBond(connector)) {
                    result.hydrogensBonds.push(connector);
                    return;
                }
                result.nonHydrogensBonds.push(connector);
            }
        });

        return result;
    });
}

// calculate sum of bond orders based on bond order enum
export function getBondOrderSum(bonds) {
    return bonds.reduce((acc, bond) => {
        if (!(bond instanceof Kekule.Bond)) return acc;

        switch (bond.getBondOrder()) {
            case Kekule.BondOrder.COVALENT:
            case Kekule.BondOrder.SINGLE:
            case Kekule.BondOrder.DEFAULT:
            case Kekule.BondOrder.OTHER:
                return acc + 1;
            case Kekule.BondOrder.DOUBLE:
                return acc + 2;
            case Kekule.BondOrder.TRIPLE:
                return acc + 3;
            case Kekule.BondOrder.QUADRUPLE:
                return acc + 4;
            case Kekule.BondOrder.UNSET:
                return acc;
            case Kekule.BondOrder.EXPLICIT_AROMATIC:
                return acc + 1.5;

            default:
                return acc;
        }
    }, 0);
}

// modified from kekule.js

const defBondAngles = [];
const angle120 = (Math.PI * 2) / 3;
const angle30 = (Math.PI * 30) / 180;
// !!! disabled for now
// defBondAngles[BondOrder.EXPLICIT_AROMATIC] = [angle120];
// defBondAngles[0] = 0; // default value for unset bonds
// defBondAngles[BondOrder.Single] = [angle30];
// defBondAngles[BondOrder.Double][BondOrder.Double] = Math.PI;
// defBondAngles[BondOrder.Double] = [0];
// defBondAngles[BondOrder.Triple] = [0];

defBondAngles[0] = angle120; // default value for unset bonds
defBondAngles[BondOrder.Single] = [angle120];
defBondAngles[BondOrder.Double] = [angle120];
// defBondAngles[BondOrder.Double][BondOrder.Single] = angle30 * 4;
defBondAngles[BondOrder.Double][BondOrder.Double] = Math.PI;
defBondAngles[BondOrder.Triple] = [Math.PI];
defBondAngles[BondOrder.Triple][BondOrder.Single] = Math.PI; // !!! my addition
defBondAngles[BondOrder.Triple][BondOrder.Double] = angle120; // !!! my addition
// defBondAngles[BondOrder.Triple][BondOrder.Triple] = Math.PI; // !!! my addition

/**
 * Get the default bond angle of two valence bonds.
 * @param {Int} bondOrder1
 * @param {Int} bondOrder2
 * @returns {Float}
 */
export function getDefAngleOfBonds(bondOrder1, bondOrder2) {
    let b1 = bondOrder1 || 0;
    let b2 = bondOrder2 || 0;
    if (b1 > b2) {
        b1 = bondOrder2 || 0;
        b2 = bondOrder1 || 0;
    }
    const map = defBondAngles[b2];
    if (!map) return defBondAngles[0]; // default value for unset bonds

    const value = map[b1];
    return value || map[0];
}

/**
 * Returns objects directly link around chemObj.
 * If chemObj is a node, returns node.getLinkedObjs(); if chemObj is connector, returns connector.getLinkedObjs() + connector.getConnectedObjs()
 */
export function getSurroundingObjs(chemObj) {
    const objs = chemObj.getLinkedObjs();

    if (chemObj instanceof Kekule.ChemStructureConnector) {
        // a connector, should also consider other connectors connecting it
        const extraObjs = chemObj.getConnectedObjs();
        Kekule.ArrayUtils.pushUnique(objs, extraObjs);
    }
    return objs;
}

/**
 * Returns default angle when added new bond to startObj.
 * @param {Kekule.ChemObject} startObj
 * @param {Int} newBondOrder
 * @return {Float}
 */
export function getNewBondDefAngle(startObj, newBondOrder = 0) {
    let result;

    const surroundingObjs = getSurroundingObjs(startObj);
    if (surroundingObjs.length === 1) {
        // one existing bond, defAngle is decided by new bond order and existing bond order
        const existingConnector = startObj.getLinkedConnectorAt(0);
        if (existingConnector && existingConnector.getConnectedObjs().indexOf(surroundingObjs[0]) >= 0) {
            const existingBondOrder = existingConnector.getBondOrder ? existingConnector.getBondOrder() : null;
            if (Kekule.ObjUtils.notUnset(existingBondOrder)) {
                result = getDefAngleOfBonds(newBondOrder, existingBondOrder);
            }
        }
    } else if (surroundingObjs.length === 0) {
        // no connected bond, use initialDirection
        result = 0;
        if (newBondOrder === BondOrder.Single) result = (30 * Math.PI) / 180;
    } else {
        result = getDefAngleOfBonds(newBondOrder, 0);
    }
    return result;
}

/**
 * Get direction angle most empty space to a chem object.
 * This function is in 2D mode.
 * @param {Kekule.ChemStructureObject} obj
 * @param {Array} linkedObjs Objects around obj.
 * @param {Bool} allowCoordBorrow
 * @returns {Float}
 */
export function calcMostEmptyDirectionAngleOfChemObj(obj, linkedObjs, allowCoordBorrow) {
    const angles = [];
    // eslint-disable-next-line no-param-reassign
    if (!linkedObjs) linkedObjs = obj.getLinkedObjs();
    const baseCoord = obj.getAbsCoordOfMode(Kekule.CoordMode.COORD2D, allowCoordBorrow);
    for (let i = 0, l = linkedObjs.length; i < l; i += 1) {
        const c = linkedObjs[i].getAbsCoordOfMode(Kekule.CoordMode.COORD2D, allowCoordBorrow);
        const cSub = Kekule.CoordUtils.substract(c, baseCoord);
        let angle = Math.atan2(-cSub.y, cSub.x);
        if (angle < 0) angle = Math.PI * 2 + angle;
        angles.push(angle);
    }
    angles.sort();
    const degAngles = angles.map((e) => (e * 180) / Math.PI);

    const l = angles.length;
    if (l === 0) return 0;
    if (l === 1)
        // only one connector
        return -angles[0];
    // more than two connectors

    let max = 0;
    let index = 0;

    for (let i = 0; i < l; i += 1) {
        const a1 = angles[i];
        const a2 = angles[(i + 1) % l];
        let delta = a2 - a1;
        if (delta < 0) delta += Math.PI * 2;
        if (delta > max) {
            max = delta;
            index = i;
        }
    }
    const result = angles[index] + max / 2;
    return result;
}

// wrapper for function, print before and after
export function getRemovedNodesAndConnectorsAfterFunction(my_mol, func) {
    return function (...args) {
        const nodesBefore = my_mol.getConnectors().map((x) => x.id);
        const connectorsBefore = my_mol.getNodes().map((x) => x.id);

        const result = func(...args);
        // const result = my_mol.clearExplicitBondHydrogens();

        const nodesAfter = my_mol.getConnectors().map((x) => x.id);
        const connectorsAfter = my_mol.getNodes().map((x) => x.id);
        // check which nodes and connectors were removed after the function
        const removedNodes = nodesBefore.filter((x) => !nodesAfter.includes(x));
        const removedConnectors = connectorsBefore.filter((x) => !connectorsAfter.includes(x));

        // wrap them together in an object
        const removed = {
            nodes: removedNodes,
            connectors: removedConnectors,
        };
        return removed;
    };
}

/**
 * When adding a new bond to a node, this function will calculate the most suitable angle (related to X axis) of the bond direction.
 * @param {Object} startingObj
 * @param {Float} defBondAngle Default bond angle of this type of bond.
 * @param {Bool} allowCoordBorrow
 * @returns {Float}
 */
export function calcPreferred2DBondGrowingDirection(startingObj, defBondAngle, allowCoordBorrow) {
    const startingCoord = startingObj.getAbsCoordOfMode(Kekule.CoordMode.COORD2D, allowCoordBorrow);
    const connectedObjs = getSurroundingObjs(startingObj);
    const connectedObjCount = connectedObjs ? connectedObjs.length : 0;
    switch (connectedObjCount) {
        case 0: {
            // no object connected, just add a bond in defAngle
            return defBondAngle; // (Math.PI - defAngle) / 2;
        }
        case 1: {
            // only one bond, add to defAngles
            const refObj = connectedObjs[0];
            const refCoord = refObj.getAbsCoordOfMode(Kekule.CoordMode.COORD2D, allowCoordBorrow);
            const refVector = Kekule.CoordUtils.substract(startingCoord, refCoord);
            const refAngle = Math.atan2(refVector.y, -refVector.x);

            let angle1 = refAngle - defBondAngle;
            let angle2 = refAngle + defBondAngle;
            if (angle1 < 0) angle1 += Math.PI * 2;
            if (angle2 < 0) angle2 += Math.PI * 2;
            let finalAngle;
            // we have two appliable angles, if they are not the same, choose the one closest to horizontal line
            if (angle1 !== angle2) {
                const ca1 = Math.min(
                    angle1 > Math.PI ? Math.abs(angle1 - Math.PI * 2) : angle1,
                    Math.abs(angle1 - Math.PI)
                );
                const ca2 = Math.min(
                    angle2 > Math.PI ? Math.abs(angle2 - Math.PI * 2) : angle2,
                    Math.abs(angle2 - Math.PI)
                );
                finalAngle = ca1 <= ca2 ? angle1 : angle2;
            } else finalAngle = angle1;

            return finalAngle;
        }
        default: {
            // more than one bond, add to most empty direction
            const finalAngle = calcMostEmptyDirectionAngleOfChemObj(startingObj, connectedObjs, allowCoordBorrow);
            return finalAngle;
        }
    }
}

function kekuleinitPropValues() {
    const degreeStep = Math.PI / 180;

    // init defBondAngles array
    const angles = [];
    const BO = Kekule.BondOrder;
    // const angle120 = (Math.PI * 2) / 3;
    // angles[0] = angle120; // default value for unset bonds
    // angles[BO.EXPLICIT_AROMATIC] = [angle120];
    // angles[BO.TRIPLE] = [Math.PI];
    // angles[BO.DOUBLE] = [angle120];
    // angles[BO.DOUBLE][BO.DOUBLE] = Math.PI;
    // angles[BO.SINGLE] = [angle120];

    this.setDefBondAngles(angles);
    this.setBondConstrainedDirectionDelta((10 * Math.PI) / 180);
    this.setBondConstrainedDirectionAngles([0, 90 * degreeStep, 180 * degreeStep, 270 * degreeStep]);
    this.setBondConstrainedDirectionAngleThreshold(degreeStep * 3);
    this.setInitialBondDirection(30 * degreeStep);
}

/**
 * When adding a new bond to a node, this function will calculate the most suitable location of the bond direction.
 * @param {Object} startingObj
 * @param {Float} bondLength
 * @param {Float} defAngle Default bond angle of this type of bond.
 * @param {Bool} allowCoordBorrow
 * @returns {Hash} Coord of the bond's ending point.
 */
function calcPreferred2DBondGrowingLocation(startingObj, bondLength, defAngle, allowCoordBorrow) {
    const startingCoord = startingObj.getAbsCoordOfMode(Kekule.CoordMode.COORD2D, allowCoordBorrow);
    const direction = calcPreferred2DBondGrowingDirection(startingObj, defAngle, allowCoordBorrow);
    return Kekule.CoordUtils.add(startingCoord, {
        x: bondLength * Math.cos(direction),
        y: bondLength * Math.sin(direction),
    });
}

// ? Convert to buttons in the future?
// ! currently disabled by default
// enableBabel()
// enableIndigo()
