import gsap from 'gsap';

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

const toRad = (angle: number) => angle * (Math.PI / 180);

const findMoveVector = (vect: Vector, distance: number, angle: number): Vector => {
	const radAngle = toRad(angle);
	const moveVect = {
		x: distance,
		y: 0,
	};
	const rotatedVect = {
		x: Math.round(moveVect.x * Math.cos(radAngle) - moveVect.y * Math.sin(radAngle)),
		y: Math.round(moveVect.x * Math.sin(radAngle) + moveVect.y * Math.cos(radAngle)),
	};
	return { x: vect.x + rotatedVect.x, y: vect.y + rotatedVect.y };
};

class Particle {
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

	constructor({ scale = 1, lifetime = 1, mainClass = 'particle', randomClasses = null, gsapTweenOptions = {}, destroyDuration = 0, onSpawn = () => {}, onDestroy = () => {}, onTweenComplete = () => {}, emitter }: ParticleOptions) {
		if (typeof scale === 'function') {
			this.scale = scale();
		} else {
			this.scale = scale;
		}

		if (typeof lifetime === 'function') {
			this.lifetime = lifetime();
		} else {
			this.lifetime = lifetime;
		}
		this.mainClass = mainClass;
		this.randomClasses = randomClasses;
		this.gsapTweenOptions = gsapTweenOptions;
		this.destroyDuration = destroyDuration;
		this.onSpawn = onSpawn;
		this.onDestroy = onDestroy;
		this.onTweenComplete = onTweenComplete;
		this.emitter = emitter;
	}

	/**
	 * Returns random coordinates inside the emitter's origin element
	 * @private
	 * @returns {object} - Object containing x and y coordinates
	 */
	#getStartCoordinates = () => {
		const originRect = this.emitter.origin.getBoundingClientRect();
		return {
			x: Math.random() * originRect.width - this.element.offsetWidth / 2,
			y: Math.random() * originRect.height - this.element.offsetHeight / 2,
		};
	};

	/**
	 * Returns coordinates at the end of the particle's movement
	 * @private
	 * @returns {object} - Object containing x and y coordinates
	 */
	#getEndCoordinates = () => {
		// compute random angle inside spread value
		const vectorAngle = this.emitter.direction + Math.floor(Math.random() * this.emitter.spread - this.emitter.spread / 2);

		return findMoveVector(this.startCoord, this.emitter.distance, vectorAngle);
	};

	/**
	 * Spawns the particle
	 * @public
	 * @returns {void}
	 */
	spawn = () => {
		// create DOM element
		this.element = document.createElement('div');
		this.element.classList.add(this.mainClass);
		if (this.randomClasses) {
			this.element.classList.add(this.randomClasses[Math.floor(Math.random() * this.randomClasses.length)]);
		}
		this.emitter.origin.appendChild(this.element);

		// compute start + end position
		this.startCoord = this.#getStartCoordinates();
		this.endCoord = this.#getEndCoordinates();

		// place element at starting position, idle
		gsap.set(this.element, {
			autoAlpha: 0,
			x: this.startCoord.x,
			y: this.startCoord.y,
			scale: this.scale,
		});

		// spawn callback
		this.onSpawn(this);

		// start movement
		this.move();
	};

	/**
	 * Starts the particle movement tween
	 * @public
	 * @returns {void}
	 */
	move = () => {
		// make element visible
		gsap.set(this.element, { autoAlpha: 1 });

		// tween
		this.tween = gsap.to(
			this.element,
			Object.assign(
				{
					x: this.endCoord.x,
					y: this.endCoord.y,
					duration: this.lifetime,
					onComplete: () => {
						this.onTweenComplete(this);
						this.destroy();
					},
				},
				this.gsapTweenOptions
			)
		);
	};

	/**
	 * Destroys the particle
	 * @param {number} [duration] - Duration of the destroy animation in seconds (0 for no animation)
	 */
	destroy = (duration = this.destroyDuration) => {
		gsap.to(this.element, {
			autoAlpha: 0,
			duration: duration,
			onComplete: () => {
				this.element.remove();
			},
		});
		this.tween.kill();
		this.emitter.particlesArray = this.emitter.particlesArray.filter((part) => part !== this);
	};
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

	constructor({ origin = document.body, particlesAmount = -1, spawnInterval = 1, distance = 100, direction = 0, spread = 0, onAllParticlesSpawned = () => {}, particleOptions = {} } = {}) {
		this.origin = origin;
		this.particlesAmount = particlesAmount;
		this.spawnInterval = spawnInterval;
		this.distance = distance;
		this.direction = direction;
		this.spread = spread;
		this.onAllParticlesSpawned = onAllParticlesSpawned;
		this.particleOptions = { ...particleOptions, emitter: this };
		this.particlesArray = [];
		this.spawnLoop = null;

		this.nbSpawnedParticles = 0;
	}

	/**
	 * Starts the emitter
	 * @param {function} [callback=() => {}]
	 */
	start = (callback = () => {}) => {
		if (this.spawnLoop) return;
		this.spawnLoop = gsap.set(this.spawnParticle, {
			onRepeat: () => {
				this.spawnParticle();
			},
			repeat: this.particlesAmount,
			repeatDelay: this.spawnInterval,
		});
		this.spawnParticle();
		callback();
	};

	/**
	 * Stops the emitter
	 * @param {function} [callback=() => {}]
	 */
	stop = (callback = () => {}) => {
		if (this.spawnLoop) {
			this.spawnLoop.kill();
			this.nbSpawnedParticles = 0;
			callback();
		}
	};

	/**
	 * Destroys all existing particles
	 * @param {number} [duration=0] Duration of the destroy animation in seconds (0 for no animation)
	 * @see Particle#destroy
	 */
	clear = (duration = 0) => {
		this.particlesArray.forEach((particle) => {
			particle.destroy(duration);
		});
	};

	/**
	 * Spawns a particle
	 * @returns {Particle} Particle instance
	 */
	spawnParticle = () => {
		const particle = new Particle(this.particleOptions);
		this.particlesArray.push(particle);
		particle.spawn();

		this.nbSpawnedParticles++;

		if (this.particlesAmount !== -1 && this.nbSpawnedParticles >= this.particlesAmount) {
			this.onAllParticlesSpawned();
		}

		return particle;
	};
}
