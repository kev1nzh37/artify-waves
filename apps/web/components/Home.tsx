import { useEffect, useState } from "react";
import { Bits, Cloudy, Distance, Erosion, Gems, Haze, Procedural, Ray, Rivulet, Shador } from "@repo/ui"
import { useRouter } from "next/router";

export const Home = () => {
    const router = useRouter();
    const [currentWaveIndex, setCurrentWaveIndex] = useState(0);
    const [nextWaveIndex, setNextWaveIndex] = useState(1);
    const waves = [Bits, Cloudy, Distance, Erosion, Gems, Haze, Procedural, Ray, Rivulet, Shador];
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const transitionWave = () => {
            setIsTransitioning(true)
            setTimeout(() => {
                setIsTransitioning(false)
                setCurrentWaveIndex(nextWaveIndex)
                setNextWaveIndex((nextWaveIndex + 1) % waves.length)
            }, 1000)
        };

        const interval = setInterval(transitionWave, 3000);

        return () => clearInterval(interval);
    }, [nextWaveIndex]);

    const CurrentWaveComponent = waves[currentWaveIndex];
    const NextWaveComponent = waves[nextWaveIndex];

    return (
        <div className="home">
            <div className="home-bg"></div>
            <h1>Artify Waves</h1>
            <h2>A dynamic canvas component library built on the modern JavaScript framework, React, and enhanced by the power of OGL.</h2>
            <div className="home-button">
                <div className="home-button__primary" onClick={() => router.push('/docs')}>Get Started</div>
                <div className="home-button__default" onClick={() => router.push('/docs/all')}>All Waves</div>
            </div>
            <div className="home-wave">
                <CurrentWaveComponent className={`home-wave-content ${isTransitioning ? 'home-wave-content-animation' : ''}`} width="100%" height="100%" />
                {isTransitioning && <NextWaveComponent className={`home-wave-content home-wave-down`} width="100%" height="100%" />}
            </div>
        </div>
    );
};
