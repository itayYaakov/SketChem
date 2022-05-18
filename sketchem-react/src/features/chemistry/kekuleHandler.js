/* eslint-disable no-unreachable */
import { getFileContent, getMoleculeCommands } from "@app/selectors";
import { CanvasObject } from "@features/shared/CanvasObject";
import Vector2 from "@utils/mathsTs/Vector2";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { Atom, Bond } from "../../entities";
// eslint-disable-next-line import/extensions
import * as K from "./kekule-js-dist/kekule.js?module=core,algorithm,calculation,io,extra";

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

    // canvas.rect(10, 10).move(initialPoint.x, initialPoint.y);

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
        console.log(`node ${i}`, node.getClassName(), node.getLabel(), x, y);
        pos = pos.sub(firstAtomDelta).add(initialPoint);
        // const atom = new Atom({ symbol: node.getLabel(), center: pos, id: node.id });
        const atom = new Atom({ symbol: node.getLabel(), center: pos });
        node.id = atom.getId();
        atom.draw(canvas);
    }
    // iterate all connectors(bonds)
    for (let i = 0, l = mol.getConnectorCount(); i < l; i += 1) {
        const connector = mol.getConnectorAt(i);
        const order = connector.getBondOrder ? connector.getBondOrder() : 0;
        console.log(
            `connector ${i}`,
            connector.getClassName(),
            connector.getBondOrder ? connector.getBondOrder() : "?",
            "real stereo",
            // connector.getStereo()
            connector.stereo,
            "transposed stereo"
        );
        const bond = new Bond(
            order,
            connector.stereo,
            connector.getConnectedObjs()[0].id,
            connector.getConnectedObjs()[1].id
        );
        bond.draw(canvas);
    }
};

const drawMolOneTime = (fileContent, kek) => {
    if (!fileContent) return;
    const canvas = CanvasObject.get();
    // const rect = canvas.rect(10, 10);
    // console.log(rect);
    const child = document.createElement("div");
    child.id = "STUPODTEST";
    document.body.appendChild(child);
    const mol = kek.IO.loadFormatData(fileContent, "mol");
    drawMol(mol);
};

export function KekuleShow() {
    const KekuleRef = useRef(null);
    const fileContent = useSelector(getFileContent);

    function setup() {
        const { Kekule } = K;
        KekuleRef.current = Kekule;
    }
    useEffect(setup, []);
    useEffect(() => drawMolOneTime(fileContent, KekuleRef.current), [fileContent]);

    if (!fileContent) return null;
    if (!CanvasObject.get()) {
        console.log("canvas is empty!!");
    }

    // setCount(count.current + 10);
    // console.log(Object.keys(K.Kekule.));

    return <div />;
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
