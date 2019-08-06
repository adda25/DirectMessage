let MNode = require('../src/mnode')

let s1 = new MNode({
	realm: 'yourAppDomain',
	id: 'yourAppSubdomain',
	connection: {
		host: '85.119.83.194', 
		port: '1883'
	},
	node: process.argv[2] || 's2'
})

s1.on('toall', function (data) {
	console.log(JSON.parse(data).data)
	return 'ok from ' + process.argv[2]
})
