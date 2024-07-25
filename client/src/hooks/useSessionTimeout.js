import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { signOut } from '../redux/auth/userSlicer';

const useSessionTimeout = (tokenExpiry) => {
    const [showModal, setShowModal] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!tokenExpiry) return;

        const sessionExpiryTime = new Date(tokenExpiry).getTime();
        const checkSessionTimeout = () => {
            const currentTime = new Date().getTime();
            const timeLeft = sessionExpiryTime - currentTime;

            if (timeLeft <= 0) {
                dispatch(signOut());
            } else if (timeLeft <= 60000) { // Show modal when 1 minute or less is remaining
                setShowModal(true);
                setRemainingTime(Math.ceil(timeLeft / 1000));
            }
        };

        const interval = setInterval(checkSessionTimeout, 1000); // Check every second

        return () => clearInterval(interval);
    }, [tokenExpiry, dispatch]);

    useEffect(() => {
        if (remainingTime > 0) {
            const countdownInterval = setInterval(() => {
                setRemainingTime(prev => prev - 1);
            }, 1000);

            return () => clearInterval(countdownInterval);
        }
    }, [remainingTime]);

    return { showModal, setShowModal, remainingTime };
};

export default useSessionTimeout;
