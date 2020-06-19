// #################### GameWorld ####################
class GameWorld {
	constructor (width, height) {
		this.width = width;
		this.height = height;

		this.viewWorld = this.createViewWorld ();
		this.renderer = this.createRenderer ();
		this.directionalLight = this.createDirectionalLight ();
		// this.directionalLightHelper = this.createDirectionalLightHelper (this.directionalLight);
		this.ambientLight = this.createAmbientLight ();
		this.camera = this.createCamera (0, 50, 100);

		this.setScreenSize (window.innerWidth / 2, window.innerHeight - 50);

		this.viewWorld.add (this.directionalLight);
		this.viewWorld.add (this.ambientLight);
		// this.viewWorld.add (this.directionalLightHelper);
		this.viewWorld.add (this.camera);

		this.physWorld = this.createPhysWorld ();

		this.robots = [];
		this.balls = [];
		this.fields = [];
		this.walls = [];
		this.areas = [];
		this.lines = [];
		this.removeBallReservation = [];

		this.camAngle = 0;
		this.stopFlg = false;

		window.onresize = () => {
			this.setScreenSize (window.innerWidth / 2, window.innerHeight - 50);
		}
	}

	createViewWorld () {
		return new THREE.Scene ();
	}

	createRenderer () {
		const renderer = new THREE.WebGLRenderer ({
			canvas: document.querySelector ("#battle-canvas")
		});
		renderer.setClearColor (0x444444, 1.0);

		// 影
		renderer.shadowMap.enabled = true;

		return renderer;
	}

	createDirectionalLight () {
		const directionalLight = new THREE.DirectionalLight (0xffffff, 1.0);
		directionalLight.position.set (20, 50, 20);

		directionalLight.shadow.mapSize.width = 2048;
		directionalLight.shadow.mapSize.height = 2048;
		directionalLight.shadow.camera.left = -100;
		directionalLight.shadow.camera.right = 100;
		directionalLight.shadow.camera.top = -100;
		directionalLight.shadow.camera.bottom = 100;
		directionalLight.castShadow = true;
		return directionalLight;
	}

	createDirectionalLightHelper (light) {
		return new THREE.DirectionalLightHelper (light);
	}

	createAmbientLight () {
		return new THREE.AmbientLight (0xffffff, 0.6);
	}

	createCamera (x, y, z) {
		const camera = new THREE.PerspectiveCamera (45, this.width / this.height);
		camera.position.set (x, y, z);
		camera.lookAt (new THREE.Vector3 (0, 0, 0));

		return camera;
	}

	createPhysWorld () {
		const physWorld = new CANNON.World (); // 世界生成
		physWorld.gravity.set (0, -30, 0); // 重力を設定
		physWorld.broadphase = new CANNON.NaiveBroadphase (); // ぶつかっている可能性のある剛体同士を見つける
		physWorld.solver.iterations = 5;
		physWorld.tolerance = 0.1;

		return physWorld;
	}

	setScreenSize (width, height) {
		this.width = width;
		this.height = height;

		this.renderer.setPixelRatio (window.devicePixelRatio);
		this.renderer.setSize (this.width, this.height);
		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix ();
	}

	appendRobot (robot) {
		this.robots.push (robot);
		this.viewWorld.add (robot.threeObject);
		this.physWorld.add (robot.cannonObject);
	}

	appendBall (ball) {
		this.balls.push (ball);
		this.viewWorld.add (ball.threeObject);
		this.physWorld.add (ball.cannonObject);
	}

	appendField (field) {
		this.fields.push (field);
		this.viewWorld.add (field.threeObject);
		this.physWorld.add (field.cannonObject);
	}

	appendWall (wall) {
		this.walls.push (wall);
		this.viewWorld.add (wall.threeObject);
		this.physWorld.add (wall.cannonObject);
	}

	appendArea (area) {
		this.areas.push (area);
		this.viewWorld.add (area.threeObject);
	}

	appendLine (line) {
		this.lines.push (line);
		this.viewWorld.add (line.threeObject);
	}

	removeRobot (robot) {
		for (let i in this.robots) {
			if (this.robots[i] === robot) {
				this.robots.splice (i, 1);
				break;
			}
		}
		this.viewWorld.remove (robot.threeObject);
		robot.threeObject.geometry.dispose ();
		robot.threeObject.material.dispose ();

		this.physWorld.removeBody (robot.cannonObject);
	}

