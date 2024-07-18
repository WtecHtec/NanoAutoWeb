/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
/* eslint-disable react/button-has-type */
/* eslint-disable no-undef */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import AudioSvg from '../../assets/audio.svg';

const sampleRate = 16000;
function Main() {
	const recordRef = useRef<HTMLImageElement>(null);
	// const audioRef = useRef<HTMLAudioElement>(null);
	const mediaRecorder = useRef<any>({
		recorder: null,
		recordedChunks: [],
		handleing: false,
	});
	const [recording, setRecording] = useState(false);
	const [msgList, setMsgList] = useState<any>([])
	const [agentIng, setAgentIng] = useState(false)
	const [prompt, setPrompt] = useState('')


	const handelRecord = async () => {
		if (mediaRecorder.current.handleing) return;
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		mediaRecorder.current.recorder = new MediaRecorder(stream);

		const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate });
		const input = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    input.connect(processor);
    processor.connect(audioContext.destination);

    processor.onaudioprocess = (e) => {
      const float32Array = e.inputBuffer.getChannelData(0);
      const pcmData = new Int16Array(float32Array.length);
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < float32Array.length; i++) {
        pcmData[i] = float32Array[i] * 0x7FFF; // 将 Float32 转换为 Int16
      }
      mediaRecorder.current.recordedChunks.push(...pcmData);
    };
	
		// mediaRecorder.current.recorder.ondataavailable = (event) => {
		// 	if (event.data.size > 0) {
		// 		mediaRecorder.current.recordedChunks.push(event.data);
		// 	}
		// };
	
		mediaRecorder.current.recorder.onstop = async () => {
			const { recordedChunks } = mediaRecorder.current;
			// const blob = new Blob(recordedChunks, { type: 'audio/pcm' });
			// const blob = new Blob([new Int16Array(recordedChunks).buffer], { type: 'audio/pcm' });
			// const arrayBuffer = await blob.arrayBuffer();
			mediaRecorder.current.handleing = true;
			window.electron.ipcRenderer.sendMessage('exprot-blob-render', { buffer: new Int16Array(recordedChunks).buffer }); 
			setAgentIng(true)
			mediaRecorder.current.recordedChunks = [];
		};
	
		mediaRecorder.current.recorder.start();
		setRecording(true);
	}

	const handelStop = () => {
		console.log('handelStop')
		setRecording(false);
		if (!mediaRecorder.current.recorder) return
	    mediaRecorder.current.recorder!.stop();
		
	}
	useEffect(() => {
		// eslint-disable-next-line no-useless-return
		if (!recordRef.current) return;
		const recordRefDom = recordRef.current
		recordRefDom.addEventListener('mousedown', handelRecord);
		recordRefDom.addEventListener('mouseup', handelStop);
		const cleanup = () => {
			recordRefDom!.removeEventListener('mousedown', handelRecord);
			recordRefDom!.removeEventListener('mouseup', handelStop);
		}
		// eslint-disable-next-line consistent-return
		return cleanup;
	}, [])

	useEffect(() => {
		const handle = () => {
			mediaRecorder.current.handleing = false;
		}
		const handleAgent = (_, result) => {
			console.log('result---', result);
			const [prompt, data] = result
			const nwMsgs = [{
				role: 'user',
				content: prompt
			}]
			if (data && data.code === 1 && Array.isArray(data.data)) {
				nwMsgs.push({
					role: 'system',
					content: data.data
				})
			} else {
				nwMsgs.push({
					role: 'error',
					content: '未知错误'
				})
			}
			// eslint-disable-next-line @typescript-eslint/no-shadow
			setMsgList((msgList: any) => [...msgList, ...nwMsgs])
			setAgentIng(false)
			mediaRecorder.current.handleing = false
		}
		window.electron.ipcRenderer.on('finish_spark_main', handle);
		window.electron.ipcRenderer.on('agent_main', handleAgent);
		return () => {
			window.electron.ipcRenderer.off('finish_spark_main', handle);
			window.electron.ipcRenderer.off('agent_main', handleAgent);
		}
	}, [])

	const handelSend = (prompt: string) => {
		if (mediaRecorder.current.handleing) return;
		mediaRecorder.current.handleing = true
		setAgentIng(true)
		console.log('handelSend', prompt)
		window.electron.ipcRenderer.sendMessage('exprot-blob-render', { prompt, }); 
		setPrompt('')
	}
  return (
    <>
	<div className="llm-audio-container">
	<ul style={{ overflow: 'auto', flex: 1}}>
		{
			msgList.map((item: any) => {
				const { role, content } = item
				return role === 'user' || role === 'error'
					? <li className={ 'user-content opacity-animation ' + (role === 'error' ? ' error' : '')}>{content}</li>
					: <ul className="system-content opacity-animation ">
						{
							content.map((citem: any) => <li>{citem.observation}</li>)
						}
					</ul>
				
			})
		}
		<div className={ 'agent-ing ' + (agentIng ? ' opacity-animation' : 'opacity-hide-animation') }>处理中...</div> 
	</ul>
		<div className="audio-input-container">
			<div className="input-container">
				<input className="input-text" value={prompt} onChange={(e) => setPrompt(e.target.value)}></input>
				<button className="send-btn" onClick={() => handelSend(prompt)}>发送</button>
			</div>
			
			 <div className="auio-container">
				<div className="circle-animation" style={{ opacity: recording ? 1 : 0 }}></div>
				<img ref={recordRef} src={AudioSvg} alt="AudioSvg" className="auio-img-svg" />
			</div>
		</div>
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
