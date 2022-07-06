# timeoutListenerBus 
simle bus with one method, uses callback for notifications about timeouts 

create callback ```js
const my_func = function(){}```

register callback ```js
timerBus.addListener(my_func)```

now you have info about timeout to manipulate it and its data