	setRemoveBallReservation (ball) {
		this.removeBallReservation.push (ball);
	}

	removeBall (ball) {
		for (let i in this.balls) {
			if (this.balls[i] === ball) {
				this.balls.splice (i, 1);
				break;
			}
		}
		this.viewWorld.remove (ball.threeObject);
		ball.threeObject.geometry.dispose ();
		ball.threeObject.material.dispose ();

		this.physWorld.removeBody (ball.cannonObject);
	}

	removeLine (line) {
		for (let i in this.lines) {
			if (this.lines[i] === line) {
				this.lines.splice (i, 1);
				break;
			}
		}
		this.viewWorld.remove (line.threeObject);
		line.threeObject.geometry.dispose ();
		line.threeObject.material.dispose ();
	}

	updateWorld () {
		if (!this.stopFlg) {
			this.physWorld.step (1 / 60);

			// 削除予約してある球を消す
			for (let ball of this.removeBallReservation) {
				this.removeBall (ball);
			}
			this.removeBallReservation = [];

			for (let robot of this.robots) {
				robot.update ();
			}
			for (let ball of this.balls) {
				ball.update ();
			}
			for (let field of this.fields) {
				field.update ();
			}
			for (let wall of this.walls) {
				wall.update ();
			}
			for (let area of this.areas) {
				area.update ();
			}
			for (let line of this.lines) {
				line.update (this);
			}

			const x = 150 * Math.cos (this.camAngle);
			const y = 100;
			const z = 150 * Math.sin (this.camAngle);
			this.camera.position.set (x, y, z);
			this.camera.lookAt (new THREE.Vector3 (0, 0, 0));
			this.camAngle += 0.001;

			this.renderer.render (this.viewWorld, this.camera);
		}
	}

	updateUI (myRobot, enemyRobot) {
		// UI要素をアップデート
		// document.getElementById ("hp1").innerHTML = "<p>　自分: " + myRobot.hp + "/" + 100 + "</p>";
		// document.getElementById ("hp2").innerHTML = "<p>　相手: " + enemyRobot.hp + "/" + 100 + "</p>";
		const percent1 = (myRobot.hp / myRobot.maxHP) * 100;
		document.getElementById ("hp1-gauge").style.width = percent1 + "%";
		if (enemyRobot != null) {
			const percent2 = (enemyRobot.hp / enemyRobot.maxHP) * 100;
			document.getElementById ("hp2-gauge").style.width = percent2 + "%";
		}
	}

	stop () {
		this.stopFlg = true;
	}

	reset () {
		this.stopFlg = false;
		for (const robot of this.robots) {
			robot.reset ();
		}
	}
}

// #############################################


// #################### Robot ####################
class Robot {
	constructor (x, y, z, color, maxHP = 100) {
		this.velocityX = 0;
		this.velocityY = 0;
		this.velocityZ = 0;

		// ----- Three.jsオブジェクト生成 -----
		this.threeObject = new THREE.Mesh (
			new THREE.CylinderGeometry (6, 6, 10),
			new THREE.MeshPhongMaterial ({color: color})
		);
		// 影
		this.threeObject.castShadow = true;
		this.threeObject.receiveShadow = true;

		// ----- Cannon.jsオブジェクト生成 -----
		const material = new CANNON.Material ("CylinderMat");
		material.friction = 0;
		this.cannonObject = new CANNON.Body ({
			mass: 1,
			material: material
		});
		// this.cannonObject.addShape (
		// 	new CANNON.Box (new CANNON.Vec3 (5, 5, 5))
		// );
		this.cannonObject.addShape (
			new CANNON.Cylinder (6, 6, 10, 12)
		);
		this.cannonObject.position.set (x, y, z);
		this.cannonObject.angularVelocity.set (0, 0, 0);
		// this.cannonObject.linearDamping = 0.8;
		this.cannonObject.angularDamping = 1;

		this.world = world;
		this.defaultX = x;
		this.defaultY = y;
		this.defaultZ = z;

		this.defaultColor = color;

		this.hp = maxHP;
		this.maxHP = maxHP;
		this.effectCount = 0;
		this.id = this.cannonObject.id;

		this.destroyedEventListener = () => {
		}
	}

