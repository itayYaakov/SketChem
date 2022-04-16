import React from 'react'
import { useOnDraw } from '../Hooks/useOnDraw'

interface Props {
    width: number
    height: number
}

const SketchPad = (props: Props) => {
    const setRef = useOnDraw()

    return (
        <div
            style={{
                height: 1000,
                width: 1500,
                border: '5px solid red',
            }}
            id="Can"
            ref={setRef}
        ></div>
    )
}

SketchPad.defaultProps = {
    width: 1000,
    height: 1500,
}

export default SketchPad
