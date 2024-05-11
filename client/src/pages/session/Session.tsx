import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import Host from "../host/Host";
import Participant from "../participant/Participant";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import JoinConferenceForm from "../../components/Modal";

const Session = () => {
    const { id } : any = useParams();
    const { currentUser } = useContext(AuthContext);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, , getName] = useLocalStorage<string>('participantName', '');
    const participantName = getName();
    const [showJoinForm, setShowJoinForm] = useState(false);

    useEffect(() => {
        if (!currentUser && !participantName) {
            setShowJoinForm(true);
        }
    }, [currentUser, participantName]);

    if (currentUser) {
        return <Host sessionId={id} />;
    } else if (participantName) {
        return <Participant sessionId={id} participantName={participantName} />;
    } else {
        return (
            <>
                {showJoinForm && <JoinConferenceForm sessionId={id} onClose={() => setShowJoinForm(false)} />}
            </>
        );
    }
};


export default Session;
