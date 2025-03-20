interface Vector {
    x: number;
    y: number;
}
interface ParticleOptions {
    scale?: number | (() => number);
    lifetime?: number | (() => number);
    mainClass?: string;
    randomClasses?: string[] | null;
    gsapTweenOptions?: gsap.TweenVars;
    destroyDuration?: number;
    onSpawn?: (particle: Particle) => void;
    onDestroy?: (particle: Particle) => void;
    onTweenComplete?: (particle: Particle) => void;
    emitter: Emitter;
}
declare class Particle {
    #private;
    /**
     * Customizable particle instantiated by an Emitter
     * @class Particle
     * @param {object} particleOptions - Particle config object
     * @param {number|function} [particleOptions.scale=1] - Scale of the particle
     * @param {number|function} [particleOptions.lifetime=1] - Lifetime of the particle in seconds
     * @param {string} [particleOptions.mainClass='particle'] - Main class of the particle
     * @param {string[]} [particleOptions.randomClasses=null] - Array of classes to randomly assign to the particle
     * @param {object} [particleOptions.gsapTweenOptions={}] - GSAP tween config object
     * @param {number} [particleOptions.destroyDuration=0] - Duration of the destroy tween in seconds (0 for no tween)
     * @param {function} [particleOptions.onSpawn=()=>{}] - Function to call when the particle is spawned
     * @param {function} [particleOptions.onDestroy=()=>{}] - Function to call when the particle is destroyed
     * @param {Emitter} particleOptions.emitter - Emitter instance
     * @returns {Particle}
     *
     * @see Emitter
     */
    scale: number;
    lifetime: number;
    mainClass: string;
    randomClasses: string[] | null;
    gsapTweenOptions: gsap.TweenVars;
    destroyDuration: number;
    onSpawn: (particle: Particle) => void;
    onDestroy: (particle: Particle) => void;
    onTweenComplete: (particle: Particle) => void;
    emitter: Emitter;
    element: HTMLElement;
    tween: gsap.core.Tween;
    startCoord: Vector;
    endCoord: Vector;
    constructor({ scale, lifetime, mainClass, randomClasses, gsapTweenOptions, destroyDuration, onSpawn, onDestroy, onTweenComplete, emitter }: ParticleOptions);
    /**
     * Spawns the particle
     * @public
     * @returns {void}
     */
    spawn: () => void;
    /**
     * Starts the particle movement tween
     * @public
     * @returns {void}
     */
    move: () => void;
    /**
     * Destroys the particle
     * @param {number} [duration] - Duration of the destroy animation in seconds (0 for no animation)
     */
    destroy: (duration?: number) => void;
}
export default class Emitter {
    /**
     * @class Emitter
     * @returns {Emitter} Emitter instance
     *
     * @param {object} emitterOptions - Emitter config object
     * @param {HTMLElement} [emitterOptions.origin=document.body] - Container element for the particles which will also be the coordinates origin
     * @param {number} [emitterOptions.particlesAmount=-1] - Number of particles to spawn (-1 for infinite)
     * @param {number} [emitterOptions.spawnInterval=1] - Interval between each particle spawn in seconds
     * @param {number} [emitterOptions.distance=100] - Travel distance from the origin in px
     * @param {number} [emitterOptions.direction=0] - Direction of the particles in degrees
     * @param {number} [emitterOptions.spread=0] - Spread cone of the particles in degrees, centered on the direction
     * @param {function} [emitterOptions.onAllParticlesSpawned=() => {}] - Callback function called when the spawn loop is complete
     * @param {object} [emitterOptions.particleOptions={}] - Particle config object
     * @param {number|function} [emitterOptions.particleOptions.scale=1] - Scale of the particles
     * @param {number|function} [emitterOptions.particleOptions.lifetime=1] - Lifetime of the particles in seconds
     * @param {string} [emitterOptions.particleOptions.mainClass='particle'] - Main class of the particles
     * @param {string[]} [emitterOptions.particleOptions.randomClasses=null] - Array of random classes to add to the particles
     * @param {object} [emitterOptions.particleOptions.gsapTweenOptions={}] - GSAP tween config object
     * @param {number} [emitterOptions.particleOptions.destroyDuration=0] - Duration of the destroy tween in seconds (0 for no tween)
     * @param {function} [emitterOptions.particleOptions.onSpawn=() => {}] - Callback function called when a particle is spawned
     * @param {function} [emitterOptions.particleOptions.onDestroy=() => {}] - Callback function called when a particle is destroyed
     *
     * @see Particle
     */
    origin: HTMLElement;
    particlesAmount: number;
    spawnInterval: number;
    distance: number;
    direction: number;
    spread: number;
    onAllParticlesSpawned: () => void;
    particleOptions: ParticleOptions;
    particlesArray: Particle[];
    spawnLoop: gsap.core.Tween | null;
    nbSpawnedParticles: number;
    constructor({ origin, particlesAmount, spawnInterval, distance, direction, spread, onAllParticlesSpawned, particleOptions }?: {
        origin?: HTMLElement | undefined;
        particlesAmount?: number | undefined;
        spawnInterval?: number | undefined;
        distance?: number | undefined;
        direction?: number | undefined;
        spread?: number | undefined;
        onAllParticlesSpawned?: (() => void) | undefined;
        particleOptions?: {} | undefined;
    });
    /**
     * Starts the emitter
     * @param {function} [callback=() => {}]
     */
    start: (callback?: () => void) => void;
    /**
     * Stops the emitter
     * @param {function} [callback=() => {}]
     */
    stop: (callback?: () => void) => void;
    /**
     * Destroys all existing particles
     * @param {number} [duration=0] Duration of the destroy animation in seconds (0 for no animation)
     * @see Particle#destroy
     */
    clear: (duration?: number) => void;
    /**
     * Spawns a particle
     * @returns {Particle} Particle instance
     */
    spawnParticle: () => Particle;
}
export {};
