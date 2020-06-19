// #################### ロボットに付与するプログラム ####################
class Program {
	constructor (world, myRobot, enemyRobot, code, angleReverseFlg) {
		this.world = world;
		this.myRobot = myRobot;
		this.enemyRobot = enemyRobot;
		this.angleReverseFlg = angleReverseFlg;
		this.delay = 0; // 次のプログラムコマンドの実行遅延[ms]

		// インタプリタ初期化
		const self = this;

		function initFunc (interpreter, scope) {
			let wrapper;

			// ===== 出力 =====
			wrapper = function (text) {
				return self.print (text);
			};
			interpreter.setProperty (scope, "print", interpreter.createNativeFunction (wrapper));

			// ===== 移動 =====
			wrapper = function (angle) {
				return self.move (angle);
			};
			interpreter.setProperty (scope, "move", interpreter.createNativeFunction (wrapper));

			// ===== 停止 =====
			wrapper = function () {
				return self.stop ();
			};
			interpreter.setProperty (scope, "stop", interpreter.createNativeFunction (wrapper));

			// ===== 秒数待機 =====
			wrapper = function (time) {
				const ms = time * 1000;
				return self.wait (ms, self);
			};
			interpreter.setProperty (scope, "wait_s", interpreter.createNativeFunction (wrapper));

			// ===== ミリ秒待機 =====
			wrapper = function (time) {
				return self.wait (time, self);
			};
			interpreter.setProperty (scope, "wait_ms", interpreter.createNativeFunction (wrapper));

			// ===== 射撃 =====
			wrapper = function (angle) {
				return self.shot (angle, self.enemyRobot, self);
			};
			interpreter.setProperty (scope, "shot", interpreter.createNativeFunction (wrapper));

			// ===== スキャン =====
			wrapper = function (angle) {
				return self.scan (angle);
			};
			interpreter.setProperty (scope, "scan", interpreter.createNativeFunction (wrapper));

		}

		this.interpreter = new Interpreter (code, initFunc);
	}

	step () {
		// 1行ずつ実行
		return this.interpreter.step ();
	}


	// =============== 自作関数定義 ===============
	print (text) {
		console.log (text);
	}

	move (angle) {
		if (this.angleReverseFlg) {
			angle += 180;
		}
		angle -= 90;
		angle *= 3.1415 / 180.0; // ラジアンに変換

		const speed = 20;
		const x = speed * Math.cos (angle);
		const y = 0;
		const z = speed * Math.sin (angle);

		this.myRobot.addForce (x, y, z);
	}

	stop () {
		this.myRobot.addForce (0, 0, 0);
	}

	wait (ms, program) {
		program.delay = ms;
	}

	shot (angle, enemyRobot, program) {
		const power = 100;

		if (this.angleReverseFlg) {
			angle += 180;
		}

		let posAngle = (angle - 60) * Math.PI / 180;
		angle -= 90;
		angle *= Math.PI / 180;

		const posX = this.myRobot.threeObject.position.x + 10 * Math.cos (posAngle);
		const posZ = this.myRobot.threeObject.position.z + 10 * Math.sin (posAngle);

		const ball = new Bullet (this.world, posX, this.myRobot.threeObject.position.y, posZ, 0.5, 0xffa500, enemyRobot);
		this.world.appendBall (ball);

		const x = power * Math.cos (angle);
		const z = power * Math.sin (angle);
		ball.addForce (x, 0, z);

		program.delay = 500;
	}

	scan (angle) {
		let result = -1;

		if (this.angleReverseFlg) {
			angle += 180;
		}
		angle -= 90;
		angle *= 3.1415 / 180.0;

		let length = 100;
		const direction = new THREE.Vector3 (length * Math.cos (angle), 0, length * Math.sin (angle));

		// 距離測る
		if (this.enemyRobot != null) {
			direction.normalize ();
			const raycaster = new THREE.Raycaster (this.myRobot.threeObject.position, direction, 0, length);
			const intersects = raycaster.intersectObject (this.enemyRobot.threeObject);
			if (intersects.length > 0) {
				result = Math.floor (intersects[0].distance);
				length = intersects[0].distance;
			}
		}

		const x = this.myRobot.threeObject.position.x + length * direction.x;
		const y = this.myRobot.threeObject.position.y;
		const z = this.myRobot.threeObject.position.z + length * direction.z;

		// 線描画
		const line = new Line (0, 0, 0, x, y, z, 0xff0000);
		line.setReserveDisposal (6);
		line.setOrigRobot (this.myRobot);
		this.world.appendLine (line);

		return result;
	}

	// ==============================
}

// #############################################
