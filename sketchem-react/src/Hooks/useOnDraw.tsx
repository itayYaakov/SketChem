import { useRef } from 'react'
import Raphael from 'raphael'

interface Point {
    x: number
    y: number
}

function useOnDraw() {
    //ref for the canvas dom element
    const divRef = useRef<HTMLDivElement>(null!)

    var isMousePressedRef = false
    var paper: any = null
    var shape: any = null
    function calculateLocation(event: MouseEvent): Point {
        const rect = divRef.current.getBoundingClientRect()
        return {
            x: event.clientX - rect.x,
            y: event.clientY - rect.y,
        }
    }

    function setdivRef(ref: any) {
        if (!ref) return
        divRef.current = ref
        // Setting mouse listeners
        setMouseDownListener()
        setMouseUpListener()
        setMouseMoveListener()
        console.log(divRef.current)
        // Initialize rapahel paper
        paper = Raphael(divRef.current, 1500, 1000)
    }

    // creating and drawing a line using rapahel's svg path
    function drawLine(startPoint: Point, endPoint: Point) {
        var start = startPoint
        var end = endPoint
        var getPath = function () {
            return ['M', start.x, start.y, 'L', end.x, end.y]
        }

        var path = paper.path(getPath())
        var redraw = function () {
            path.attr('path', getPath())
        }
        return {
            updateStart: function (point: Point) {
                start = point
                redraw()
                return this
            },
            updateEnd: function (point: Point) {
                end = point
                redraw()
                return this
            },
        }
    }

    // creating and drawing a circle using rapahel's svg path
    function drawCircle(start: Point, end: Point) {
        function calculateCenter(p1: Point, p2: Point) {
            return {
                x: (p1.x + p2.x) / 2,
                y: (p1.y + p2.y) / 2,
            }
        }
        function calculateRadius(p1: Point, p2: Point) {
            return {
                h: Math.sqrt((p2.y - p1.y) * (p2.y - p1.y)) / 2,
                w: Math.sqrt((p2.x - p1.x) * (p2.x - p1.x)) / 2,
            }
        }
        var params = {
            center: calculateCenter(start, end),
            radius: calculateRadius(start, end),
        }

        var getPath = function () {
            console.log(params)
            return [
                ['M', params.center.x, params.center.y],
                ['m', 0, -params.radius.h],
                [
                    'a',
                    params.radius.w,
                    params.radius.h,
                    0,
                    1,
                    1,
                    0,
                    2 * params.radius.h,
                ],
                [
                    'a',
                    params.radius.w,
                    params.radius.h,
                    0,
                    1,
                    1,
                    0,
                    -2 * params.radius.h,
                ],
                ['z'],
            ]
        }
        console.log(getPath())
        var redraw = function () {
            node.attr('path', getPath())

            node.attr({ stroke: 'red' })
        }
        var node = paper.path(getPath())
        console.log(node)

        return {
            updateStart: function (newStart: Point) {
                params.center = calculateCenter(newStart, end)
                params.radius = calculateRadius(newStart, end)
                console.log(node)
                redraw()

                return this
            },
            updateEnd: function (newEnd: Point) {
                console.log(start)
                console.log(newEnd)
                params.center = calculateCenter(start, newEnd)
                params.radius = calculateRadius(start, newEnd)
                redraw()
                console.log(node)

                return this
            },
        }
    }

    function onDraw(point: Point) {
        // update the end location of the shape we curretly draw
        shape.updateEnd(point)
    }

    function setMouseDownListener() {
        if (!divRef.current) return
        const downListener = (e: MouseEvent) => {
            console.log('mouse down')
            isMousePressedRef = true
            var loc = calculateLocation(e)
            shape = drawCircle(loc, loc)

            console.log(shape)
        }
        divRef.current.addEventListener('mousedown', downListener)
    }

    function setMouseUpListener() {
        if (!divRef.current) return
        const upListener = (e: MouseEvent) => {
            console.log('mouse up')
            isMousePressedRef = false
            const mouseClickUpPoint = calculateLocation(e)
        }
        window.addEventListener('mouseup', upListener)
    }

    function setMouseMoveListener() {
        const MoveListener = (e: MouseEvent) => {
            console.log('mouse move')
            if (!isMousePressedRef) return
            // call draw function - only when mouse is down.
            console.log({ x: e.screenX, y: e.screenY })
            onDraw(calculateLocation(e))
        }

        divRef.current.addEventListener('mousemove', MoveListener)
    }

    return setdivRef
}

export { useOnDraw }
