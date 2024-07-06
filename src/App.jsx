import React, { useEffect, useState } from 'react';
import Canvas from './Components/Canvas';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [iframeSrc, setIframeSrc] = useState('');
  const [content, setContent] = useState('');
  const [width, setWidth] = useState(0);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [zoom, setZoom] = useState(0);
  const [drawing, setDrawing] = useState(0);
  const [points, setPoints] = useState([]);
  const [areaorlength, setAreaorlength] = useState(0);
  const [area, setArea] = useState(0);
  const [length, setLength] = useState(0);

  function handleCalculate() {
      console.log('clicked')
      if (points.length < 3) {
        setArea(0); 
        
      }
      else{

        var temparea = 0;
        for (let i = 0; i < points.length; i++) {
          const [x1, y1] = points[i];
          const [x2, y2] = points[(i + 1) % points.length]; 
          temparea += x1 * y2 - y1 * x2;
        }
        temparea = Math.abs(temparea) / 2;
    
  
        const scale = content / width; 
        const realArea = temparea * scale * scale; 
    
        setArea(realArea);
      }
   

      if (points.length < 2) {
        setLength(0);
        
      }
  
      let totalDistance = 0;
  
      for (let i = 0; i < points.length - 1; i++) {
        const [x1, y1] = points[i];
        const [x2, y2] = points[i + 1];
  
        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        totalDistance += distance;
      }
      setLength(totalDistance * content / width);
    
      console.log(area);
      console.log(length);
    }
  
    useEffect(() => {}, [lat, long, zoom, points,area,length]);
    

  function handleCoord() {
    var PREFIX = "https://www.google.com/maps/@";
    if (url.startsWith(PREFIX)) {
      var tempurl = url.slice(PREFIX.length);
      tempurl = tempurl.substring(0, tempurl.length - 11);

      var currlat = "";
      var currlong = "";
      var currzoom = "";
      var flag1 = 0;
      var flag2 = 0;

      console.log(tempurl);

      for (let i = 0; i < tempurl.length; i++) {
        if (tempurl[i] === "," && flag1 === 0) flag1 = 1;
        else if (tempurl[i] === "," && flag1) flag2 = 1;
        else if (tempurl[i] !== "," && !flag1) currlat += tempurl[i];
        else if (tempurl[i] !== "," && !flag2) currlong += tempurl[i];
        else currzoom += tempurl[i];
      }

      setLat(currlat);
      setLong(currlong);
      setZoom(currzoom);

    } else {
      console.error("URL does not start with expected PREFIX");
    }
  }

  function handleMouseDown(e) {
    if (drawing) {
      console.log(`${e.clientX} ${e.clientY}`);
      var newarr = [...points, [e.clientX, e.clientY]];
      setPoints(newarr);
    }
  }

  const fetchMapData = async () => {
    try {
      const response = await fetch('http://localhost:5000/fetch-map-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (data.width == 0) fetchMapData();
      else {
        var num = "";
        var rest = "";
        for (let i = 0; i < data.content.length; i++) {
          if (data.content[i] == parseInt(data.content[i])) {
            num += data.content[i];
          } else rest += data.content[i];
        }
        console.log(rest);
        rest.trim();
        if (rest == ' كم' || rest == 'km') num += '000';

        setContent(parseInt(num));
        setWidth(parseInt(data.width) - 4);
      }
    } catch (error) {
      console.error('Error fetching map data:', error);
    }
  };

  return (
    <>
      <div className="title  sm:text-5xl text-4xl font-bold p-7 h-[104px] text-green-800 bg-green-300 w-full flex justify-center items-center">
        GeoArea Calculator
      </div>

      <div className="text-xs sm:text-lg font-bold inputurl flex items-center h-[80px] bg-green-200 justify-center py-5">
        <div className="radios sm:text-xl h-4 flex flex-col sm:flex-row mb-3 mr-2">
          <div className="lengthbutton">
            <input onClick={() => { setAreaorlength(0) }} type="radio" name="choice" id="" className='mx-2 ' />Length
          </div>
          <div className="areabutton">

            <input onClick={() => { setAreaorlength(1) }} type="radio" name="choice" id="" className='mx-2' />Area
          </div>
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-slate-600 rounded-2xl w-72px h-10 mx-2  text-white font-bold p-2"
        />
        <button
          onClick={() => {
            handleCoord();
            fetchMapData();
          }}
          className="bg-blue-500 hover:bg-blue-700 text-xs sm:text-lg text-white font-bold py-2 px-4 rounded-xl"
        >
          Fetch Map
        </button>
        {!width && lat ?
          <div className="loading"><img src="loading.gif" className='mx-5' height={35} width={35} alt="" /></div> :
          parseInt(content) > 0 ? <div className="scale mx-3 sm:text-xl ">Scale: {content} meters =  {parseInt(width) - 4} pixels</div> : <div></div>}
      </div>

      <div className="background bg-green-300">
        <div className="map-container flex bg-green-200 rounded-lg border-slate-700 h-[60vh]">

          <iframe
            src={"https://www.google.com/maps/embed/v1/view?key=AIzaSyClJRiEdv0Cig9FctptWN3w3yPMTa1iQqQ&center=" + lat + "," + long + "&zoom=" + zoom}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            title="Google Map Embed"
          ></iframe>
        </div>

        <div onMouseDown={handleMouseDown} className="draw rounded-lg h-[60vh] w-[100%] z-10 -my-[60vh]">
          <Canvas width={window.innerWidth} height={visualViewport.height*0.60} p={points} wh={window.height} />
        </div>
        <div className="footer flex sm:flex-row flex-col my-[62vh]">
  
            <div className="buttoncontainer  z-20 flex justify-center items-center">
              <button onClick={() => { setDrawing(!drawing) }} className="bg-blue-500 sm:text-lg hover:bg-blue-700 text-white font-bold py-2 sm:px-4 text-xs px-1 rounded-xl">
                {drawing ? "Disable Drawing" : "Enable Drawing"}
              </button>
              <button onClick={() => { setPoints([]) }} className="bg-blue-500 sm:text-lg hover:bg-blue-700 text-white font-bold py-2 sm:px-4 text-xs px-1  sm:mx-3 mx-1 rounded-xl">
                Clear Drawing
              </button>
              <button onClick={handleCalculate} className="bg-green-800 sm:text-lg hover:bg-green-900  text-white font-bold py-2 sm:px-4 text-xs px-1  sm:mx-3 mx-1 rounded-xl">
                Calculate
              </button>
              
            </div>
            <div className="ansdisplay">

              {length || area ?
                  areaorlength ? <div className='sm:text-3xl font-bold sm:p-7 text-green-800'> The area is {area} sq meters</div> : <div className='sm:text-3xl font-bold p-7 text-green-800'> The distance is {length} meters</div> : <div></div>}
            </div>

        </div>
      </div>
    </>
  );
}

export default App;