	update () {
		// this.cannonObject.velocity = new CANNON.Vec3 (this.velocityX, this.cannonObject.velocity.y, this.velocityZ);
		this.threeObject.position.copy (this.cannonObject.position);
		this.threeObject.quaternion.copy (this.cannonObject.quaternion);

		// 被弾エフェクト
		if (this.effectCount > 0) {
			this.threeObject.material.color = new THREE.Color (0x992222);
			this.effectCount--;
		} else {
			this.threeObject.material.color = new THREE.Color (this.defaultColor);
		}
	}

	reset () {
		this.velocityX = 0;
		this.velocityY = 0;
		this.velocityZ = 0;
		this.hp = this.maxHP;

		this.threeObject.position.set (this.defaultX, 7, this.defaultZ);
		this.threeObject.quaternion.setFromAxisAngle (new THREE.Vector3 (1, 0, 0), 0);

		this.cannonObject.force = new CANNON.Vec3 (0, 0, 0);
		this.cannonObject.velocity.set (0, 0, 0);
		this.cannonObject.angularVelocity.set (0, 0, 0);
		this.cannonObject.position.set (this.defaultX, 7, this.defaultZ);
		this.cannonObject.quaternion.setFromAxisAngle (new CANNON.Vec3 (1, 0, 0), 0);
	}

	addForce (x, y, z) {
		this.cannonObject.velocity = new CANNON.Vec3 (x, y, z);
	}

	addTorque (x, y, z) {
		this.cannonObject.torque = new CANNON.Vec3 (x, y, z);
	}

	addDestroyedEventListener (listener) {
		this.destroyedEventListener = listener;
	}

	setDamage (damage) {
		this.hp -= damage;
		this.effectCount = 6;
		if (this.hp <= 0) {
			this.hp = 0;
			this.destroyedEventListener ();
		}
	}

	get velocity () {
		return this.cannonObject.velocity;
	}
}

// #############################################


// #################### Bullet ####################
class Bullet {
	constructor (world, x, y, z, radius, color, enemyRobot) {
		this.world = world;

		// ----- Three.jsオブジェクト生成 -----
		this.threeObject = new THREE.Mesh (
			new THREE.SphereGeometry (radius),
			new THREE.MeshPhongMaterial ({color: color})
		);
		// 影
		this.threeObject.castShadow = true;
		this.threeObject.receiveShadow = true;

		// ----- Cannon.jsオブジェクト生成
		this.cannonObject = new CANNON.Body ({
			mass: 2,
			material: new CANNON.Material ("ballMat")
		});
		this.cannonObject.addShape (new CANNON.Sphere (radius));
		this.cannonObject.position.set (x, y, z);
		this.enemyRobot = enemyRobot;
		this.cannonObject.addEventListener ("collide", (e) => {
			if (enemyRobot != null && e.body.id === this.enemyRobot.id) {
				this.enemyRobot.setDamage (10);
			}
			this.world.setRemoveBallReservation (this);
		});

		this.id = this.cannonObject.id;
	}

	update () {
		this.cannonObject.velocity.y = 0;

		this.threeObject.position.copy (this.cannonObject.position);
		this.threeObject.quaternion.copy (this.cannonObject.quaternion);
	}

	addForce (x, y, z) {
		this.cannonObject.velocity = new CANNON.Vec3 (x, y, z);
	}
}

// #############################################


// #################### Field ####################
class Field {
	constructor (x, y, z, width, height, color) {
		// ----- Three.jsオブジェクト生成 -----
		this.threeObject = new THREE.Mesh (
			new THREE.PlaneGeometry (width, height),
			new THREE.MeshStandardMaterial ({color: color, roughness: 0.0})
		);
		// 影
		this.threeObject.receiveShadow = true;

		const material = new CANNON.Material ("groundMat");
		material.friction = 0;
		// ----- Cannon.jsオブジェクト生成 -----
		this.cannonObject = new CANNON.Body ({
			mass: 0,
			material: material
		});
		this.cannonObject.addShape (new CANNON.Box (new CANNON.Vec3 (width / 2, height / 2, 1)));
		this.cannonObject.position.set (x, y, z);
		this.cannonObject.quaternion.setFromAxisAngle (new CANNON.Vec3 (1, 0, 0), -Math.PI / 2);

		this.id = this.cannonObject.id;
	}

	update () {
		this.threeObject.position.copy (this.cannonObject.position);
		this.threeObject.quaternion.copy (this.cannonObject.quaternion);
	}
}

