/* eslint-disable @typescript-eslint/no-dupe-class-members */
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

/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */

/**
 * `vec2` is a collection of functions to manipulate { Vec2 } two-element vector objects.
 *
 * The primary use for a { Vec2 } object is in 2D geometry.
 *
 * Example usage:
 * ```
 * import Vector2 from '@utils/mathsTs/vec2';
 * ```
 *
 * @module
 */

import { fpad as pad } from "./maths";

export default class Vector2 {
    x: number;

    y: number;

    /**
     * Creates a new 2-element vector object with all elements set to zero
     *
     * @returns the new 2-element vector object
     */
    static zero = (): Vector2 => new Vector2(0, 0);

    /**
     * Creates a new 2-element vector object with all elements set to one
     *
     * @returns the new 2-element vector object
     */
    static one = (): Vector2 => new Vector2(1, 1);

    constructor(x?: number, y?: number) {
        this.x = x ?? 0;
        this.y = y ?? 0;
    }

    get = () => ({ x: this.x, y: this.y });

    distance = (b: Vector2): number => this.subNew(b).mag();

    subNew = (a: Vector2): Vector2 => new Vector2(this.x - a.x, this.y - a.y);

    subValues = (x: number, y: number): Vector2 => new Vector2(this.x - x, this.y - y);

    subSelf = (a: Vector2) => {
        this.x -= a.x;
        this.y -= a.y;
        return this;
    };

    addNew = (a: Vector2): Vector2 => new Vector2(this.x + a.x, this.y + a.y);

    addValues = (x: number, y: number): Vector2 => new Vector2(this.x + x, this.y + y);

    addValuesSelf = (x: number, y: number): Vector2 => {
        this.x += x;
        this.y += y;
        return this;
    };

    addSelf = (a: Vector2) => {
        this.x += a.x;
        this.y += a.y;
        return this;
    };

    static min = (a: Vector2, b: Vector2) => {
        let minX = a.x;
        let minY = a.y;
        if (b.x < minX) minX = b.x;
        if (b.y < minY) minY = b.y;
        return new Vector2(minX, minY);
    };

    static max = (a: Vector2, b: Vector2) => {
        let maxX = a.x;
        let maxY = a.y;
        if (b.x > maxX) maxX = b.x;
        if (b.y > maxY) maxY = b.y;
        return new Vector2(maxX, maxY);
    };

    minSelf = (b: Vector2) => {
        if (b.x < this.x) this.x = b.x;
        if (b.y < this.y) this.y = b.y;
        return this;
    };

    maxSelf = (b: Vector2) => {
        if (b.x > this.x) this.x = b.x;
        if (b.y > this.y) this.y = b.y;
        return this;
    };

    scaleNew = (f: number) => new Vector2(this.x * f, this.y * f);

    scaleSelf = (f: number) => {
        this.x *= f;
        this.y *= f;
        return this;
    };

    clone = () => new Vector2(this.x, this.y);

    normalize = () => this.scaleNew(1.0 / this.mag());

    // normalize = () => this.scaleNew(1.0 / this.mag());

    rotate(angle: number): Vector2 {
        if (angle === 0) return this.clone();
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const newX = this.x * cos - this.y * sin;
        const newY = this.x * sin + this.y * cos;

        return new Vector2(newX, newY);
    }

    rotateDegSelf(angle: number) {
        if (angle === 0) return this;

        const cos = Math.cos((angle / 180) * Math.PI);
        const sin = Math.sin((angle / 180) * Math.PI);

        const newX = this.x * cos - this.y * sin;
        const newY = this.x * sin + this.y * cos;
        this.x = newX;
        this.y = newY;
        return this;
    }

    rotateRadSelf(angle: number) {
        if (angle === 0) return this;

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const newX = this.x * cos - this.y * sin;
        const newY = this.x * sin + this.y * cos;
        this.x = newX;
        this.y = newY;
        return this;
    }

    equals = (b: Vector2): boolean => this.x === b.x && this.y === b.y;

    /**
     * Calculates the angle product of the two-element vectors `this` and `b`
     *
     * @param b - a 2-element vector object
     * @returns the angle between `a` and `b`
     */
    angle = (b: Vector2): number => {
        const diff = this.subNew(b);
        return Math.atan2(diff.y, diff.x);
    };

