import { Context, useRef } from 'react'
import Raphael from 'raphael'

function useOnDraw() {
    //ref for the canvas dom element
    const divRef = useRef<HTMLDivElement>(null!)
    var isMousePressedRef = false
    var paper: any = null
    var shape: any = null

    function setdivRef(ref: any) {
        if (!ref) return
        divRef.current = ref

        paper = Raphael(divRef.current, 1500, 1000)
    }

    return setdivRef
}

export { useOnDraw }