// #############################################


// #################### Wall ####################
class Wall {
	constructor (x, y, z, xWidth, height, zWidth, color) {
		// ----- Three.jsオブジェクト生成 -----
		this.threeObject = new THREE.Mesh (
			new THREE.BoxGeometry (xWidth, height, zWidth),
			new THREE.MeshStandardMaterial ({color: color, roughness: 0.0})
		);
		// 影
		this.threeObject.castShadow = true;
		this.threeObject.receiveShadow = true;

		const material = new CANNON.Material ("wallMat");
		material.friction = 0;
		// ----- Cannon.jsオブジェクト生成 -----
		this.cannonObject = new CANNON.Body ({
			mass: 0,
			material: material
		});
		this.cannonObject.addShape (new CANNON.Box (new CANNON.Vec3 (xWidth / 2, height / 2, zWidth / 2)));
		this.cannonObject.position.set (x, y, z);

		this.id = this.cannonObject.id;
	}

	update () {
		this.threeObject.position.copy (this.cannonObject.position);
		this.threeObject.quaternion.copy (this.cannonObject.quaternion);
	}

}


// #################### Area ####################
class Area {
	constructor (x, y, z, width, height, depth, color, world) {
		// ----- Three.jsオブジェクト生成 -----
		this.threeObject = new THREE.Mesh (
			new THREE.BoxGeometry (width, height, depth),
			new THREE.MeshPhongMaterial ({color: color, transparent: true, opacity: 0.5})
		);
		this.threeObject.position.set (x, y, z);

		// 影
		this.threeObject.castShadow = true;
		this.threeObject.receiveShadow = true;

		this.targetObjects = []; // 接触判定相手のオブジェクト

		this.world = world;

		this.handler = (robot) => {
		};
	}

	addTargetObject (object) {
		this.targetObjects.push (object);
	}

	update () {
		for (const targetObject of this.targetObjects) {
			if (hitCheck (this, targetObject)) {

				this.handler (targetObject);
			}
		}
	}

	addEnterEventListener (listener) {
		this.handler = listener;
	}
}

// #############################################


// #################### Line ####################
class Line {
	constructor (origX, origY, origZ, destX, destY, destZ, color) {
		// ----- Three.jsオブジェクト生成 -----
		const geometry = new THREE.Geometry ();
		geometry.vertices.push (new THREE.Vector3 (origX, origY, origZ));
		geometry.vertices.push (new THREE.Vector3 (destX, destY, destZ));
		this.threeObject = new THREE.Line (
			geometry,
			new THREE.LineBasicMaterial ({color: color})
		);

		this.disposalCount = -1;

		this.origRobot = null;
	}

	update (scene) {
		if (this.origRobot != null) {
			const x = this.origRobot.threeObject.position.x;
			const y = this.origRobot.threeObject.position.y;
			const z = this.origRobot.threeObject.position.z;
			this.setOrig (x, y, z);
		}

		if (this.disposalCount === 0) {
			scene.removeLine (this);
		} else if (this.disposalCount > 0) {
			this.disposalCount--;
		}
	}

	setOrig (x, y, z) {
		this.threeObject.geometry.vertices[0] = new THREE.Vector3 (x, y, z);
		this.threeObject.geometry.verticesNeedUpdate = true;
	}

	setOrigRobot (robot) {
		this.origRobot = robot;
	}

	setDest (x, y, z) {
		this.threeObject.geometry.vertices[1] = new THREE.Vector3 (x, y, z);
		this.threeObject.geometry.verticesNeedUpdate = true;
	}

	setReserveDisposal (frame) {
		this.disposalCount = frame;
	}
}

// #############################################


function hitCheck (area, object) {
	area = area.threeObject;
	object = object.threeObject;

	// ----- areaからオブジェクトの接触判定 -----
	for (const srcVertex of area.geometry.vertices) {
		for (const destVertex of area.geometry.vertices) {
			// 方向ベクトルを作成
			const direction = destVertex
				.clone ()
				.sub (srcVertex);
			const length = direction.length ();
			direction.normalize ();

			const origin = area.position.clone ();
			origin.add (srcVertex);

			const raycaster = new THREE.Raycaster (origin, direction, 0, length);
			const intersects = raycaster.intersectObject (object);
			if (intersects.length > 0) {
				return true;
			}
		}
	}

	return false;
}
