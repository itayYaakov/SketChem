import Vector2 from "./mathsTs/Vector2";

export const AngleUtils = {
    getPiPositiveAngle: (Va: Vector2, Vb: Vector2) => {
        let theta = Va.angle(Vb);
        if (theta < 0) theta = Math.PI + theta; // range [0, 2 pi)
        return theta;
    },

    limitInSteps(angle: number, stepSize: number): number {
        return Math.round(angle / stepSize) * stepSize;
    },

    degToRad: (angle: number) => (angle * Math.PI) / 180,

    clampPosAngleRad: (angle: number) => ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI),

    radToDeg: (angle: number) => (angle * 180) / Math.PI,
};
