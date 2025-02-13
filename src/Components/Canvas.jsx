import React, { useRef , useEffect} from 'react'

const Canvas = props => {
  
  const canvasRef = useRef(null)
  useEffect(() => {
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d");
    var points=props.p;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    
    points.forEach((point, idx) => {
      if (idx === 0) {
        ctx.moveTo(point[0], point[1]-185);
      } else {
        ctx.lineTo(point[0], point[1]-185);
      }
    });
    ctx.stroke();
    }, [props.p]);
    
    //Our first draw
    // context.fillStyle = '#000000'
    // context.fillRect(0, 0, context.canvas.width, context.canvas.height)
 
  return <canvas ref={canvasRef} {...props}/>
}

export default Canvas