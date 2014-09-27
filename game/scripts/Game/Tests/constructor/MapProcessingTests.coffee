window.app = window.app ? {}
app = window.app

module('MapProcessing')

test "getTeleportNums returns correct list of portal numbers", () ->
	cutMap = new app.MapStruct """
	T10_.._.._.._.._.._..
	_.._.._.._.._.._.._..
	_.._.._.._.._.._.._..
	_.._.._..T21_.._.._..
	_..T38_.._.._.._.._..
	"""
	mapProcessing = new app.MapProcessing()
	nums = mapProcessing.getTeleportNums(cutMap)

	equal nums.length,3

test "getTeleportNums returns correct list of portal numbers when multiple teleports with same number", () ->
	cutMap = new app.MapStruct """
	T10_.._.._.._.._.._..
	_.._.._.._.._.._.._..
	_.._.._.._.._.._.._..
	_.._.._..T11_.._.._..
	_..T38_.._.._.._.._..
	"""
	mapProcessing = new app.MapProcessing()
	nums = mapProcessing.getTeleportNums(cutMap)

	equal nums.length,2

test "initTeleportNetwork sets seq numbers correctly for each teleport number",()->
	map = """
	T10_.._.._.._.._.._.._.._.._..
	_.._.._.._.._.._.._.._..T31_..
	_.._.._.._.._.._.._.._.._.._..
	_.._.._..T10_.._.._.._.._.._..
	_..T38_.._.._.._.._.._.._..T25
	"""
	mapProcessing = new app.MapProcessing()
	newMap = mapProcessing.initTeleportNetwork(map)

	console.log newMap
	equal true,newMap.indexOf("T10")>=0,"Contains T10"
	equal true,newMap.indexOf("T11")>=0,"Contains T11"
	equal true,newMap.indexOf("T30")>=0,"Contains T30"
	equal true,newMap.indexOf("T31")>=0,"Contains T31"
	equal true,newMap.indexOf("T20")>=0,"Contains T20"


