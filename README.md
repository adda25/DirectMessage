# MexEasy

This package simplifies communications between microservices,
applications or servers, based on MQTT protocol.

Usage examples are under the *test* folder.

## Examplanation

The basic unit is a MNode.
Every unit has a *realm* and an *id*.

The combination of realm and id form the main MQTT topic.
Each unit has also a string identifier, random generated if not specified.

In the following examples, the resulting MQTT topic will be:
* yourAppDomain/yourAppSubdomain/toall *



## Usage example
 
Note: 85.119.83.194 is the IP address of test.mosquitto.org

Sender

```js
let MNode = require('mexeasy')

/**
*   Create a node
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

/**
*   Example payload
*/
let data = {data: 'hello MexEasy'}

/**
*   Send to all nodes with the same realm and id,
*   without response
*/
s1.send('toall', data, '*')

/**
*   Send to all nodes, and receive the response 
*/
s1.send('toall', data, '*', function (response) {
    console.log('response', response)
})

/**
*   Send to node s2,
*   without response
*/
s1.send('toall', data, 's2')

/**
*   Send to node s2, and receive the response 
*/
s1.send('toall', data, 's2', function (response) {
    console.log('response', response)
})

```


Receiver

```js
let MNode = require('mexeasy')

/**
*   Create a node
*/
let s1 = new MNode({
    realm: 'yourAppDomain',
    id: 'yourAppSubdomain',
    connection: {
        host: '85.119.83.194', 
        port: '1883'
    },
    node: 's2'
})

/**
*   Listen on 'toall'
*/
s1.on('toall', function (data) {
    console.log(JSON.parse(data).data)
    return 'ok from ' + process.argv[2] // this will be send back as data, if required by the sender
})

```

## Methods

```js
/**
*   new
*
*   args = {
*       realm: String,
*       id: String,
*       node: String, [OPT]
*       qos: Int [OPT]
*       connection: {
*           host: String,
*           port: String, 
*           username: String, [OPT]
*           password: String  [OPT]
*       }
*   }
*/
constructor (args)

/**
*   on
*   
*   route: String
*   callback: Function
*/
on (route, callback)

/**
*   get
*   
*   callback: Function
*/
get (callback)

/**
*   send
*   
*   route: String
*   data: Object or String
*   node: String [ '*' means all nodes] 
*   callback: Function [OPT]
*/
send (route, data, node, callback)

/**
*   destroy
*   
*/
destroy ()
```



