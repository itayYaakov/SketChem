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
 * `vec3` is a collection of functions to manipulate { Vec3 } 3-element vector objects.
 *
 * The primary use for a { Vec3 } object is in 3D geometry, as homogeneous coordinates in 2D geometry,
 * or to represent e.g. RGB colours.
 *
 * Example usage:
 * ```
 * import * as vec3 from '@utils/mathsTs/vec3';
 * ```
 *
 * @module
 */

import { fpad as pad, lerp as slerp } from "./maths";

interface Point3 {
    /** The first element  */
    x: number;
    /** The second element */
    y: number;
    /** The third element */
    z: number;
}

export default class Vector3 {
    /**
     * Creates a new 3-element vector object initialized with the given values
     *
     * @param x - the first element
     * @param y - the second element
     * @param z - the third element
     * @returns the new 3-element vector object
     */
    static of = (x: number, y: number, z: number): Point3 => ({ x, y, z });

    /**
     * Creates a new copy of the 3-element vector `b`
     *
     * @param b - a 3-element vector object
     * @returns the new 3-element vector object
     */
    static ofV = (b: Point3): Point3 => Vector3.setV({} as Point3, b);

    /**
     * Creates a new 3-element vector object with all elements set to zero
     *
     * @returns the new 3-element vector object
     */
    static zero = (): Point3 => Vector3.setZero({} as Point3);

    /**
     * Creates a new 3-element vector object with all elements set to one
     *
     * @returns the new 3-element vector object
     */
    static one = (): Point3 => Vector3.setOne({} as Point3);

    /**
     * Creates a new 3D unit vector along the x-axis
     *
     * @returns the new 3D unit vector
     */
    static unitX = (): Point3 => Vector3.setUnitX({} as Point3);

    /**
     * Creates a new 3D unit vector along the y-axis
     *
     * @returns the new 3D unit vector
     */
    static unitY = (): Point3 => Vector3.setUnitY({} as Point3);

    /**
     * Creates a new 3D unit vector along the z-axis
     *
     * @returns the new 3D unit vector
     */
    static unitZ = (): Point3 => Vector3.setUnitZ({} as Point3);

    /**
     * Sets all elements of the 3-element vector `a` to zero
     *
     * @param a - a 3-element vector object
     * @returns `a` with all elements set to zero
     */
    static setZero = (a: Point3): Point3 => {
        a.x = 0.0;
        a.y = 0.0;
        a.z = 0.0;
        return a;
    };

    /**
     * Sets all elements of the 3-element vector `a` to one
     *
     * @param a - a 3-element vector object
     * @returns `a` with all elements set to one
     */
    static setOne = (a: Point3): Point3 => {
        a.x = 1.0;
        a.y = 1.0;
        a.z = 1.0;
        return a;
    };

    /**
     * Sets the elements of the 3D vector `a` so it becomes a unit vector along the x-axis
     *
     * @param a - a 3-element vector object
     * @returns `a` set to be a unit vector along the x-axis
     */
    static setUnitX = (a: Point3): Point3 => {
        a.x = 1.0;
        a.y = 0.0;
        a.z = 0.0;
        return a;
    };

    /**
     * Sets the elements of the 3D vector `a` so it becomes a unit vector along the y-axis
     *
     * @param a - a 3-element vector object
     * @returns `a` set to be a unit vector along the y-axis
     */
    static setUnitY = (a: Point3): Point3 => {
        a.x = 0.0;
        a.y = 1.0;
        a.z = 0.0;
        return a;
    };

    /**
     * Sets the elements of the 3D vector `a` so it becomes a unit vector along the z-axis
     *
     * @param a - a 3-element vector object
     * @returns `a` set to be a unit vector along the z-axis
     */
    static setUnitZ = (a: Point3): Point3 => {
        a.x = 0.0;
        a.y = 0.0;
        a.z = 1.0;
        return a;
    };

    /**
     * Copies the 3-element vector `b` into the 3-element vector `a`
     *
     * @param a - a 3-element vector object
     * @param b - a 3-element vector object
     * @returns `a` set to be a copy of `b`
     */
    static setV = (a: Point3, b: Point3): Point3 => {
        a.x = b.x;
        a.y = b.y;
        a.z = b.z;
        return a;
    };

