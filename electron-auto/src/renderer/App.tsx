/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
/* eslint-disable react/button-has-type */
/* eslint-disable no-undef */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import AudioSvg from '../../assets/audio.svg'

function blobToArrayBuffer(blob) {
	return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (event) => {
					resolve(event.target!.result);
			};
			reader.onerror = (event) => {
					reject(new Error(`FileReader error: ${event.target!.error}`));
			};
			reader.readAsArrayBuffer(blob);
	});
}

function Main() {
	const recordRef = useRef<HTMLImageElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const mediaRecorder = useRef<any>({
		recorder: null,
		recordedChunks: [],
	});
	const [recording, setRecording] = useState(false);


	const handelRecord = async () => {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		mediaRecorder.current.recorder = new MediaRecorder(stream);
	
		mediaRecorder.current.recorder.ondataavailable = (event) => {
			if (event.data.size > 0) {
				mediaRecorder.current.recordedChunks.push(event.data);
			}
		};
	
		mediaRecorder.current.recorder.onstop = async () => {
			const { recordedChunks } = mediaRecorder.current;
			const blob = new Blob(recordedChunks, { type: 'audio/wav' });
			const arrayBuffer = await blob.arrayBuffer();
			window.electron.ipcRenderer.sendMessage('exprot-blob-render', { buffer: arrayBuffer }); 
			return;
				const audioURL = URL.createObjectURL(blob);
				// eslint-disable-next-line promise/catch-or-return
				fetch(audioURL)  
				.then(response => response.blob())  
				// eslint-disable-next-line @typescript-eslint/no-shadow
				.then(blob => {  
					// 将 Blob 对象转换为 ArrayBuffer，以便通过 IPC 发送  
					return new Promise((resolve, reject) => {  
						const reader = new FileReader();  
						reader.onload = (event: any) => resolve(event.target.result);  
						reader.onerror = (event: any)  => reject(event.error);  
						reader.readAsArrayBuffer(blob);  
					});  
				})  
				// eslint-disable-next-line promise/always-return
				.then(async (arrayBuffer) => {  
					window.electron.ipcRenderer.sendMessage('exprot-blob-render', { buffer: arrayBuffer }); 
				})
			// const buffer = await blobToArrayBuffer(blob);
			// await window.electron.ipcRenderer.sendMessage('exprot-blob-render',  { buffer }); 
		
			audioRef.current!.src = audioURL;
			mediaRecorder.current.recordedChunks = [];
		};
	
		mediaRecorder.current.recorder.start();
		setRecording(true);
	}

	const handelStop = () => {
	    mediaRecorder.current.recorder!.stop();
			setRecording(false);
	}
	useEffect(() => {
		// eslint-disable-next-line no-useless-return
		if (!recordRef.current) return;
		const recordRefDom = 	recordRef.current
		recordRefDom.addEventListener('mousedown', handelRecord);
		recordRefDom.addEventListener('mouseup', handelStop);
		const cleanup = () => {
			recordRefDom!.removeEventListener('mousedown', handelRecord);
			recordRefDom!.removeEventListener('mouseup', handelStop);
		}
		// eslint-disable-next-line consistent-return
		return cleanup;
	}, [])

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
