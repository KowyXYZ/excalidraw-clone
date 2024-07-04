import React, { useRef, useState } from 'react'

import { TbRectangle } from "react-icons/tb";
import { IoMdDownload } from "react-icons/io";
import { FaLongArrowAltRight } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { GiArrowCursor } from "react-icons/gi";
import { FaRegCircle } from "react-icons/fa6";
import { Layer, Rect, Stage } from 'react-konva';
import {ACTIONS} from './constants'


const page = () => {

    const stageRef = useRef()
    const uri = stageRef.current.toDataURL()

    const [action, setAction] = useState(ACTIONS.SELECT)

    const [fillColor, setFillColor] = useState('#ff0000')

    const strokeColor = '#000'

    const onPointerDown = () => {

    }

    const onPointerMove = () => {
        
    }

    const onPointerUp = () => {
        
    }

    const handleExport = () => {
        let link = document.createElement('a')
        link.download = 'image.png'
        link.href = uri;
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

  return (
    <div className='relative w-full h-screen overflow-hidden'>
        {/* controls */}
        <div className='absolute top-0 z-10  w-full py-2  '>
            <div className='flex justify-center items-center gap-4 py-2 px-3 w-fit mx-auto border rounded-lg shadow-2xl'>
                <button className={action === ACTIONS.SELECT ? 'bg-violet-300 p-1 rounded' : ' p-1 hover:bg-violet-100 rounded'} onClick={() => setAction(ACTIONS.SELECT)}>
                    <GiArrowCursor size={'25px'}/>
                </button>

                <button className={action === ACTIONS.RECTANGLE ? 'bg-violet-300 p-1 rounded' : ' p-1 hover:bg-violet-100 rounded'} onClick={() => setAction(ACTIONS.RECTANGLE)}>
                    <TbRectangle size={'25px'}/>
                </button>

                <button className={action === ACTIONS.CIRCLE ? 'bg-violet-300 p-1 rounded' : ' p-1 hover:bg-violet-100 rounded'} onClick={() => setAction(ACTIONS.CIRCLE)}>
                    <FaRegCircle size={'25px'}/>
                </button>

                <button className={action === ACTIONS.ARROW ? 'bg-violet-300 p-1 rounded' : ' p-1 hover:bg-violet-100 rounded'} onClick={() => setAction(ACTIONS.ARROW)}>
                    <FaLongArrowAltRight size={'25px'}/>
                </button>

                <button className={action === ACTIONS.SCRIBBLE ? 'bg-violet-300 p-1 rounded' : ' p-1 hover:bg-violet-100 rounded'} onClick={() => setAction(ACTIONS.SCRIBBLE)}>
                    <LuPencil size={'25px'}/>
                </button>

                <button>
                    <input type="color" className='w-6 h-6 cursor-pointer' value={fillColor} onChange={(e) => setFillColor(e.target.value)}/>
                </button>

                <button className={'p-1 hover:bg-violet-100 rounded'} onClick={handleExport}>
                    <IoMdDownload size={'25px'}/>
                </button>
            </div>
        </div>

        {/* canvas */}
        <Stage ref={stageRef} width={window.innerWidth}  height={window.innerHeight} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
            <Layer>
                <Rect x={0} y={0} height={window.innerHeight} width={window.innerWidth} fill='#ffff' id='bg'/>
            </Layer>
        </Stage>
    </div>
  )
}

export default page