    /**
     * Sets the elements of the 3-element vector `a` to the given values
     *
     * @param a - a 3-element vector object
     * @param x - the first element
     * @param y - the second element
     * @param z - the third element
     * @returns `a` with elements set to the given values
     */
    static set = (a: Point3, x: number, y: number, z: number): Point3 => {
        a.x = x;
        a.y = y;
        a.z = z;
        return a;
    };

    /**
     * `a = a + b`
     *
     * Adds the 3-element vector `b` to the 3-element vector `a` and stores the result in `a`
     *
     * @param a - a 3-element vector object
     * @param b - a 3-element vector object
     * @returns `a` as the result of `a + b`
     */
    static addV = (a: Point3, b: Point3): Point3 => Vector3.addVInto(a, b, a);

    /**
     * `c = a + b`
     *
     * Adds the 3-element vector `b` to the 3-element vector `a` and stores the result in `c`
     *
     * @param a - a 3-element vector object
     * @param b - a 3-element vector object
     * @param c - a 3-element vector in which to store the result
     * @returns `c` as the result of `a + b`
     */
    static addVInto = (a: Point3, b: Point3, c: Point3): Point3 => {
        c.x = a.x + b.x;
        c.y = a.y + b.y;
        c.z = a.z + b.z;
        return c;
    };

    /**
     * `a = a - b`
     *
     * Subtracts the 3-element vector `b` from the 3-element vector `a` and stores the result in `a`
     *
     * @param a - a 3-element vector object
     * @param b - a 3-element vector object
     * @returns `a` as the result of `a - b`
     */
    static subV = (a: Point3, b: Point3): Point3 => Vector3.subVInto(a, b, a);

    /**
     * `c = a - b`
     *
     * Subtracts the 3-element vector `b` from the 3-element vector `a` and stores the result in `c`
     *
     * @param a - a 3-element vector object
     * @param b - a 3-element vector object
     * @param c - a 3-element vector in which to store the result
     * @returns `c` as the result of `a - b`
     */
    static subVInto = (a: Point3, b: Point3, c: Point3): Point3 => {
        c.x = a.x - b.x;
        c.y = a.y - b.y;
        c.z = a.z - b.z;
        return c;
    };

    /**
     * `a = a + b * s`
     *
     * Adds the 3-element vector `b` multiplied by the scalar `s` to the 3-element vector `a` and stores the result in `a`
     *
     * @param a - a 3-element vector object
     * @param b - a 3-element vector object
     * @param s - a scalar value
     * @returns `a` as the result of `a + b * s`
     */
    static addMul = (a: Point3, b: Point3, s: number): Point3 => Vector3.addMulInto(a, b, s, a);

    /**
     * `c = a + b * s`
     *
     * Adds the 3-element vector `b` multiplied by the scalar `s` to the 3-element vector `a` and stores the result in `c`
     *
     * @param a - a 3-element vector object
     * @param b - a 3-element vector object
     * @param s - a scalar value
     * @param c - a 3-element vector in which to store the result
     * @returns `c` as the result of `a + b * s`
     */
    static addMulInto = (a: Point3, b: Point3, s: number, c: Point3): Point3 => {
        c.x = a.x + b.x * s;
        c.y = a.y + b.y * s;
        c.z = a.z + b.z * s;
        return c;
    };

    /**
     * `a = a * b`
     *
     * Element-wise multiplication of the 3-element vector `a` by the 3-element vector `b`, with the result stored in `a`
     *
     * @param a - a 3-element vector object
     * @param b - a 3-element vector object
     * @returns `a` as the result of the multiplication
     */
    static mulV = (a: Point3, b: Point3): Point3 => Vector3.mulVInto(a, b, a);

    /**
     * `c = a * b`
     *
     * Element-wise multiplication of the 3-element vector `a` by the 3-element vector `b`, with the result stored in `c`
     *
     * @param a - a 3-element vector object
     * @param b - a 3-element vector object
     * @param c - a 3-element vector in which to store the result
     * @returns `c` as the result of the multiplication
     */
    static mulVInto = (a: Point3, b: Point3, c: Point3): Point3 => {
        c.x = a.x * b.x;
        c.y = a.y * b.y;
        c.z = a.z * b.z;
        return c;
    };

    /**
     * `a = a * s`
     *
     * Multiplies the 3-element vector `a` by the scalar `s` and stores the result in `a`
     *
     * @param a - a 3-element vector object
     * @param s - a scalar value
     * @returns `a` as the result of `a * s`
     */
    static mul = (a: Point3, s: number): Point3 => Vector3.mulInto(a, s, a);

