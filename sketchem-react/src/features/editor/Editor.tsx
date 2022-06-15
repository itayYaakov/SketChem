import { useAppDispatch } from "@app/hooks";
import {
    ChemistryFutureLength,
    getChemistryDataIndex,
    getChemistryDataPresent,
    isChemistryRedoEnabled,
} from "@app/selectors";
// import { getChemistryDataIndex, isChemistryRedoEnabled, isChemistryStateOlder } from "@app/selectors";
import SketchPad from "@features/sketchpad/SketchPad";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { EditorHandler } from "./EditorHandler";

function Editor(props: { editorHandler: EditorHandler }) {
    const dispatch = useAppDispatch();
    const chemistryIndex = useSelector(getChemistryDataIndex);
    const theresFuture = useSelector(isChemistryRedoEnabled);

    const { editorHandler } = props;

    const futureLength = useSelector(ChemistryFutureLength);

    const [previousFutureLength, setPreviousFutureLength] = useState(0);
    // !!! find a better way
    const presentState = useSelector(getChemistryDataPresent);

    const handleManualAction = () => {
        // Set to zero on manual action
        setPreviousFutureLength(0);
        console.log("Now I wan't to redraw");
    };

    useEffect(() => {
        console.log("futureLength=", futureLength, "previousFutureLength=", previousFutureLength);
        if (futureLength > previousFutureLength) {
            // An undo must have been called. Handle it and update previousFutureLength
            setPreviousFutureLength(futureLength);
            console.log("its a undo");
        } else if (futureLength < previousFutureLength) {
            // This *must* be a redo because if MY_ACTION was dispatched then
            // previousFutureLength would be reset to zero which equals `future.length`
            setPreviousFutureLength(futureLength);
            console.log("its a redo");
        } else {
            console.log("its synced");
            return;
            // No need to do anything here. Component state in sync with redux
        }
        editorHandler.editAtomsAndBondsBasedOnStateObject(presentState);
    }, [futureLength]);

    // if (theresFuture || chemistryIndex === highestVisitedIndex) {
    //     const presentState = useSelector(getChemistryDataPresent);
    //     console.log("I need to redraw the editor", presentState);
    //     // editorHandler.editAtomsAndBondsBasedOnStateObject(presentState);
    // }

    // if (chemistryIndex && !theresFuture) highestVisitedIndex = Math.max(highestVisitedIndex, chemistryIndex);

    // console.log("Editor chemistryIndex=", chemistryIndex);
    // const myIsChemistryStateOlder = useSelector(isChemistryStateOlder);
    // console.log("Editor myIsChemistryStateOlder=", myIsChemistryStateOlder);

    editorHandler.setDispatch(dispatch);

    return <SketchPad editor={editorHandler} />;
}

export default Editor;
