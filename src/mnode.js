'use strict'

let MQTT = require('mqtt')
let os = require('os')

function random () {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

const GET_NODE_NAME = 'GET_NODE_NAME'

class MNode {
    constructor (args) {
        this.client = MQTT.connect(args.connection)
        this.realm = args.realm
        this.id = args.id
        this.node = args.node !== undefined ? args.node : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        this.qos = args.qos == undefined ? 2 : args.qos
        this.on(this._routeFor(GET_NODE_NAME), function (response) {
            return this.node
        }.bind(this))
    }

    destroy () {
        this.client.end()
    }

    get (callback) {
        this.send(this._routeFor(GET_NODE_NAME), {}, '*', function (response) {
            callback(response)
        })
    }

    on (route, callback) {
        if (this.client.connected === false) {
            this.client.on('connect', function () {
                this._on(route, callback)
            }.bind(this))
        } else {
            this._on(route, callback)    
        }        
    }

    send (route, data, node, callback) {
        if (this.client.connected === false) {
            this.client.on('connect', function () {
                this._send(route, data, node, callback)
            }.bind(this))
        } else {
            this._send(route, data, node, callback)    
        }
    }

    _send (route, data, node, callback) {
        if (node === '*') {
            if (callback === undefined) {
                this._sendNoRecv(route, data, null)
            } else {
                this._sendRecv(route, data, callback, null)
            }
        } else {
            if (callback === undefined) {
                this._sendNoRecv(route, data, node)
            } else {
                this._sendRecv(route, data, callback, node)
            }
        }
    }

    _sendNoRecv (route, data, node = null) {
        let _route = this._routeFor(route)
        this.client.publish(_route, this._encode(data, node), {qos: this.qos})
    }

    _sendRecv (route, data, callback, node = null) {
        let dataToSend = this._encode(data, node, true)
        let reqid = JSON.parse(dataToSend)
        this.on(route + '/' + reqid.reqId, function (rexdata) {
            this.client.unsubscribe(this._routeFor(route + '/' + reqid.reqId))
            callback(JSON.parse(rexdata).data)
        }.bind(this))
        setTimeout(function () {
            this.client.publish(this._routeFor(route), dataToSend, {qos: this.qos})
        }.bind(this), 100)
    }

    _on (route, callback) {
        let srf = this._routeFor(route)
        this.client.subscribe(srf, function (err) {
            this.client.on('message', function (mexroute, message) {
                let mex = JSON.parse(message)
                let isRoute = this._isRoute(srf, mexroute, mex )
                if (isRoute === true) {
                    let res = callback(message)
                    if (res != undefined && mex.recv === true) {
                        this._sendNoRecv(route + '/' + mex.reqId, res, mex.reqNode)
                    }
                }
            }.bind(this))
        }.bind(this))
    }

    _routeFor (route) {
        let rf = this.realm + '/' + this.id + '/' + route
        return rf
    }

    _isRoute (route, mexroute, message) {
        if (route === mexroute && message.node === this.node) {
            return true
        } else if (route === mexroute && message.node === null) {
            return true
        } else {
            return false
        }
    }

    _encode (data, node, recv = false) {
        return JSON.stringify ({
            reqId: random(),
            reqNode: this.node,
            data: typeof data === 'string' ? data : data,
            node: node, 
            recv: recv
        })
    }
}

module.exports = MNode