    /**
     * `b = a * s`
     *
     * Multiplies the 3-element vector `a` by the scalar `s` and stores the result in `b`
     *
     * @param a - a 3-element vector object
     * @param s - a scalar value
     * @param b - a 3-element vector in which to store the result
     * @returns `b` as the result of `a * s`
     */
    static mulInto = (a: Point3, s: number, b: Point3): Point3 => {
        b.x = a.x * s;
        b.y = a.y * s;
        b.z = a.z * s;
        return b;
    };

    /**
     * `a = a ^ s`
     *
     * Raises the 3 elements of vector `a` to the power of `s` and stores the result in `a`
     *
     * @param a - a 3-element vector object
     * @param s - a scalar value
     * @returns `a` as the result of `a ^ s`
     */
    static pow = (a: Point3, s: number): Point3 => Vector3.powInto(a, s, a);

    /**
     * `b = a ^ s`
     *
     * Raises the 3 elements of vector `a` to the power of `s` and stores the result in `b`
     *
     * @param a - a 3-element vector object
     * @param s - a scalar value
     * @param b - a 3-element vector in which to store the result
     * @returns `b` as the result of `a ^ s`
     */
    static powInto = (a: Point3, s: number, b: Point3): Point3 => {
        b.x = a.x ** s;
        b.y = a.y ** s;
        b.z = a.z ** s;
        return b;
    };

    /**
     * `a = -a`
     *
     * Calculates the inverse of the 3-element vector `a` and stores the result in `a`
     *
     * @param a - a 3-element vector object
     * @returns `a` as its inverse
     */
    static inv = (a: Point3): Point3 => Vector3.invInto(a, a);

    /**
     * `b = -a`
     *
     * Calculates the inverse of the 3-element vector `a` and stores the result in `b`
     *
     * @param a - a 3-element vector object
     * @param b - a 3-element vector in which to store the result
     * @returns `b` as the inverse of `a`
     */
    static invInto = (a: Point3, b: Point3): Point3 => {
        b.x = -a.x;
        b.y = -a.y;
        b.z = -a.z;
        return b;
    };

    /**
     * Calculates the square of the magnitude of the 3-element vector `a`
     *
     * (This is cheaper than calculating the actual magnitude and is useful e.g. when comparing two vectors)
     *
     * @param a - a 3-element vector object
     * @returns `|a|²`
     */
    static sqrMag = (a: Point3): number => a.x * a.x + a.y * a.y + a.z * a.z;

    /**
     * Calculates the magnitude of the 3-element vector `a`
     *
     * (See also { sqrMag })
     *
     * @param a - a 3-element vector object
     * @returns `|a|`
     */
    static mag = (a: Point3): number => Math.sqrt(Vector3.sqrMag(a));

    /**
     * `a = â`
     *
     * Normalises the 3-element vector `a` and stores the result in `a`
     *
     * @param a - a 3-element vector object
     * @returns `a` normalised
     */
    static norm = (a: Point3): Point3 => Vector3.normForInto(a, Vector3.mag(a), a);

    /**
     * `b = â`
     *
     * Normalises the 3-element vector `a` and stores the result in `b`
     *
     * @param a - a 3-element vector object
     * @param b - a 3-element vector in which to store the result
     * @returns `b` as `a` normalised
     */
    static normInto = (a: Point3, b: Point3): Point3 => Vector3.normForInto(a, Vector3.mag(a), b);

    /**
     * `a = â`
     *
     * Normalises the 3-element vector `a` based on the given magnitude `mag`, and stores the result in `a`.
     *
     * This variant is useful if you already know the magnitude
     *
     * @param a - a 3-element vector object
     * @param mag - the magnitude
     * @returns `a` normalised (based on `mag`)
     */
    static normFor = (a: Point3, mag: number): Point3 => Vector3.normForInto(a, mag, a);

    /**
     * `b = â`
     *
     * Normalises the 3-element vector `a` based on the given magnitude `mag`, and stores the result in `b`.
     *
     * This variant is useful if you already know the magnitude
     *
     * @param a - a 3-element vector object
     * @param mag - the magnitude
     * @param b - a 3-element vector in which to store the result
     * @returns `b` as `a` normalised (based on `mag`)
     */
    static normForInto = (a: Point3, mag: number, b: Point3): Point3 =>
        mag > 0.0 ? Vector3.mulInto(a, 1.0 / mag, b) : b;

