import Vector2 from "./mathsTs/Vector2";

export function getPiPositiveAngle(Va: Vector2, Vb: Vector2) {
    let theta = Va.angle(Vb);
    if (theta < 0) theta = Math.PI + theta; // range [0, 2 pi)
    return theta;
}

export function degToRad(angle: number) {
    return (angle * Math.PI) / 180;
}

export function radToDeg(angle: number) {
    return (angle * 180) / Math.PI;
}
