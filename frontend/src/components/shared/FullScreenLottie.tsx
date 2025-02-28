import Lottie from 'react-lottie';
import animationData from '@/svg/fire.json';

const FullscreenLottie = () => {
    return (
        <div
            style={{
                position: 'fixed',
                zIndex: 1000,
                left: '50%',
                width: '100%',
                bottom: 0,
                transform: 'translate(-50%, 0%) scale(1.2)',
            }}
        >
            <Lottie options={{ animationData, loop: true }} />
        </div>
    );
};

export default FullscreenLottie;
