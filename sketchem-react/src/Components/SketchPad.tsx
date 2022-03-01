import React from 'react'

interface Props {
    width: number
    height: number
}

const SketchPad = ({ width, height }: Props) => {
    return <canvas width={width} height={height} />
}

SketchPad.defaultProps = {
    width: window.innerWidth,
    height: window.innerHeight,
}

export default SketchPad
