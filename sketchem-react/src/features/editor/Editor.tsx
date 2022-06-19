import { useAppDispatch } from "@app/hooks";
import { ChemistryFutureLength, getChemistryDataPresent } from "@app/selectors";
// import { getChemistryDataIndex, isChemistryRedoEnabled, isChemistryStateOlder } from "@app/selectors";
import SketchPad from "@features/sketchpad/SketchPad";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { EditorHandler } from "./EditorHandler";

function Editor(props: { editorHandler: EditorHandler }) {
    const dispatch = useAppDispatch();

    const { editorHandler } = props;

    const futureLength = useSelector(ChemistryFutureLength);

    const [previousFutureLength, setPreviousFutureLength] = useState(0);
    // !!! find a better way
    const presentState = useSelector(getChemistryDataPresent);

    useEffect(() => {
        if (futureLength > previousFutureLength) {
            setPreviousFutureLength(futureLength);
            console.log("its a undo");
        } else if (futureLength < previousFutureLength) {
            setPreviousFutureLength(futureLength);
            console.log("its a redo");
        } else {
            console.log("its synced");
            return;
            // No need to do anything here. Component state in sync with redux
        }
        editorHandler.editAtomsAndBondsBasedOnStateObject(presentState);
    }, [futureLength]);

    editorHandler.setDispatch(dispatch);

    return <SketchPad editor={editorHandler} />;
}

export default Editor;
