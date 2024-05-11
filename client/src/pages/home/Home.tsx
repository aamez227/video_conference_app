import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from '@mui/material/Button';
import makeRequest from "../../axios";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const mutationKey = ['sessions']
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationKey,
        mutationFn: () => {
            return makeRequest.post('sessions')
        },
        onSuccess: (data: any) => {
            const result = data.data;
            if (result && result.session && result.session.id) {
                queryClient.invalidateQueries({ queryKey: ['sessions'] });
                navigate(`/session/${result.session.id}`);
            }
        }
    });

    const handleClick = async () => {
        mutation.mutate();
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
            <Typography>
                Welcome to the conference app!
            </Typography>
            <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => handleClick()}
            >
                Start a instant conference
            </Button>
            <div>Schedule feature comming up!</div>
        </Box>
    )
}

export default Home