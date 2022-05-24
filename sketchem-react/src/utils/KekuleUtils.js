/* eslint-disable no-undef */
import { EntitiesMapsStorage } from "@features/shared/storage";

// Kekule.js is imported in ./public/index.html

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

export function enableBabel() {
    Kekule.OpenBabel.enable(); // .enableOpenBabelFormats();
    //  ! should take a few seconds, may be check if the following is true and create a callback:
    // Kekule.Indigo.isScriptLoaded()
}

export function enableIndigo() {
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
    const startAtom = EntitiesMapsStorage.getMapInstanceById(atomsMap, atomStartId).getKekuleNode();
    const endAtom = EntitiesMapsStorage.getMapInstanceById(atomsMap, atomEndId).getKekuleNode();

    const bond = new Kekule.Bond();
    bond.setId(id);
    bond.setBondOrder(order);
    bond.setConnectedObjs([startAtom, endAtom]);
    bond.setStereo(stereo);

    return bond;
}

// ? Convert to buttons in the future?
// ! currently disabled by default
// enableBabel()
// enableIndigo()
