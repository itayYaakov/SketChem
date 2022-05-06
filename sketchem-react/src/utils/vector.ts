import { Vector } from "vector2d";

export function get180angle(Va: Vector, Vb: Vector): number {
    const Vc = Vb.clone().subtract(Va);
    const dy = Vc.y;
    const dx = Vc.x;
    const theta = Math.atan2(dy, dx); // range (-PI, PI]
    return theta;
}

export function get360angle(Va: Vector, Vb: Vector) {
    let theta = get180angle(Va, Vb);
    if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
}

export function degToRad(angle: number) {
    return (angle * Math.PI) / 180;
}

export function radToDeg(angle: number) {
    return (angle * 180) / Math.PI;
}