    /**
     * `c = a * b`
     *
     * Element-wise multiplication of the 2-element vector `a` by the 2-element vector `b`, with the result stored in `c`
     *
     * @param a - a 2-element vector object
     * @param b - a 2-element vector object
     * @param c - a 2-element vector in which to store the result
     * @returns `c` as the result of the multiplication
     */
    static mulVInto = (a: Vector2, b: Vector2, c: Vector2): Vector2 => {
        c.x = a.x * b.x;
        c.y = a.y * b.y;
        return c;
    };

    /**
     * `a = a * s`
     *
     * Multiplies the two-element vector `a` by the scalar `s` and stores the result in `a`
     *
     * @param a - a 2-element vector object
     * @param s - a scalar value
     * @returns `a` as the result of `a * s`
     */
    static mul = (a: Vector2, s: number): Vector2 => Vector2.mulInto(a, s, a);

    /**
     * `b = a * s`
     *
     * Multiplies the two-element vector `a` by the scalar `s` and stores the result in `b`
     *
     * @param a - a 2-element vector object
     * @param s - a scalar value
     * @param b - a 2-element vector in which to store the result
     * @returns `b` as the result of `a * s`
     */
    static mulInto = (a: Vector2, s: number, b: Vector2): Vector2 => {
        b.x = a.x * s;
        b.y = a.y * s;
        return b;
    };

    /**
     * `a = a / b`
     *
     * Element-wise division of the 2-element vector `a` by the 2-element vector `b`, with the result stored in `a`
     *
     * @param a - a 2-element vector object
     * @param b - a 2-element vector object
     * @returns `a` as the result of the division
     */
    static divV = (a: Vector2, b: Vector2): Vector2 => Vector2.divVInto(a, b, a);

    /**
     * `c = a / b`
     *
     * Element-wise division of the 2-element vector `a` by the 2-element vector `b`, with the result stored in `c`
     *
     * @param a - a 2-element vector object
     * @param b - a 2-element vector object
     * @param c - a 2-element vector in which to store the result
     * @returns `c` as the result of the division
     */
    static divVInto = (a: Vector2, b: Vector2, c: Vector2): Vector2 => {
        c.x = a.x / b.x;
        c.y = a.y / b.y;
        return c;
    };

    /**
     * `a = a / s`
     *
     * Divides the two-element vector `a` by the scalar `s` and stores the result in `a`
     *
     * @param a - a 2-element vector object
     * @param s - a scalar value
     * @returns `a` as the result of `a / s`
     */
    static div = (a: Vector2, s: number): Vector2 => Vector2.divInto(a, s, a);

    /**
     * `b = a / s`
     *
     * Divides the two-element vector `a` by the scalar `s` and stores the result in `b`
     *
     * @param a - a 2-element vector object
     * @param s - a scalar value
     * @param b - a 2-element vector in which to store the result
     * @returns `b` as the result of `a / s`
     */
    static divInto = (a: Vector2, s: number, b: Vector2): Vector2 => {
        b.x = a.x / s;
        b.y = a.y / s;
        return b;
    };

    /**
     * `a = -a`
     *
     * Calculates the inverse of the two-element vector `a` and stores the result in `a`
     *
     * @param a - a 2-element vector object
     * @returns `a` as its inverse
     */
    static inv = (a: Vector2): Vector2 => Vector2.invInto(a, a);

    /**
     * `b = -a`
     *
     * Calculates the inverse of the two-element vector `a` and stores the result in `b`
     *
     * @param a - a 2-element vector object
     * @param b - a 2-element vector in which to store the result
     * @returns `b` as the inverse of `a`
     */
    static invInto = (a: Vector2, b: Vector2): Vector2 => {
        b.x = -a.x;
        b.y = -a.y;
        return b;
    };

    /**
     * Calculates the square of the magnitude
     *
     * (This is cheaper than calculating the actual magnitude and is useful e.g. when comparing two vectors)
     *
     * @returns `|a|²`
     */
    sqrMag = (): number => this.x * this.x + this.y * this.y;

    /**
     * Calculates the magnitude
     *
     * @returns `|a|`
     */
    mag = (): number => Math.sqrt(this.sqrMag());

    /**
     * `a · b`
     *
     * Calculates the dot product of the two-element vectors `this` and `b`
     *
     * @param b - a 2-element vector object
     * @returns the dot product of `a` and `b`
     */
    dot = (b: Vector2): number => this.x * b.x + this.y * b.y;

    /**
     * `a x b`
     *
     * Calculates the cross product of the two-element vectors `this` and `b`
     *
     * @param b - a 2-element vector object
     * @returns the cross product of `a` and `b`
     */
    cross = (b: Vector2): number => this.x * b.y - this.y * b.x;

