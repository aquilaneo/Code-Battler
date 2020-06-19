// ========== コンソール出力 =====
Blockly.Blocks['print'] = {
	init: function () {
		this.appendDummyInput ()
			.appendField ("ログを出力");
		this.appendValueInput ("text")
			.setCheck (null)
			.appendField ("出力内容");
		this.setInputsInline (true);
		this.setPreviousStatement (true, null);
		this.setNextStatement (true, null);
		this.setColour (135);
		this.setTooltip ("ログを出力します。");
		this.setHelpUrl ("");
	}
};
Blockly.JavaScript['print'] = function (block) {
	const text = Blockly.JavaScript.valueToCode (block, 'text', Blockly.JavaScript.ORDER_ATOMIC);
	return "print (" + text + ");\n";
};

// ========== 角度移動 ==========
Blockly.Blocks['move_angle'] = {
	init: function () {
		this.appendDummyInput ()
			.appendField ("移動");
		this.appendValueInput ("angle")
			.setCheck ("Number")
			.appendField ("方向");
		this.appendDummyInput ()
			.appendField ("°");
		this.setInputsInline (true);
		this.setPreviousStatement (true, null);
		this.setNextStatement (true, null);
		this.setColour (230);
		this.setTooltip ("ロボットを指定した方向に移動させます。");
		this.setHelpUrl ("");
	}
};
Blockly.JavaScript['move_angle'] = function (block) {
	const angle = Blockly.JavaScript.valueToCode (block, 'angle', Blockly.JavaScript.ORDER_ATOMIC);
	return "move (" + angle + ");\n";
};

// ========== 停止 ==========
Blockly.Blocks['stop'] = {
	init: function () {
		this.appendDummyInput ()
			.appendField ("停止");
		this.setInputsInline (true);
		this.setPreviousStatement (true, null);
		this.setNextStatement (true, null);
		this.setColour (230);
		this.setTooltip ("ロボットを停止させます。");
		this.setHelpUrl ("");
	}
};
Blockly.JavaScript['stop'] = function (block) {
	return "stop ();\n";
};

// ========== 秒数待機 ==========
Blockly.Blocks['wait_s'] = {
	init: function () {
		this.appendDummyInput ()
			.appendField ("待機");
		this.appendValueInput ("time")
			.setCheck ("Number");
		this.appendDummyInput ()
			.appendField ("秒");
		this.setInputsInline (true);
		this.setPreviousStatement (true, null);
		this.setNextStatement (true, null);
		this.setColour (230);
		this.setTooltip ("指定した秒数だけプログラムを止めます。");
		this.setHelpUrl ("");
	}
};
Blockly.JavaScript['wait_s'] = function (block) {
	const time = Blockly.JavaScript.valueToCode (block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
	return "wait_s (" + time + ");\n";
};

// ========== ミリ秒待機 ==========
Blockly.Blocks['wait_ms'] = {
	init: function () {
		this.appendDummyInput ()
			.appendField ("待機");
		this.appendValueInput ("time")
			.setCheck ("Number");
		this.appendDummyInput ()
			.appendField ("ミリ秒");
		this.setInputsInline (true);
		this.setPreviousStatement (true, null);
		this.setNextStatement (true, null);
		this.setColour (230);
		this.setTooltip ("指定したミリ秒数だけプログラムを止めます。");
		this.setHelpUrl ("");
	}
};
Blockly.JavaScript['wait_ms'] = function (block) {
	const time = Blockly.JavaScript.valueToCode (block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
	return "wait_ms (" + time + ");\n";
};

// ========== 射撃 ==========
Blockly.Blocks['shot'] = {
	init: function () {
		this.appendDummyInput ()
			.appendField ("射撃");
		this.appendValueInput ("angle")
			.setCheck ("Number")
			.appendField ("角度");
		this.appendDummyInput ()
			.appendField ("°");
		this.setInputsInline (true);
		this.setPreviousStatement (true, null);
		this.setNextStatement (true, null);
		this.setColour (230);
		this.setTooltip ("弾を発射します。");
		this.setHelpUrl ("");
	}
};
Blockly.JavaScript['shot'] = function (block) {
	const angle = Blockly.JavaScript.valueToCode (block, 'angle', Blockly.JavaScript.ORDER_ATOMIC);
	return "shot (" + angle + ");\n";
};
// ========== スキャン ==========
Blockly.Blocks['scan'] = {
	init: function () {
		this.appendDummyInput ()
			.appendField ("スキャン");
		this.appendValueInput ("angle")
			.setCheck ("Number")
			.appendField ("角度");
		this.appendDummyInput ()
			.appendField ("°");
		this.setInputsInline (true);
		this.setOutput (true, null);
		this.setColour (230);
		this.setTooltip ("敵との距離を0〜100で返します。敵がいないときは-1を返します。");
		this.setHelpUrl ("");
	}
};
Blockly.JavaScript['scan'] = function (block) {
	const angle = Blockly.JavaScript.valueToCode (block, 'angle', Blockly.JavaScript.ORDER_ATOMIC);
	const code = "scan (" + angle + ")";
	return [code, Blockly.JavaScript.ORDER_NONE];
};
