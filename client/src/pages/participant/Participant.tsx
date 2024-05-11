import { Avatar, IconButton, Box, Typography } from '@mui/material';
import { Mic, ScreenShare, CallEnd } from '@mui/icons-material';
import { io } from 'socket.io-client';
import { Key, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import makeRequest from '../../axios';
import { useLocalStorage } from '../../hooks/useLocalStorage';
const socket = io("http://localhost:8800");

const hostAvatar = 'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5';

const Participant = ({ sessionId, participantName }: any) => {
    socket.emit("participant-join-room", sessionId, participantName);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [handRaised, setHandRaised] = useState(false);
    const [name] = useLocalStorage<string>('participantName', '');

    const { data: participants } = useQuery({
        queryFn: () => makeRequest(`sessions/participants/${sessionId}`),
        queryKey: ['participant-session'],
        retry: 1
    });

    const raiseHand = () => {
        console.log("Hand raised by participant");
        socket.emit("raise-hand", sessionId, participantName);
        setHandRaised(true);
    };

    const [timer, setTimer] = useState<number | null>(null);

    useEffect(() => {
        socket.on("timer-started", (duration) => {
            startCountdown(duration);
        });

        return () => {
            socket.off("timer-started");
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startCountdown = (duration: any) => {
        setTimer(duration);

        const intervalId = setInterval(() => {
            setTimer((prevTimer: any) => prevTimer - 1);
        }, 1000);

        setTimeout(() => {
            clearInterval(intervalId);
            playSound();
        }, duration * 1000);
    };

    const playSound = () => {
        const audio = new Audio("/timer.mp3");
        audio.play().catch(error => {
            console.error("Autoplay prevented:", error);
        });
    };

    const formatTime = (seconds: any) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <Box sx={{ display: 'flex', width: '100vw', height: '100vh' }}>
            <Box sx={{ width: '10%', overflowY: 'auto', backgroundColor: '#f0f0f0' }}>
                {participants?.data.participants.map((participant: { name: string | undefined; }, index: Key | null | undefined) => (
                    <Box key={index} sx={{
                        width: 200, height: 200, backgroundColor: 'lightgray',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottom: '1px solid #000',
                        flexDirection: 'column'
                    }}>
                        <Avatar alt={participant.name} src={'https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109'} sx={{
                            width: '40%',
                            height: '40%'
                        }} />
                        <Typography mt={1}>{participant.name}</Typography>
                    </Box>
                ))}
            </Box>

            <Box sx={{ width: '90%', position: 'relative' }}>
                <Box sx={{
                    position: 'absolute', top: '10px', right: '10px', left: '10px', backgroundColor: 'lightgray',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center', width: '100%', height: '100%',
                    flexDirection: 'column'
                }}>
                    <Avatar alt="Host" src={hostAvatar} sx={{ width: 100, height: 100 }} />
                    <Typography mt={2}>{participants?.data.hostName}</Typography>
                </Box>

                <Box sx={{
                    position: 'absolute', bottom: 16, right: 16, width: 200, height: 200, backgroundColor: 'lightgray',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}>
                    <Avatar alt="Host" src={hostAvatar} sx={{
                        width: '60%',
                        height: '60%'
                    }} />
                    <Typography mt={2}>{name}</Typography>
                </Box>

                <Box sx={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
                    <IconButton>
                        <Mic />
                    </IconButton>
                    <IconButton onClick={() => raiseHand()}>
                        <ScreenShare />
                    </IconButton>
                    <IconButton>
                        <CallEnd />
                    </IconButton>
                    {timer !== null && <p>Timer - {formatTime(timer)}</p>}
                </Box>
            </Box>
        </Box>
    );
};

export default Participant;
