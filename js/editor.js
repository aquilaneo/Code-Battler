class Editor {
	constructor () {
		this.blockEditors = [];
		this.textEditors = [];
		this.runFlg = false;

		this.program1 = null;
		this.program2 = null;

		this.time = null;
	}

	createEditor (blockEditorID, textEditorID, maxBlocks = null) {
		if (maxBlocks== null) {
			this.blockEditors.push (
				Blockly.inject (blockEditorID, {
					toolbox: document.getElementById ("toolbox"),
					grid: {
						spacing: 18,
						length: 3,
						colour: "#ccc",
						snap: true,
					}
				})
			);
		} else {
			this.blockEditors.push (
				Blockly.inject (blockEditorID, {
					toolbox: document.getElementById ("toolbox"),
					maxBlocks: maxBlocks,
					grid: {
						spacing: 18,
						length: 3,
						colour: "#ccc",
						snap: true,
					}
				})
			);
		}
		this.textEditors.push (
			document.getElementById (textEditorID)
		);
	}

	run (world, myRobot, enemyRobot, code1, code2) {
		this.stop (world);

		if (!this.runFlg) {
			// // コード化
			// let codes = [];
			// for (const editor of this.blockEditors) {
			// 	codes.push (
			// 		Blockly.JavaScript.workspaceToCode (editor)
			// 	);
			// }

			this.runFlg = true;

			// コードを実行
			this.program1 = new Program (world, myRobot, enemyRobot, code1, false);
			this.step1 ();
			if (code2 != null) {
				this.program2 = new Program (world, enemyRobot, myRobot, code2, true);
				this.step2 ();
			}
		}
	}

	step1 () {
		if (this.program1 != null && this.runFlg) {
			if (this.program1.step ()) {
				const self = this;
				window.setTimeout (() => {
						self.step1 ();
					},
					this.program1.delay);
				this.program1.delay = 0;
			}
		}
	}

	step2 () {
		if (this.program2 != null && this.runFlg) {
			if (this.program2.step ()) {
				const self = this;
				window.setTimeout (() => {
						self.step2 ();
					},
					this.program2.delay);
				this.program2.delay = 0;
			}
		}
	}

	stop (world) {
		this.runFlg = false; // 停止
		world.reset ();
	}

	blockToCodeEditor (blockEditorNumber) {
		const code = Blockly.JavaScript.workspaceToCode (this.blockEditors[blockEditorNumber - 1]);
		this.textEditors[blockEditorNumber - 1].value = code;
		return code;
	}

	getBlockCount (player) {
		return this.blockEditors[player - 1].getAllBlocks ().length;
	}
}
