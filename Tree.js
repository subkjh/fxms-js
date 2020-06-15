/**
 * ************************************************************************************************
 * Tree
 * 
 * @param myCanvas
 * @returns
 */
function Tree(myCanvas) {

	this.myCanvas = (myCanvas == undefined ? null : myCanvas);
	this.dataMap = new Map();
	this.rootList = [];
	this.allList = [];

}

/**
 * 특정 문자열 반복한다.
 */
Tree.repeat = function(count, ch) {
	var ret = "";
	for (var i = 0; i < count; i++) {
		ret += ch;
	}
	return ret;
}

Tree.prototype.printVar = function() {
	console.log(this.myCanvas, this.dataMap, this.rootList, this.allList);
}

/**
 * 트리 항목을 추가한다.
 * 
 * @param parentId
 *            상위ID
 * @param childId
 *            하위ID
 * @param data
 *            하위데이터
 * 
 */
Tree.prototype.addItem = function(parentId, childId, data) {

	var child = new TreeItem(childId, data);
	var parent = this.getData(parentId);

	if (parent != null) {
		parent.addChild(child);
	} else {
		this.rootList.push(child);
	}

	this.allList.push(child);
	this.dataMap.set(childId, child);
}

Tree.test = function(tree) {

	tree.addItem(null, "100", "100");
	tree.addItem("100", "110", "110");
	tree.addItem("100", "120", "120");
	tree.addItem("120", "121", "121");

	tree.addItem(null, "200", "200");
	tree.addItem(null, "300", "300");
	tree.addItem("300", "310", "310");
	tree.addItem("300", "320", "320");
	tree.addItem("320", "321", "321");
	tree.addItem(null, "400", "400");

	var parent = 400;
	for (var i = parent + 1; i <= 405; i++) {
		tree.addItem(parent + "", i + "", i + "");
		parent = i;
	}

	tree.addItem("320", "322", "322");
	tree.addItem("320", "323", "323");
	tree.addItem("320", "324", "324");

	var maker = new XYDateMaker(100, 100, 80, 30, tree);
	var list = maker.make(XYDateMaker.TOP_REL, XYDateMaker.FIRST_LOWER);
	tree.getXYPrint(list);

}

Tree.test2 = function(tree) {

	tree.addItem(null, "AR1", "AR1");
	tree.addItem(null, "AR2", "AR2");
	tree.addItem("AR1", "CMTS#1", "CMTS#1");
	tree.addItem("AR1", "CMTS#2", "CMTS#2");
	tree.addItem("AR2", "CMTS#3", "CMTS#3");
	tree.addItem("AR2", "CMTS#4", "CMTS#4");

	tree.addItem("CMTS#1", "CELL", "CELL");
	tree.addItem("CELL", "CM#1", "CM#1");
	tree.addItem("CELL", "CM#2", "CM#2");
	tree.addItem("CELL", "CM#3", "CM#3");
	tree.addItem("CELL", "CM#4", "CM#4");
	tree.addItem("CELL", "CM#5", "CM#5");
	tree.addItem("CELL", "CM#6", "CM#6");

	tree.addItem("CM#3", "AP#31", "AP#31");
	tree.addItem("CM#3", "AP#32", "AP#32");
	tree.addItem("CM#3", "AP#33", "AP#33");
	tree.addItem("CM#3", "AP#34", "AP#34");

	tree.addItem("CM#5", "AP#51", "AP#51");
	tree.addItem("CM#5", "AP#52", "AP#52");

	tree.addItem("AP#32", "STB#1", "STB#1");
	tree.addItem("AP#32", "STB#2", "STB#2");

	tree.addItem("AP#34", "STB#3", "STB#3");
	tree.addItem("AP#34", "STB#4", "STB#4");

	var maker = new XYDateMaker(100, 100, 80, 30, tree);
	var list = maker.make(XYDateMaker.TOP_REL, XYDateMaker.FIRST_LOWER);
	tree.getXYPrint(list);

}