    /**
     * Sets the elements of the 2D vector `b` so it becomes perpendicular to the 2D vector `a`.
     *
     * The direction of `b` with respect to `a` will be "to the right", i.e. rotated 90 degrees clockwise
     *
     * @param a - a 2-element vector object
     * @param b - a 2-element vector in which to store the result
     * @returns `b` as a vector perpendicular to `a`
     */
    static perpInto = (a: Vector2, b: Vector2): Vector2 => {
        b.x = a.y;
        b.y = -a.x;
        return b;
    };

    /**
     * Element-wise clamping of the values of the two-element vector `a` so that they are not less than the values of the
     * two-element vector `min` and not greater than the values of the two-element vector `max`.
     * The result is stored in `a`
     *
     * @param a - a 2-element vector object
     * @param min - a 2-element vector specifying the minimum values
     * @param max - a 2-element vector specifying the maximum values
     * @returns `a` clamped to `[min, max]`
     */
    static clampV = (a: Vector2, min: Vector2, max: Vector2): Vector2 => Vector2.clampVInto(a, min, max, a);

    /**
     * Element-wise clamping of the values of the two-element vector `a` so that they are not less than the values of the
     * two-element vector `min` and not greater than the values of the two-element vector `max`.
     * The result is stored in `b`
     *
     * @param a - a 2-element vector object
     * @param min - a 2-element vector specifying the minimum values
     * @param max - a 2-element vector specifying the maximum values
     * @param b - a 2-element vector in which to store the result
     * @returns `b` as `a` clamped to `[min, max]`
     */
    static clampVInto = (a: Vector2, min: Vector2, max: Vector2, b: Vector2): Vector2 => {
        b.x = a.x < min.x ? min.x : a.x > max.x ? max.x : a.x;
        b.y = a.y < min.y ? min.y : a.y > max.y ? max.y : a.y;
        return b;
    };

    /**
     * Clamps the values of the two-element vector `a` so that they are not less than `min` and not greater than `max`,
     * and stores the result in `a`
     *
     * @param a - a 2-element vector object
     * @param min - the minimum value allowed
     * @param max - the maximum value allowed
     * @returns `a` clamped to `[min, max]`
     */
    static clamp = (a: Vector2, min: number, max: number): Vector2 => Vector2.clampInto(a, min, max, a);

    /**
     * Clamps the values of the two-element vector `a` so that they are not less than `min` and not greater than `max`,
     * and stores the result in `b`
     *
     * @param a - a 2-element vector object
     * @param min - the minimum value allowed
     * @param max - the maximum value allowed
     * @param b - a 2-element vector in which to store the result
     * @returns `b` as `a` clamped to `[min, max]`
     */
    static clampInto = (a: Vector2, min: number, max: number, b: Vector2): Vector2 => {
        b.x = a.x < min ? min : a.x > max ? max : a.x;
        b.y = a.y < min ? min : a.y > max ? max : a.y;
        return b;
    };

    /**
     * Clamps the values of the two-element vector `a` so that they are not less than `0.0` and not greater than `1.0`,
     * and stores the result in `a`
     *
     * @param a - a 2-element vector object
     * @returns `a` clamped to `[0.0, 1.0]`
     */
    static clamp01 = (a: Vector2): Vector2 => Vector2.clampInto(a, 0.0, 1.0, a);

    /**
     * Clamps the values of the two-element vector `a` so that they are not less than `0.0` and not greater than `1.0`,
     * and stores the result in `b`
     *
     * @param a - a 2-element vector object
     * @param b - a 2-element vector in which to store the result
     * @returns `b` as `a` clamped to `[0.0, 1.0]`
     */
    static clamp01Into = (a: Vector2, b: Vector2): Vector2 => Vector2.clampInto(a, 0.0, 1.0, b);

    /**
     * Checks if the vectors `a` and `b` are equal
     *
     * @param a - a 2-element vector object
     * @param b - a 2-element vector object
     * @returns `true` if `a` and `b` are equal, `false` otherwise
     */
    static equals = (a: Vector2, b: Vector2): boolean => a.x === b.x && a.y === b.y;

    static midpoint = (a: Vector2, b: Vector2, percent: number): Vector2 =>
        new Vector2(a.x + (b.x - a.x) * percent, a.y + (b.y - a.y) * percent);

    /**
     * Generates a (single-line) string representation of the 2-element vector `a`
     *
     * @param a - a 2-element vector object
     * @returns a string representation of `a`
     */
    static toString = (a: Vector2): string => `[ ${pad(a.x)} ${pad(a.y)} ]`;
}
