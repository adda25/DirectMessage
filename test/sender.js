let MNode = require('../src/mnode')

/**
*	Create a node
*/
let s1 = new MNode({
	realm: 'yourAppDomain',
	id: 'yourAppSubdomain',
	connection: {
		host: '85.119.83.194',
		port: '1883'
	},
	node: 'testclient'
})

setTimeout(function () {

	/**
	*	Example payload
	*/
	let data = {data: 'hello MexEasy'}
	
	/**
	*	Get a list of all the nodes with realm and id
	*/
	let nodes = []
	s1.get(function (node) {
		nodes.push(node)
	})
	setTimeout(function () {
		console.log(nodes)
	}, 500)

	/**
	*	Send to all nodes with the same realm and id,
	*	without response
	*/
	s1.send('toall', data, '*')
	
	/**
	*	Send to all nodes, and receive the response 
	*/
	s1.send('toall', data, '*', function (response) {
		console.log('response', response)
	})
	
	/**
	*	Send to node s2,
	*	without response
	*/
	s1.send('toall', data, 's2')
	
	/**
	*	Send to node s2, and receive the response 
	*/
	s1.send('toall', data, 's2', function (response) {
		console.log('response', response)
	})

}, 1)