/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
/* eslint-disable react/button-has-type */
/* eslint-disable no-undef */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import AudioSvg from '../../assets/audio.svg'


let recordedChunks: any[] = [];
function Main() {
	const recordRef = useRef<HTMLImageElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const mediaRecorder = useRef<MediaRecorder>();
	const [recording, setRecording] = useState(false);

	useEffect(() => {
		
	}, [])
	const handelRecord = async () => {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		mediaRecorder.current = new MediaRecorder(stream);
	
		mediaRecorder.current.ondataavailable = (event) => {
			if (event.data.size > 0) {
				recordedChunks.push(event.data);
			}
		};
	
		mediaRecorder.current.onstop = () => {
			const blob = new Blob(recordedChunks, { type: 'audio/wav; codecs=opus' });
			// const audioURL = URL.createObjectURL(blob);
			// audioRef.current!.src = audioURL;
			recordedChunks = [];
		};
	
		mediaRecorder.current.start();
		setRecording(true);
	}

	const handelStop = () => {
	    mediaRecorder.current!.stop();
			setRecording(false);
	}
  return (
    <>
	<div className="auio-container">
		<div className="circle-animation" style={{ opacity: recording ? 1 : 0 }}></div>
		<img ref={recordRef} src={AudioSvg} alt="AudioSvg" className="auio-img-svg" />
	</div>
      {/* <h1>Electron Audio Recording</h1>
      <button onClick={handelRecord} disabled={recording}>Start Recording</button>
			<button onClick={handelStop} disabled={!recording}>Stop Recording</button>
			<audio ref={audioRef} controls></audio> */}
		</>
	);
}

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Main />} />
			</Routes>
		</Router>
	);
}
