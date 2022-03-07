import { useRef } from 'react'
import Raphael from 'raphael'

function useOnDraw() {
    //ref for the canvas dom element
    const divRef = useRef<HTMLDivElement>(null!)
    var isMousePressed = false
    var paper: any = null

    function setdivRef(ref: any) {
        if (!ref) return
        divRef.current = ref
        setMouseDownListener()
        setMouseUpListener()
        setMouseMoveListener()
        paper = Raphael(divRef.current, 1500, 1000)
    }

    function setMouseDownListener() {
        if (!divRef.current) return
        const downListener = (e: MouseEvent) => {
            console.log('mouse down')
            isMousePressed = true
            console.log({ x: e.screenX, y: e.screenY })
        }
        divRef.current.addEventListener('mousedown', downListener)
    }

    function setMouseUpListener() {
        if (!divRef.current) return
        const upListener = (e: MouseEvent) => {
            console.log('mouse up')
            isMousePressed = false
        }
        window.addEventListener('mouseup', upListener)
    }

    function setMouseMoveListener() {
        const MoveListener = (e: MouseEvent) => {
            if (!isMousePressed) return
            console.log({ x: e.screenX, y: e.screenY })
        }

        divRef.current.addEventListener('mousemove', MoveListener)
    }

    return setdivRef
}

export { useOnDraw }
