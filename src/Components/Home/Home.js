import React, { useState } from 'react'
import Upload from '../Upload/Upload';
import Loading from '../Loading/Loading';

const Home = () => {
  const [processing, setProcessing] = useState(-1);
  const [type, setType] = useState("");
  return (
    processing === -1 ?
    <Upload setProcessing={setProcessing} setType={setType} /> :
    <Loading processing={processing} type={type} /> 
  )
}

export default Home;