Tree.prototype.fillChildren = function(data, list) {
	if (data.getChildren() != null) {
		for (var i = 0; i < data.getChildren().size(); i++) {
			list.push(data.getChildren()[i]);
			this.fillChildren(o, list);
		}
	}
}

Tree.prototype.getChildAll = function(data) {
	var list = [];
	this.fillChildren(data, list);
	return list;
}

Tree.prototype.getDataList2Level = function(level) {
	var retList = [];
	var data;

	for (var i = 0; i < this.allList.length; i++) {
		data = this.allList[i];
		if (data.getLevel() == level) {
			retList.push(data.getData());
		}
	}
	return retList;
}

Tree.prototype.getData = function(id) {
	return this.dataMap.get(id);
}

Tree.prototype.getTreeAll = function() {
	return this.getTreeString("", this.rootList);
}

Tree.prototype.getTreeString = function(prefix, dataList) {

	if (dataList == null) {
		return "";
	}

	var ret = "";
	var data;
	for (var i = 0; i < dataList.length; i++) {
		data = dataList[i];
		ret = ret + prefix + data;
		if (data.getChildren() != null) {
			ret += this.getTreeString("...", data.getChildren());
		}
		ret += "\n";
	}

	return ret;

}

Tree.prototype.getXYPrint = function(list) {

	var data;

	if (this.myCanvas != null) {
		var c = document.getElementById(this.myCanvas);
		for (var i = 0; i < list.length; i++) {
			data = list[i];
			var ctx = c.getContext("2d");
			ctx.font = "12px 맑은고딕";
			ctx.fillText(data.data, data.x, data.y);
		}
	}

	list.sort(function(o1, o2) {
		if (o1.y == o2.y) {
			return o1.x - o2.x;
		}
		return o1.y - o2.y;
	});

	var ret = "";
	var dataPrev = null;

	for (var i = 0; i < list.length; i++) {
		data = list[i];

		if (dataPrev != null) {
			if (data.y != dataPrev.y) {
				ret += "-----------------------------------------------------------\n";
			}
		}

		ret += Tree.repeat(data.x, " ");
		ret += data;
		ret += "\n";

		dataPrev = data;
	}

	return ret;

}

/**
 * ************************************************************************************************
 * TreeItem
 * 
 * @param treeId
 * @param data
 * @returns
 */

function TreeItem(treeId, data) {
	this.treeId = treeId;
	this.data = data;
	this.children = [];
	this.parent = null;
	this.level = 0;
}

TreeItem.prototype.getTreeId = function() {
	return this.treeId;
}

TreeItem.prototype.getData = function() {
	return this.data;
}

TreeItem.prototype.addChild = function(child) {

	if (child != null) {
		this.children.push(child);
		child.level = this.level + 1;
		child.parent = this;
	}

}

TreeItem.prototype.getLevel = function() {
	return this.level;
}

TreeItem.prototype.getParent = function() {
	return this.parent;
}

TreeItem.prototype.getChildCount = function() {
	return this.children == null ? 0 : this.children.size();
}

TreeItem.prototype.getChildren = function() {
	return this.children;
}

TreeItem.prototype.toString = function() {
	return this.level + ")" + this.treeId;
}

/**
 * ************************************************************************************************
 * XYData
 * 
 * @param x
 * @param y
 * @param data
 * @returns
 */

function XYData(x, y, data) {
	this.x = x;
	this.y = y;
	this.data = data;
}

XYData.prototype.toString = function() {
	return "(" + this.x + "," + this.y + ")" + this.data;
}

XYData.prototype.getX = function() {
	return this.x;
}

XYData.prototype.getY = function() {
	return this.y;
}

XYData.prototype.getDate = function() {
	return this.data;
}

/**
 * ************************************************************************************************
 * XYDataMaker
 * 
 * @param baseX
 * @param baseY
 * @param gapX
 * @param gapY
 * @param tree
 * @returns
 */
