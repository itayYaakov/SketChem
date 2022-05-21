// eslint-disable-next-line import/extensions
import * as K from "./kekule-js-dist/kekule.js?module=core,algorithm,calculation,io,extra";

const { Kekule } = K;

export const KekuleUtils = {
    getKekule: () => Kekule,
    getNumericId: (id) => {
        switch (typeof id) {
            case "string": {
                const result = parseInt(id.match(/[0-9]+$/)[0], 10);
                if (Number.isNaN(result)) {
                    throw new Error(`Id type unkown ${id}`);
                }
                return result;
            }
            case "number":
                return id;
            default:
                throw new Error(`Id type unkown ${id}`);
        }
    },
};
