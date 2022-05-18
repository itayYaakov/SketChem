import "@svgdotjs/svg.filter.js";

import { LayersNames } from "@constants/enum.constants";
import { IdUtils } from "@src/utils/IdUtils";
import { G, Svg } from "@svgdotjs/svg.js";

/* 
Each layer will hold different types of objects, and the order will be as follow:
(When the each layer hide layers above her)

bond
atom_label_background
atom_label_hover
atom_label_text

*/

const mLayersMap = new Map<string, Svg | G>();

export const LayersUtils = {
    setLayers: (canvas: Svg) => {
        Object.values(LayersNames).forEach((layerName) => {
            let group;
            if (layerName === LayersNames.Root) {
                group = canvas.id(IdUtils.getLayerElemId(layerName));
            } else {
                group = canvas.group().id(IdUtils.getLayerElemId(layerName));
            }
            mLayersMap.set(layerName, group);
        });
    },

    getLayer: (layerName: LayersNames) => {
        const result = mLayersMap.get(layerName);
        if (!result) {
            throw new Error(`Layer ${layerName} was not found`);
        }
        return result;
    },
};