function XYDateMaker(baseX, baseY, gapX, gapY, tree) {
	this.baseX = baseX;
	this.baseY = baseY;
	this.gapX = gapX;
	this.gapY = gapY;
	this.tree = tree;
	this.nextYMap = new Map();
}

XYDateMaker.TOP_SEQ = 1; // 각 depth별 순차적으로
XYDateMaker.TOP_REL = 2; // 상위 Y에서 시작
XYDateMaker.FIRST_UPPER = 1; // 상위가 앞으로
XYDateMaker.FIRST_LOWER = 2; // 하위가 앞으로

/**
 * XY 좌표를 설정한다.
 */
XYDateMaker.prototype.make = function(type, firstCd) {

	if (firstCd == XYDateMaker.FIRST_LOWER) {
		this.gapX *= -1;
	}

	var list;
	if (type == XYDateMaker.TOP_REL) {
		list = this.makeRel();
	} else {
		list = this.makeSeq();
	}

	this.setTopXy(list);
	return list;
}

/**
 * 각 depth별 순차적으로 X,Y를 설정한다.
 */
XYDateMaker.prototype.makeSeq = function() {

	var retList = [];
	var count = 0;
	var list = this.tree.rootList;

	for (var i = 0; i < list.length; i++) {
		this.makeXyData(this.baseX, list[i], retList);
	}

	return retList;
}

XYDateMaker.prototype.getIndexY = function(level) {
	var indexY = this.nextYMap.get(level);

	if (indexY == null) {
		indexY = 0;
	} else {
		indexY++;
	}
	this.nextYMap.set(level, indexY);
	return indexY;
}

XYDateMaker.prototype.makeXyData = function(baseX, parent, list) {

	var count;
	var child;
	var indexY = this.getIndexY(parent.getLevel());
	var data = new XYData(baseX + this.gapX, this.baseY + (this.gapY * indexY),
			parent.getData());
	var childCount;

	list.push(data);

	if (parent.getChildren() != null) {
		for (var i = 0; i < parent.getChildren().length; i++) {
			child = parent.getChildren()[i];
			this.makeXyData(baseX + this.gapX, child, list);
		}
	}

}

/**
 * 상위 바로 옆으로 하위를 배치한다.
 */
XYDateMaker.prototype.makeRel = function() {

	var retList = [];
	var count = 0;
	var nextY = this.baseY;
	var data;

	for (var i = 0; i < tree.rootList.length; i++) {

		data = tree.rootList[i];

		// 띄워서 그리기
		count = this.makeXyDataRel(this.baseX, nextY, this.gapX, this.gapY,
				data, retList);

		if (count > 1) {
			nextY += (this.gapY * count);
		} else {
			nextY += this.gapY;
		}

	}

	return retList;
}

XYDateMaker.prototype.makeXyDataRel = function(baseX, baseY, gapX, gapY,
		parent, list) {

	var count;
	var child;
	var data = new XYData(baseX + gapX, baseY + gapY, parent.getData());
	var indexY = 0;

	list.push(data);

	if (parent.getChildren() != null) {
		var childCount;
		for (var i = 0; i < parent.getChildren().length; i++) {
			child = parent.getChildren()[i];
			childCount = this.makeXyDataRel(baseX + gapX, baseY
					+ (gapY * indexY), gapX, gapY, child, list);

			if (childCount <= 1) {
				indexY++;
			} else {
				indexY += childCount;
			}

		}
	}

	return indexY;
}

XYDateMaker.prototype.setTopXy = function(list) {
	var minX = 10000;
	var minY = 10000;
	var addX = 0;
	var addY = 0;

	for (var i = 0; i < list.length; i++) {
		if (minX > list[i].x) {
			minX = list[i].x;
		}
		if (minY > list[i].y) {
			minY = list[i].y;
		}
	}

	addX = this.baseX - minX;
	addY = this.baseY - minY;
	for (var i = 0; i < list.length; i++) {
		list[i].x += addX;
		list[i].y += addY;
	}
}
