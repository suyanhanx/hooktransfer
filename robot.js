var https = require('https')

module.exports = function (token) {
    return {
        send: function (message, callback) {
            var postData = JSON.stringify(message)
            var options = {
                hostname: 'oapi.dingtalk.com',
                port: 443,
                path: '/robot/send?access_token=' + token,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            var request = https.request(options, function (response) {
                var data = []
                var count = 0
                response.setEncoding('utf8')

                response.on('data', function (chunk) {
                    data.push(chunk)
                    count += chunk.length
                });

                response.on('end', function () {
                    var buffer
                    var length = data.length

                    if (length == 0) {
                        buffer = new Buffer(0)
                    } else if (length == 1) {
                        buffer = data[0]
                    } else {
                        buffer = new Buffer(count)
                        for (var index = 0, position = 0; index < length; index++) {
                            var chunk = data[index]
                            chunk.copy(buffer, position)
                            position += chunk.length
                        }
                    }

                    var datastring = buffer.toString()
                    var result = JSON.parse(datastring)
                    if (result.errcode) {
                        return callback(new Error(result.errmsg))
                    }

                    return callback(null, result)
                })
            })
            request.on('error', callback)

            request.write(postData)
            request.end()
        }
    }
}
