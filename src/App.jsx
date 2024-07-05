import React, { act, useRef, useState } from 'react'

import { TbRectangle } from "react-icons/tb";
import { IoMdDownload } from "react-icons/io";
import { FaLongArrowAltRight } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { GiArrowCursor } from "react-icons/gi";
import { FaRegCircle } from "react-icons/fa6";
import { Arrow, Circle, Layer, Line, Rect, Stage, Transformer } from 'react-konva';
import {ACTIONS} from './constants'
import {v4 as uuidv4} from 'uuid'


const page = () => {

    const stageRef = useRef()
    

    const [action, setAction] = useState(ACTIONS.SELECT)

    const [fillColor, setFillColor] = useState('#ff0000')

    const [rectangle, setRectangle] = useState([])
    const [circles, setCircles] = useState([])
    const [arrows, setArrows] = useState([])
    const [scribbles, setScribbles] = useState([])

    const strokeColor = '#000'

    const isPainting = useRef()
    const currentShapeId = useRef()
    const transformerRef = useRef()


    const isDraggable = action === ACTIONS.SELECT


    const onPointerDown = () => {
        if(action === ACTIONS.SELECT) return
        const stage = stageRef.current
        const {x, y} = stage.getPointerPosition()
        const id = uuidv4()

        currentShapeId.current = id
        isPainting.current = true


        switch(action){
            case ACTIONS.RECTANGLE:
                setRectangle((rectangles) => [...rectangles, {
                    id,
                    x,
                    y,
                    height: 20,
                    width: 20,
                    fillColor,
                }]);
                break

           case ACTIONS.CIRCLE:
                setCircles((circles) => [...circles, {
                    id,
                    x,
                    y,
                    radius: 20,
                    fillColor,
                }]);
                break     

            case ACTIONS.ARROW:
                setArrows((arrows) => [...arrows, {
                    id,
                    points: [x, y, x+20, y+20],
                    fillColor,
                }]);
                break     

            case ACTIONS.SCRIBBLE:
                setScribbles((scribbles) => [...scribbles, {
                    id,
                    points: [x, y],
                    fillColor,
                }]);
                break        
        }

    }

    const onPointerMove = () => {
        if(action === ACTIONS.SELECT || !isPainting.current) return
        const stage = stageRef.current
        const {x, y} = stage.getPointerPosition()

        switch(action){
            case ACTIONS.RECTANGLE:
                setRectangle((rectangles) => rectangles.map((rectangle) => {
                    if(rectangle.id === currentShapeId.current) {
                        return {...rectangle, width: x-rectangle.x, height: y-rectangle.y}
                    }
                    return rectangle
                }))
                break

                case ACTIONS.CIRCLE:
                    setCircles((circles) =>
                      circles.map((circle) => {
                        if (circle.id === currentShapeId.current) {
                          return {
                            ...circle,
                            radius: ((y - circle.y) ** 2 + (x - circle.x) ** 2) ** 0.5,
                          };
                        }
                        return circle;
                      })
                    );
                    break;

                    case ACTIONS.ARROW:
                    setArrows((arrows) =>
                        arrows.map((arrow) => {
                        if (arrow.id === currentShapeId.current) {
                          return {
                            ...arrow,
                            points: [arrow.points[0], arrow.points[1], x, y]
                          };
                        }
                        return arrow;
                      })
                    );
                    break;

                    case ACTIONS.SCRIBBLE:
                    setScribbles((scribbles) =>
                        scribbles.map((scribble) => {
                        if (scribble.id === currentShapeId.current) {
                          return {
                            ...scribble,
                            points: [...scribble.points, x, y]
                          };
                        }
                        return scribble;
                      })
                    );
                    break;
        }
    }

    const onPointerUp = () => {
        isPainting.current = false

    }

    const handleExport = () => {
        let link = document.createElement('a')
        const uri = stageRef.current.toDataURL()
        link.download = 'image.png'
        link.href = uri;
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const onClick = (e) => {
        if(action !== ACTIONS.SELECT) return
        const target = e.currentTarget;
        transformerRef.current.nodes([target])
    }

  return (
    <div className='relative w-full h-screen overflow-hidden'>
        {/* controls */}
        <div className='absolute top-0 z-10  w-full py-2  '>
            <div className='flex bg-[#fff] justify-center items-center gap-4 py-2 px-3 w-fit mx-auto border rounded-lg shadow-2xl'>
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
                <Rect x={0} y={0} height={window.innerHeight} width={window.innerWidth} fill='#ffff' id='bg' onClick={() =>{transformerRef.current.nodes([])}}/>
                {rectangle.map((rectangle, key) => (
                    <Rect
                     key={rectangle.key}
                      x={rectangle.x}
                       y={rectangle.y}
                       stroke={2}
                        strokeColor={strokeColor} 
                         strokeWidth={2}
                          fill={rectangle.fillColor}
                           height={rectangle.height}
                            width={rectangle.width}
                            draggable={isDraggable}
                             onClick={onClick}
                            />
                ))}

                {circles.map((circle) => (
                    <Circle
                        key={circle.id}
                        radius={circle.radius}
                        x={circle.x}
                        y={circle.y}
                        stroke={strokeColor}
                        strokeWidth={2}
                        fill={circle.fillColor}
                        draggable={isDraggable}
                        onClick={onClick}
                    />
                    ))}

                {arrows.map((arrow) => (
                    <Arrow
                        key={arrow.id}                      
                        points={arrow.points}
                        stroke={strokeColor}
                        strokeWidth={2}
                        fill={arrow.fillColor}
                        draggable={isDraggable}
                        onClick={onClick}
                    />
                    ))}

                {scribbles.map((scribble) => (
                    <Line
                        key={scribble.id}  
                        lineCap='round'
                        lineJoin='round'                 
                        points={scribble.points}
                        stroke={strokeColor}
                        strokeWidth={2}
                        fill={scribble.fillColor}
                        draggable={isDraggable}
                        onClick={onClick}
                    />
                    ))}

                    <Transformer ref={transformerRef}/>
            </Layer>
        </Stage>
    </div>
  )
}

export default page