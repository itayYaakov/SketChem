/** **************************************************************************
MIT License

Copyright (c) 2012-2019 Simen Storsveen <code@simenstorsveen.no>

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
************************************************************************** */

/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */

/**
 * `Maths` is a collection of functions and constants generally relevant to 2D/3D geometry and graphics
 *
 * Example usage:
 * ```
 * import * as Maths from '@utils/mathsTs/maths';
 * ```
 *
 * @module
 */

/**
 * `2π` as a constant
 */
export const TWO_PI = Math.PI * 2.0;

/**
 * `π/2` as a constant
 */
export const PI_BY_2 = Math.PI / 2.0;

/**
 * `π/180` as a constant
 */
export const PI_BY_180 = Math.PI / 180.0;

/**
 * `√̅2̅π` as a constant
 */
export const TWO_PI_ROOT = Math.sqrt(TWO_PI);

/**
 * An array of floating point numbers
 */
export type FloatArray = number[] | Float32Array | Float64Array;

/**
 * Calculates the cotangent of the given angle
 *
 * @param angle - an angle in radians
 * @returns the cotangent of `angle`
 */
export const cotan = (angle: number): number => 1.0 / Math.tan(angle);

/**
 * Converts an angle in degrees to an angle in radians
 *
 * @param degrees - an angle
 * @returns `degrees` converted to radians
 */
export const deg2rad = (degrees: number): number => degrees * PI_BY_180;

/**
 * Clamps the value `x` so that it is not less than `min` and not greater than `max`
 *
 * @param x - the value to clamp
 * @param min - the minimum value allowed
 * @param max - the maximum value allowed
 * @returns `x` clamped to `[min, max]`
 */
export const clamp = (x: number, min: number, max: number): number => (x < min ? min : x > max ? max : x);

/**
 * Clamps the value `x` so that it is not less than `0.0` and not greater than `1.0`
 *
 * @param x - the value to clamp
 * @returns `x` clamped to `[0.0, 1.0]`
 */
export const clamp01 = (x: number): number => clamp(x, 0.0, 1.0);

/**
 * Formats the floating point number `n` as a string.
 *
 * The result has 4 digits after the decimal point and is left-padded with spaces to a width of 10.
 *
 * This function is primarily intended for debugging and logging, and is used by the `toString()` functions in this
 * library
 *
 * @param n - the number to format
 * @returns `n` formatted as a string
 */
export const fpad = (n: number): string => {
    const d = 4;
    const c = " ";
    const w = 10;
    let s = n.toFixed(d);
    while (s.length < w) s = c + s;
    return s;
};

/**
 * Linear interpolation between `a` and `b` based on `t`, where `t` is a number between `0.0` and `1.0`.
 *
 * The result will be equal to `a` when `t` is `0.0`,
 * equal to `b` when `t` is `1.0`,
 * and halfway between `a` and `b` when `t` is `0.5`
 *
 * @param a - the start value - a floating point number
 * @param b - the end value - a floating point number
 * @param t - a floating point number in the interval `[0.0, 1.0]`
 * @returns a value between `a` and `b`
 */
export const lerp = (a: number, b: number, t: number): number => (1 - t) * a + t * b;

/**
 * Bilinear interpolation between `a1`, `b1`, `a2` and `b2` based on `s` and `t`, where `s` and `t` are numbers
 * between `0.0` and `1.0`.
 *
 * The calculation is as follows: `a1` and `b1` are interpolated based on `s` to give `p`,
 * `a2` and `b2` are interpolated based on `s` to give `q`,
 * and then the final result is obtained by interpolating `p` and `q` based on `t`.
 *
 * The result will be equal to `a1` when both `s` and `t` is `0.0`,
 * equal to `a2` when `s` is `0.0` and `t` is `1.0`,
 * equal to `b1` when `s` is `1.0` and `t` is `0.0`,
 * and equal to `b2` when both `s` and `t` is `1.0`
 *
 * @param a1 - the first start value - a floating point number
 * @param b1 - the first end value - a floating point number
 * @param a2 - the second start value - a floating point number
 * @param b2 - the second end value - a floating point number
 * @param s - a floating point number in the interval `[0.0, 1.0]`
 * @param t - a floating point number in the interval `[0.0, 1.0]`
 * @returns a value between `a1`, `b1`, `a2` and `b2`
 */
export const lerp2 = (a1: number, b1: number, a2: number, b2: number, s: number, t: number): number =>
    lerp(lerp(a1, b1, s), lerp(a2, b2, s), t);
