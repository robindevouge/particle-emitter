# @robindevouge/particle-emitter

## About

Framework agnostic particle emitter.

Maintainer: Robin Devouge (hello@robindevouge.be)

Repository: https://github.com/robindevouge/particle-emitter.git

_Please do not request for additional features, this package was developed to suit my needs during projects (that is why this package is scoped instead of public). If you wish to customize it you are free to do so by respecting the attached license._

## Install

```console
npm install @robindevouge/particle-emitter
```

## Usage

### Import

```javascript
import ParticleEmitter from '@robindevouge/particle-emitter';
```

### Initialization

```javascript
const emitter = new ParticleEmitter(config);
```

| Config                               | Type          | Default         | Description                                                                   |
| ------------------------------------ | ------------- | --------------- | ----------------------------------------------------------------------------- |
| **origin**                           | `HTMLElement` | `document.body` | Container element for the particles which will also be the coordinates origin |
| **particlesAmount**                  | `number`      | `-1`            | Number of particles to spawn (-1 for infinite)                                |
| **spawnInterval**                    | `number`      | `1`             | Interval between each particle spawn in seconds                               |
| **distance**                         | `number`      | `100`           | Travel distance from the origin in px                                         |
| **direction**                        | `number`      | `0`             | Direction of the particles in degrees                                         |
| **spread**                           | `number`      | `0`             | Spread cone of the particles in degrees, centered on the direction            |
| **onAllParticlesSpawned**            | `function`    | `() => {}`      | Callback function called when the spawn loop is complete                      |
| **particleOptions**                  | `object`      | `{}`            | Particle config object                                                        |
| **particleOptions.scale**            | `number`      | `1`             | Scale of the particles                                                        |
| **particleOptions.lifetime**         | `number`      | `1`             | Lifetime of the particles in seconds                                          |
| **particleOptions.mainClass**        | `string`      | `particle`      | Main class of the particles                                                   |
| **particleOptions.randomClasses**    | `array`       | `null`          | Array of random classes to add to the particles                               |
| **particleOptions.gsapTweenOptions** | `object`      | `{}`            | GSAP tween config object                                                      |
| **particleOptions.destroyDuration**  | `number`      | `0`             | Duration of the destroy tween in seconds (0 for no tween)                     |
| **particleOptions.onSpawn**          | `function`    | `() => {}`      | Callback function called when a particle is spawned                           |
| **particleOptions.onDestroy**        | `function`    | `() => {}`      | Callback function called when a particle is destroyed                         |

### Methods

#### **start()**

Start the particle emitter

```javascript
emitter.start(callback);
```

| Params       | Type       | Default    | Description |
| ------------ | ---------- | ---------- | ----------- |
| **callback** | `function` | `() => {}` | Callback    |

#### **stop()**

Stop the particle emitter

```javascript
emitter.stop(callback);
```

| Params       | Type       | Default    | Description |
| ------------ | ---------- | ---------- | ----------- |
| **callback** | `function` | `() => {}` | Callback    |

#### **clear()**

Destroys all existing particles

```javascript
emitter.clear(duration);
```

| Params       | Type     | Default | Description                                                       |
| ------------ | -------- | ------- | ----------------------------------------------------------------- |
| **duration** | `number` | `0`     | Duration of the destroy animation in seconds (0 for no animation) |

#### **spawnParticle()**

Spawns a single particle, returns the created particle instance

```javascript
emitter.spawnParticle();
```

## Examples

### Basic

```javascript
const emitter = new Emitter({
	origin: document.querySelector('.origin'),
	particlesAmount: 10,
	spawnInterval: 0.1,
	distance: 100,
	direction: 0,
	spread: 0,
	particleOptions: {
		scale: 1,
		lifetime: 1,
		mainClass: 'particle',
		randomClasses: ['particle--red', 'particle--blue', 'particle--green'],
		gsapTweenOptions: {
			ease: 'power1.inOut',
		},
		onSpawn: (particle) => {
			console.log('spawned', particle);
		},
		onDestroy: (particle) => {
			console.log('destroyed', particle);
		},
	},
});
```

## Next steps

- [ ] Allow origin to be coordinates OR element
- [ ] Allow distance OR end area/position
