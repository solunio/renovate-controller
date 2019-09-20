module.exports = [{
    context: [
        '/api/**/*'
    ],
    target: 'http://localhost:3000',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true
},{
    context: [
        '/socket.io*'
    ],
    target: 'ws://localhost:3000',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    ws: true
}];
