/* eslint-disable no-unreachable */
import { getFileContent, getMoleculeCommands } from "@app/selectors";
import { EditorConstants } from "@constants/editor.constant";
import { LayersNames } from "@constants/enum.constants";
import * as KekuleUtils from "@src/utils/KekuleUtils";
import { LayersUtils } from "@src/utils/LayersUtils";
import Vector2 from "@utils/mathsTs/Vector2";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { Atom, Bond } from "../../entities";

const getBoundingBox = (mol) => {
    // {x2: maxX, x1: minX, y2: maxY, y1: minY}
    const { x1: minX, y1: minY, x2: maxX, y2: maxY } = mol.getContainerBox2D();
    return { minX, minY, maxX, maxY };
};

const drawMol = (mol) => {
    const canvas = LayersUtils.getLayer(LayersNames.Root);

    const firstAtomDelta = new Vector2(0, 0);

    // canvas.zoom(1);
    // Bo{x: 304.0000000000001, y: 304.0000000000001, w: 1392, width: 1392, h: 1392,…}
    const viewBox = canvas.viewbox();
    const targetCenterPoint = new Vector2(viewBox.x + 0.5 * viewBox.width, viewBox.y + 0.5 * viewBox.height);

    const molBoundingBox = getBoundingBox(mol);
    const molWidth = molBoundingBox.maxX - molBoundingBox.minX;
    const molHeight = molBoundingBox.maxY - molBoundingBox.minY;

    const scaleFactor = 0.9;
    const molScaleX = (scaleFactor * viewBox.width) / molWidth;
    const molScaleY = (scaleFactor * viewBox.height) / molHeight;

    const molScaleMin = Math.min(molScaleX, molScaleY);
    // const molScale = molScaleMin;
    const molScale = EditorConstants.Scale;

    // const initialPoint = new Vector2(viewBox.x + xLocation * viewBox.width, viewBox.y + yLocation * viewBox.height);

    const sourceCenterPoint = new Vector2(
        molBoundingBox.minX + 0.5 * molWidth,
        -(molBoundingBox.minY + 0.5 * molHeight)
    ).scaleNew(molScale);

    const pointsDelta = targetCenterPoint.subNew(sourceCenterPoint);

    if (0) {
        const molMax = new Vector2(molBoundingBox.maxX, -molBoundingBox.maxY).scaleNew(molScale);
        const molMin = new Vector2(molBoundingBox.minX, -molBoundingBox.minY).scaleNew(molScale);

        const molMinModifed = molMin.addNew(pointsDelta);
        const molMaxModifed = molMax.addNew(pointsDelta);

        canvas.circle(80).cx(sourceCenterPoint.x).cy(sourceCenterPoint.y).fill({ color: "#0000ff", opacity: 1 });

        const newMovedSourcePoint = new Vector2(sourceCenterPoint.x, sourceCenterPoint.y).addSelf(pointsDelta);
        canvas.circle(80).cx(newMovedSourcePoint.x).cy(newMovedSourcePoint.y).fill({ color: "#00ff00", opacity: 1 });
        canvas.circle(60).cx(molMax.x).cy(molMax.y).fill({ color: "#abcd00", opacity: 1 });
        canvas.circle(60).cx(molMin.x).cy(molMin.y).fill({ color: "#abcd00", opacity: 1 });

        canvas.circle(60).cx(molMaxModifed.x).cy(molMaxModifed.y).fill({ color: "#fbcdf0", opacity: 1 });
        canvas.circle(60).cx(molMinModifed.x).cy(molMinModifed.y).fill({ color: "#fbcdf0", opacity: 1 });
    }

    // canvas
    //     .rect(scaleFactor * viewBox.width, scaleFactor * viewBox.height)
    //     .move(initialPoint.x, initialPoint.y)
    //     .fill("#0000ff");
    // canvas.rect(molWidth, molHeight).move(initialPoint.x, initialPoint.y).fill("#ff0000");

    for (let i = 0, l = mol.getNodeCount(); i < l; i += 1) {
        const node = mol.getNodeAt(i);
        const { x, y } = node.absCoord2D;
        const pos = new Vector2(x, -y).scaleSelf(molScale).addSelf(pointsDelta);
        // const pos = new Vector2(x, -y);
        // pos.scaleNew(molScale);
        // pos.add(pointsDelta);
        const id = Atom.generateNewId();
        node.id = id;
        node.setCoord2D({ x: pos.x, y: pos.y });

        const atom = new Atom({ nodeObj: node });
        atom.draw();
    }
    // iterate all connectors(bonds)
    for (let i = 0, l = mol.getConnectorCount(); i < l; i += 1) {
        const connector = mol.getConnectorAt(i);
        const id = Bond.generateNewId();
        connector.id = id;
        const bond = new Bond({ connectorObj: connector });
        bond.draw(canvas);
    }
};

const drawMolOneTime = (fileContent) => {
    if (!fileContent) return;
    const mol = KekuleUtils.importMoleculeFromFile(fileContent, "mol");
    drawMol(mol);
};

export function KekuleShow() {
    const fileContent = useSelector(getFileContent);

    function setup() {}
    useEffect(setup, []);
    useEffect(() => drawMolOneTime(fileContent), [fileContent]);

    if (!fileContent) return null;

    // setCount(count.current + 10);
    // console.log(Object.keys(K.Kekule.));

    return null;
}

// // var Kekule = require('../../dist/kekule.min.js').Kekule;

// // Create a simple CO2 molecule
// const mol = new Kekule.Molecule();
// const atomC = mol.appendAtom("C");
// const atomO1 = mol.appendAtom("O");
// const atomO2 = mol.appendAtom("O");
// mol.appendBond([atomC, atomO1], 2);
// mol.appendBond([atomC, atomO2], 2);

// // Output formula
// const formula = mol.calcFormula();
// console.log("Formula: ", formula.getText());

// // Output SMILES
// const smiles = KekuleRef.current.IO.saveFormatData(mol, "smi");
// console.log("SMILES: ", smiles);

// // Output MOL2k
// const mol2k = KekuleRef.current.IO.saveFormatData(mol, "mol");
// console.log("MOL 2000: \n", mol2k);
