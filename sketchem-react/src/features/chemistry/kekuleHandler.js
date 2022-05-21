/* eslint-disable no-unreachable */
import { getFileContent, getMoleculeCommands } from "@app/selectors";
import { CanvasObject } from "@features/shared/CanvasObject";
import { KekuleUtils } from "@src/utils/KekuleUtils";
import { IBond } from "@types";
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
    const canvas = CanvasObject.get();

    const factor = 100;
    let firstAtomDelta = new Vector2(0, 0);

    canvas.zoom(1);
    // Bo{x: 304.0000000000001, y: 304.0000000000001, w: 1392, width: 1392, h: 1392,…}
    const viewBox = canvas.viewbox();
    const xLocation = 0.3;
    const yLocation = 0.2;

    const initialPoint = new Vector2(viewBox.x + xLocation * viewBox.width, viewBox.y + yLocation * viewBox.height);

    const scaleFactor = 0.9;

    const boundingBox = getBoundingBox(mol);
    const molWidth = boundingBox.maxX - boundingBox.minX;
    const molHeight = boundingBox.maxY - boundingBox.minY;

    const molScaleX = (scaleFactor * viewBox.width) / molWidth;
    const molScaleY = (scaleFactor * viewBox.height) / molHeight;

    // const molScaleMax = Math.max(molScaleX, molScaleY);
    const molScaleMin = Math.min(molScaleX, molScaleY);
    const molScale = molScaleMin;
    // canvas
    //     .rect(scaleFactor * viewBox.width, scaleFactor * viewBox.height)
    //     .move(initialPoint.x, initialPoint.y)
    //     .fill("#0000ff");
    // canvas.rect(molWidth, molHeight).move(initialPoint.x, initialPoint.y).fill("#ff0000");

    for (let i = 0, l = mol.getNodeCount(); i < l; i += 1) {
        const node = mol.getNodeAt(i);
        const { x, y } = node.absCoord2D;
        let pos = new Vector2(x, -y).scale(molScale);
        if (firstAtomDelta.x === 0 && firstAtomDelta.y === 0) {
            firstAtomDelta = pos;
        }
        const id = Atom.generateNewId();
        node.id = id;
        pos = pos.sub(firstAtomDelta).add(initialPoint);
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
    const canvas = CanvasObject.get();
    const mol = KekuleUtils.getKekule().IO.loadFormatData(fileContent, "mol");
    drawMol(mol);
};

export function KekuleShow() {
    const fileContent = useSelector(getFileContent);

    function setup() {}
    useEffect(setup, []);
    useEffect(() => drawMolOneTime(fileContent), [fileContent]);

    if (!fileContent) return null;
    if (!CanvasObject.get()) {
        console.log("canvas is empty!!");
    }

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
