(function (){
    const consumers = []
    const bus = window.timerBus = window.timerBus || {
        addListener: function (callback) {
            consumers.push(callback)
        }
    };
        
    [window.setTimeout, window.setInterval]
        .forEach( timer => {
        window[timer.name] = function() {
            const id = timer(...arguments)
            consumers.forEach( callback => callback({
                message: `Timer ${timer.name} registred`,
                instance: window[timer.name],
                timer_id: id,
                type: timer.name,
                arguments: [...arguments],
            }) )
        }
    })
})()

