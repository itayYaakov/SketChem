/* eslint-disable no-unreachable */
import { EditorConstants } from "@constants/editor.constant";
import { LayersNames } from "@constants/enum.constants";
import * as KekuleUtils from "@src/utils/KekuleUtils";
import { LayersUtils } from "@src/utils/LayersUtils";
import Vector2 from "@utils/mathsTs/Vector2";
import _ from "lodash";

import { Atom, Bond } from "../../entities";

const getBoundingBox = (mol) => {
    // {x2: maxX, x1: minX, y2: maxY, y1: minY}
    let box = mol.getContainerBox2D();
    if (!box || !box.x1 || !box.x2 || !box.y1 || !box.y2) box = mol.getContainerBox3D();
    const { x1: minX, y1: minY, x2: maxX, y2: maxY } = box;
    return { minX, minY, maxX, maxY };
};

export const drawMol = (mol) => {
    const canvas = LayersUtils.getLayer(LayersNames.Root);

    // canvas.zoom(1);
    // Bo{x: 304.0000000000001, y: 304.0000000000001, w: 1392, width: 1392, h: 1392,…}
    const viewBox = canvas.viewbox();
    const targetCenterPoint = new Vector2(viewBox.x + 0.5 * viewBox.width, viewBox.y + 0.5 * viewBox.height);

    const molBoundingBox = getBoundingBox(mol);
    const molWidth = molBoundingBox.maxX - molBoundingBox.minX;
    const molHeight = molBoundingBox.maxY - molBoundingBox.minY;

    const molScale = EditorConstants.Scale;

    const sourceCenterPoint = new Vector2(
        molBoundingBox.minX + 0.5 * molWidth,
        -(molBoundingBox.minY + 0.5 * molHeight)
    ).scaleNew(molScale);

    const pointsDelta = targetCenterPoint.subNew(sourceCenterPoint);
    for (let i = 0, l = mol.getNodeCount(); i < l; i += 1) {
        const node = mol.getNodeAt(i);
        const { x, y } = _.isEmpty(node.absCoord2D) ? node.absCoord3D : node.absCoord2D;
        if (x === undefined || y === undefined || Number.isNaN(x) || Number.isNaN(y))
            throw new Error("Invalid atom coord, please check molecule file");
        const pos = new Vector2(x, -y).scaleSelf(molScale).addSelf(pointsDelta);

        console.log(`${i}. old: ${x},${y} new: ${pos.x},${pos.y}`);
        // const pos = new Vector2(x, -y);
        // pos.scaleNew(molScale);
        // pos.add(pointsDelta);
        const id = Atom.generateNewId();
        node.id = id;
        node.setCoord2D({ x: pos.x, y: pos.y });

        const atom = new Atom({ nodeObj: node });
        atom.execOuterDrawCommand();
    }
    // iterate all connectors(bonds)
    for (let i = 0, l = mol.getConnectorCount(); i < l; i += 1) {
        const connector = mol.getConnectorAt(i);
        const id = Bond.generateNewId();
        connector.id = id;
        const bond = new Bond({ connectorObj: connector });
        bond.draw(canvas);
    }

    // merge fragments
    const realMol = KekuleUtils.getMolObject();
    KekuleUtils.MergeStructFragment(mol, realMol);
};

export const drawMolFromFile = (fileContext) => {
    if (!fileContext.format || !fileContext.content) return;
    const mol = KekuleUtils.importMoleculeFromFile(fileContext.content, fileContext.format);
    if (mol === undefined) return;
    drawMol(mol);
};
