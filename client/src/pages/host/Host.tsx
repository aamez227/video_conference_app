import { Grid, Avatar, IconButton, Box, Typography } from '@mui/material';
import { Mic, ScreenShare, CallEnd } from '@mui/icons-material';
import { io } from 'socket.io-client';
import { Key, useEffect, useState } from 'react';
import { toastNotification } from '../../utils/toast';
import { useQuery } from '@tanstack/react-query';
import makeRequest from '../../axios';
const socket = io("http://localhost:8800");

const hostAvatar = 'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250';

const Host = ({ sessionId }: any) => {
    socket.emit("host-join-room", sessionId);

    const { data: session } = useQuery({
        queryFn: () => makeRequest(`sessions/${sessionId}`),
        queryKey: ['session'],
        retry: 1
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [timerDuration, setTimerDuration] = useState(0);

    const handleTimerStart = (duration: number) => {
        setTimerDuration(duration);
        socket.emit("start-timer", sessionId, duration);
    };

    useEffect(() => {
        socket.on("hand-raised", (participantId) => {
            toastNotification(`Participant ${participantId} raised their hand!`, 'info');
        });

        return () => {
            socket.off("hand-raised");
        };
    }, []);

    useEffect(() => {
        socket.on("participant-join-room", (name) => {
            toastNotification(`Participant ${name} joined the conference`, 'info');
        });

        return () => {
            socket.off("participant-join-room");
        };
    }, []);

    let gridSize: number;
    switch (session?.data.participants.length) {
        case 2:
            gridSize = 6;
            break;
        case 4:
            gridSize = 4;
            break;
        default:
            gridSize = 3;
    }

    return (
        <Box sx={{ position: 'relative', width: '100vw', height: '100vh' }}>
            <Grid container spacing={2} style={{ width: '100%', height: '100%' }}>
                {session?.data.participants.map((participant: { name: string | undefined; avatar: string | undefined; }, index: Key | null | undefined) => (
                    <Grid key={index} item xs={6} sm={6} md={6} lg={gridSize}>
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'lightgray',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column'
                            }}
                        >
                            <Avatar alt={participant.name} src={'https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109'} sx={{ width: 80, height: 80 }} />
                            <Typography mt={2}>{participant.name}</Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{
                position: 'absolute', bottom: 16, right: 16, width: 200, height: 200, backgroundColor: 'lightgray',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Avatar alt="Host" src={hostAvatar} sx={{
                    width: '60%',
                    height: '60%'
                }} />
            </Box>
            <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}>
                <IconButton>
                    <Mic />
                </IconButton>
                <IconButton>
                    <ScreenShare />
                </IconButton>
                <IconButton>
                    <CallEnd />
                </IconButton>
                <IconButton sx={{ ml: 5 }} onClick={() => handleTimerStart(15)}>
                    15s
                </IconButton>
                <IconButton onClick={() => handleTimerStart(30)}>
                    30s
                </IconButton>
                <IconButton onClick={() => handleTimerStart(45)}>
                    45s
                </IconButton>
            </Box>
        </Box>
    );
};

export default Host;
