# Global object property 'globalMethodPublisherBus'

simple bus to register and unregister listeners over native methods that dont have on/off or 'listerer' functionality

## Zero mutations on methods

same functioanality, properties and return values

## Use callback to get notification before and after method invocation

create callback 
```js
const my_func = function(message_object){}
```

register callback 
```js
globalMethodPublisherBus.addListener(name_or_path, my_func)
```

handle 'message_object' in callback body 
```js
const {
	message,
	instance,
	timer_id,
	type,
	arguments
	} = message_object
```

now you have info to manipulate by yourself

## bonus in 'before' invocation 'message_object'

you can syncronicly prevent method 
```js
message_object?.prevent && message_object.prevent()
```

naturally may cause errors by return 'undefined' value

## Simple example

add script to HTML 
```HTML
<script src="your.path">
```

register listener on fetch and play with it
```js
const id_to_revoke0 = globalMethodPublisherBus.addListener('fetch', message_object => {
	console.dir(message_object)
})
const id_to_revoke1 = globalMethodPublisherBus.on('fetch', message_object => {
	console.wart(message_object)
})

fetch('google.com').then(e=>e.text()).then(console.log)

// here console outputs

fetch
// returns a Proxy object

globalMethodPublisherBus.off('fetch', id_to_revoke0)

fetch('google.com').then(e=>e.text()).then(console.log)

// only warnings from last listener

globalMethodPublisherBus.removeListener('fetch', id_to_revoke1)

// returns original fetch method

const id_to_revoke2 = globalMethodPublisherBus.addListener('fetch', message_object => {
	console.dir(message_object)
	message_object.prevent()
})

fetch('google.com').then(e=>e.text()).then(console.log)

// only Before object is returnted and then() throw an Error
// if you want use prevent(), just catch errors


fetch('google.com').then(e=>e.text()).then(console.log).catch(console.warn)

//or 
try {
	const res = await fetch('google.com')
	await res.text()
} catch (err) {
	console.warn(err)
}

```

## if properties are nested use dot in navigation
```js
globalMethodPublisherBus.on('navigator.canShare', callback)
```
