import { getFileContent, getMoleculeCommands } from "@app/selectors";
import Vector2 from "@utils/mathsTs/Vector2";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { BondStereoKekuleMap } from "src/constants/enum.constants";

import { Atom, Bond } from "../../entities";
import { Canvas } from "../sketchpad/SketchPad";
// eslint-disable-next-line import/extensions
import * as K from "./kekule-js-dist/kekule.js?module=core,algorithm,calculation,io,extra";

const { Kekule } = K;

function drawMol(mol) {
    if (!Canvas) {
        console.log("canvas is empty!!");
    }
    const canvas = Canvas;

    const factor = 100;
    let firstAtomDelta = new Vector2(0, 0);
    for (let i = 0, l = mol.getNodeCount(); i < l; i += 1) {
        const node = mol.getNodeAt(i);
        node.id = i + 1;
        const { x, y } = node.absCoord2D;
        console.log(x * factor, y * factor);
        let pos = new Vector2(x * factor, y * factor);
        if (firstAtomDelta.x === 0 && firstAtomDelta.y === 0) {
            firstAtomDelta = pos;
        }
        pos = pos.sub(firstAtomDelta);
        console.log(pos.x, pos.y);
        console.log(`node ${i}`, node.getClassName(), node.getLabel());
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
            connector.stereo,
            "transposed stereo",
            BondStereoKekuleMap.get(connector.stereo)
        );
        const bond = new Bond(
            order,
            BondStereoKekuleMap.get(connector.stereo),
            connector.getConnectedObjs()[0].id,
            connector.getConnectedObjs()[1].id
        );
        bond.draw(canvas);
    }
}

export function KekuleShow() {
    const fileContent = useSelector(getFileContent);
    if (!fileContent) return null;
    const mol = Kekule.IO.loadFormatData(fileContent, "mol");
    drawMol(mol);
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
// const smiles = Kekule.IO.saveFormatData(mol, "smi");
// console.log("SMILES: ", smiles);

// // Output MOL2k
// const mol2k = Kekule.IO.saveFormatData(mol, "mol");
// console.log("MOL 2000: \n", mol2k);
