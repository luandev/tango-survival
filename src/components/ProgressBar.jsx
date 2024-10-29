const ProgressBar = ({ progressPercentage }) => {
    const animationDuration = 1; // 1 second as defined in CSS
    const animationProgress = (progressPercentage / 100) * animationDuration;

    return (
        <div className="progress-bar">

            <div
                className={`progress ${progressPercentage < 30 ? 'danger' : ''}`}
                style={{
                    width: `${progressPercentage}%`,
                    // animationPlayState: 'running',
                    animationDelay: `-${1-animationProgress}s`,
                }}
            ></div>
        </div>

    );
};

export default ProgressBar