    /**
     * `a · b`
     *
     * Calculates the dot product of the 3-element vectors `a` and `b`
     *
     * @param a - a 3-element vector object
     * @param b - a 3-element vector object
     * @returns the dot product of `a` and `b`
     */
    static dot = (a: Point3, b: Point3): number => a.x * b.x + a.y * b.y + a.z * b.z;

    /**
     * `c = a × b`
     *
     * Calculates the cross product of the 3-element vectors `a` and `b`, and stores the result in the 3-element
     * vector `c`
     *
     * @param a - a 3-element vector object
     * @param b - a 3-element vector object
     * @param c - a 3-element vector in which to store the result
     * @returns `c` as the cross product of `a` and `b`
     */
    static cross = (a: Point3, b: Point3, c: Point3): Point3 => {
        c.x = a.y * b.z - a.z * b.y;
        c.y = a.z * b.x - a.x * b.z;
        c.z = a.x * b.y - a.y * b.x;
        return c;
    };

    /**
     * Element-wise clamping of the values of the 3-element vector `a` so that they are not less than the values of the
     * 3-element vector `min` and not greater than the values of the 3-element vector `max`.
     * The result is stored in `a`
     *
     * @param a - a 3-element vector object
     * @param min - a 3-element vector specifying the minimum values
     * @param max - a 3-element vector specifying the maximum values
     * @returns `a` clamped to `[min, max]`
     */
    static clampV = (a: Point3, min: Point3, max: Point3): Point3 => Vector3.clampVInto(a, min, max, a);

    /**
     * Element-wise clamping of the values of the 3-element vector `a` so that they are not less than the values of the
     * 3-element vector `min` and not greater than the values of the 3-element vector `max`.
     * The result is stored in `b`
     *
     * @param a - a 3-element vector object
     * @param min - a 3-element vector specifying the minimum values
     * @param max - a 3-element vector specifying the maximum values
     * @param b - a 3-element vector in which to store the result
     * @returns `b` as `a` clamped to `[min, max]`
     */
    static clampVInto = (a: Point3, min: Point3, max: Point3, b: Point3): Point3 => {
        b.x = a.x < min.x ? min.x : a.x > max.x ? max.x : a.x;
        b.y = a.y < min.y ? min.y : a.y > max.y ? max.y : a.y;
        b.z = a.z < min.z ? min.z : a.z > max.z ? max.z : a.z;
        return b;
    };

    /**
     * Clamps the values of the 3-element vector `a` so that they are not less than `min` and not greater than `max`,
     * and stores the result in `a`
     *
     * @param a - a 3-element vector object
     * @param min - the minimum value allowed
     * @param max - the maximum value allowed
     * @returns `a` clamped to `[min, max]`
     */
    static clamp = (a: Point3, min: number, max: number): Point3 => Vector3.clampInto(a, min, max, a);

    /**
     * Clamps the values of the 3-element vector `a` so that they are not less than `min` and not greater than `max`,
     * and stores the result in `b`
     *
     * @param a - a 3-element vector object
     * @param min - the minimum value allowed
     * @param max - the maximum value allowed
     * @param b - a 3-element vector in which to store the result
     * @returns `b` as `a` clamped to `[min, max]`
     */
    static clampInto = (a: Point3, min: number, max: number, b: Point3): Point3 => {
        b.x = a.x < min ? min : a.x > max ? max : a.x;
        b.y = a.y < min ? min : a.y > max ? max : a.y;
        b.z = a.z < min ? min : a.z > max ? max : a.z;
        return b;
    };

    /**
     * Clamps the values of the 3-element vector `a` so that they are not less than `0.0` and not greater than `1.0`,
     * and stores the result in `a`
     *
     * @param a - a 3-element vector object
     * @returns `a` clamped to `[0.0, 1.0]`
     */
    static clamp01 = (a: Point3): Point3 => Vector3.clampInto(a, 0.0, 1.0, a);

