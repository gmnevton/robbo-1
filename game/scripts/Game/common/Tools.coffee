﻿window.app = window.app ? {}
app = window.app

Array.prototype.where = (predicat) ->
	item for item in this when predicat(item)		

Array.prototype.single = (predicat) ->
	items = []
	items.push item for item in this when predicat(item)

	return items[0] unless items.length isnt 1

	return null if items.length is 0

	throw "Many items for given predicat"

Array.prototype.top = (n)-> this.slice(0,n)

Array.prototype.any = (predicat) ->
	if predicat?
		items = []
		items.push item for item in this when predicat(item)

		return items.length>0

	return this.length>0

Array.prototype.contains = (obj)->
	for item in this
		if item == obj
			return true
	false
Array.prototype.first = () ->
	this[0]

Array.prototype.select = (selector) ->
	ret = []
	for item in this
		ret.push selector(item)
	ret
	
Array.prototype.last = () ->
	this[this.length-1]


app.Tools ={}
app.Tools.getRand=(x,y) ->		
		for i in [0..113]
			Math.random()
		Math.floor((Math.random()*(y+1))+x)

app.Tools.getGaussRand = (a,b, stdev)->
	res = Math.round(app.Tools.rnd_snd()*stdev+((a+b)/2))
	if res>b then res = b
	if res<a then res = a
	res

app.Tools.rnd_snd = () ->
	return (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1);
