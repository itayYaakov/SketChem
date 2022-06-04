// based on Accelrys/BIOVIA Valence Table (post 2014)

import { ElementsData } from "@constants/elements.constants";

const defaultValenceByElement = new Map<string, number[]>();

// convert atomic number to symbol

defaultValenceByElement.set("H", [1]);
defaultValenceByElement.set("He", [0]);
defaultValenceByElement.set("B", [3]);
defaultValenceByElement.set("C", [4]);
defaultValenceByElement.set("N", [3]);
defaultValenceByElement.set("O", [2]);
defaultValenceByElement.set("F", [1]);
defaultValenceByElement.set("Ne", [0]);
defaultValenceByElement.set("Si", [4]);
defaultValenceByElement.set("P", [3, 5]);
defaultValenceByElement.set("S", [2, 4, 6]);
defaultValenceByElement.set("Cl", [1, 3, 5, 7]);
defaultValenceByElement.set("Ar", [0]);
defaultValenceByElement.set("As", [3, 5]);
defaultValenceByElement.set("Se", [2, 4, 6]);
defaultValenceByElement.set("Br", [1]);
defaultValenceByElement.set("Kr", [0]);
defaultValenceByElement.set("Te", [2, 4, 6]);
defaultValenceByElement.set("I", [1, 3, 5, 7]);
defaultValenceByElement.set("Xe", [0]);
defaultValenceByElement.set("At", [1, 3, 5, 7]);
defaultValenceByElement.set("Rn", [0]);

export function calculateImplicitValence(atomicNumber: number, charge: number, nonHydrogenBondsSum: number) {
    let referenceAtom = atomicNumber;
    if (charge !== 0) {
        if (atomicNumber === 13 && charge === -1) {
            // special case for aluminium with -1 charge
            return 4;
        }
        const isoelectronicAnalogAtomicNumber = atomicNumber - charge;
        referenceAtom = isoelectronicAnalogAtomicNumber < 0 ? 0 : isoelectronicAnalogAtomicNumber;
    }
    const possibleValences = defaultValenceByElement.get(ElementsData.atomicNumberToSymbol(referenceAtom));

    if (!possibleValences) {
        return undefined;
    }

    if (charge !== 0) {
        // Charged atoms in group 3a-7a elements with atomic number >20 are an exception because of the
        // presence of the transition elements. If the charge shifts the element into or through the transition
        // region of the table, then the atom will have the behavior of a metal and it will have no implicit
        // hydrogens

        if (atomicNumber > 20) {
            const referenceAtomY = ElementsData.elementsByAtomicNumberMap.get(referenceAtom)!.y;
            const atomicY = ElementsData.elementsByAtomicNumberMap.get(atomicNumber)!.y;

            // if the difference between the atomic number and the isoelectronic analog is
            // different than the delta in the table y position
            if (Math.abs(atomicY - referenceAtomY) !== Math.abs(atomicNumber - referenceAtom)) {
                // If an isoelectronic shift passes through or ends on an element with undefined default valence, then the default valence for that charged atom is undefined.
                // read more: https://depth-first.com/articles/2020/04/13/hydrogen-suppression-in-molfiles/
                return undefined;
            }
        }
    }

    // find the valence of the atom based on the first default valence value greater than nonHydrogenBondsSum
    const valence = possibleValences.find((v) => v >= nonHydrogenBondsSum);

    return valence;
}

export function calculateImplicitHydrogenCount(
    atomicNumber: number,
    charge: number,
    nonHydrogenBondsSum: number,
    totalBondsSum: number
) {
    const valence = calculateImplicitValence(atomicNumber, charge, nonHydrogenBondsSum);
    if (!valence) {
        return 0;
    }

    // if (this.implicitH < 0) {
    //     this.valence = conn
    //     this.implicitH = 0
    //     this.badConn = true
    //     return false
    //   }

    // return the difference between the valence and the total bonds sum, or 0 if the valence is greater than the total bonds sum
    return Math.max(valence - (totalBondsSum - nonHydrogenBondsSum) - totalBondsSum, 0);
}