    /**
     * Clamps the values of the 3-element vector `a` so that they are not less than `0.0` and not greater than `1.0`,
     * and stores the result in `b`
     *
     * @param a - a 3-element vector object
     * @param b - a 3-element vector in which to store the result
     * @returns `b` as `a` clamped to `[0.0, 1.0]`
     */
    static clamp01Into = (a: Point3, b: Point3): Point3 => Vector3.clampInto(a, 0.0, 1.0, b);

    /**
     * Linear interpolation between `a` and `b` based on `t`, where `t` is a number between `0.0` and `1.0`.
     * The result is stored in `c`.
     *
     * The result will be equal to `a` when `t` is `0.0`,
     * equal to `b` when `t` is `1.0`,
     * and halfway between `a` and `b` when `t` is `0.5`
     *
     * @param a - the start value - a 3-element vector object
     * @param b - the end value - a 3-element vector object
     * @param t - a floating point number in the interval `[0.0, 1.0]`
     * @param c - a 3-element vector in which to store the result
     * @returns `c` - the interpolation result
     */
    static lerp = (a: Point3, b: Point3, t: number, c: Point3): Point3 =>
        Vector3.addMul(Vector3.mulInto(a, 1 - t, c), b, t);

    /**
     * Element-wise linear interpolation between `a` and `b` based on `tx`, `ty` and `tz`, where `tx`, `ty` and `tz` are
     * numbers between `0.0` and `1.0`.
     * The result is stored in `c`.
     *
     * The calculation is as follows: `a.x` and `b.x` are interpolated based on `tx` to give `c.x`,
     * `a.y` and `b.y` are interpolated based on `ty` to give `c.y`,
     * `a.z` and `b.z` are interpolated based on `tz` to give `c.z`.
     *
     * The result will be equal to `a` when `tx`, `ty` and `tz` are all `0.0`,
     * equal to `b` when `tx`, `ty` and `tz` are all `1.0`,
     * and halfway between `a` and `b` when `tx`, `ty` and `tz` are all `0.5`
     *
     * @param a - the start x, y and z values - a 3-element vector object
     * @param b - the end x, y and z values - a 3-element vector object
     * @param tx - a floating point number in the interval `[0.0, 1.0]`
     * @param ty - a floating point number in the interval `[0.0, 1.0]`
     * @param tz - a floating point number in the interval `[0.0, 1.0]`
     * @param c - a 3-element vector in which to store the result
     * @returns `c` - the interpolation result
     */
    static lerpE = (a: Point3, b: Point3, tx: number, ty: number, tz: number, c: Point3): Point3 =>
        Vector3.set(c, slerp(a.x, b.x, tx), slerp(a.y, b.y, ty), slerp(a.z, b.z, tz));

    /**
     * Bilinear interpolation between `a1`, `b1`, `a2` and `b2` based on `s` and `t`, where `s` and `t` are numbers
     * between `0.0` and `1.0`.
     * The result is stored in `c`.
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
     * @param a1 - the first start value - a 3-element vector object
     * @param b1 - the first end value - a 3-element vector object
     * @param a2 - the second start value - a 3-element vector object
     * @param b2 - the second end value - a 3-element vector object
     * @param s - a floating point number in the interval `[0.0, 1.0]`
     * @param t - a floating point number in the interval `[0.0, 1.0]`
     * @param c - a 3-element vector in which to store the result
     * @param tmp - an optional 3-element vector for temporary storage.
     *              If not provided, one will be created (and then discarded) internally
     * @returns `c` - the interpolation result
     */
    static lerp2 = (
        a1: Point3,
        b1: Point3,
        a2: Point3,
        b2: Point3,
        s: number,
        t: number,
        c: Point3,
        tmp?: Point3
    ): Point3 => Vector3.lerp(Vector3.lerp(a1, b1, s, c), Vector3.lerp(a2, b2, s, tmp ?? Vector3.zero()), t, c);

    /**
     * Checks if the vectors `a` and `b` are equal
     *
     * @param a - a 3-element vector object
     * @param b - a 3-element vector object
     * @returns `true` if `a` and `b` are equal, `false` otherwise
     */
    static equals = (a: Point3, b: Point3): boolean => a.x === b.x && a.y === b.y && a.z === b.z;

    /**
     * Generates a (single-line) string representation of the 3-element vector `a`
     *
     * @param a - a 3-element vector object
     * @returns a string representation of `a`
     */
    static toString = (a: Point3): string => `[ ${pad(a.x)} ${pad(a.y)} ${pad(a.z)} ]`;
}
