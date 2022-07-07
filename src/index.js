(function globalMethodPublisher () {

	function globalMethodPublisherBus () {

		const CONSUMERS = new Map()
		const INSTANCES = new Map()
		const PROXIES = new Map()

		let ID = 0

		function off () {
		  return removeListener.apply(this, arguments)
		}

		function on () {
		  return addListener.apply(this, arguments)
		}

		function removeListener (instance_name, consumer_id) {
			try{
				const consumers_by_instance = CONSUMERS.get(instance_name)
				consumers_by_instance.delete(consumer_id)

				if (consumers_by_instance.size === 0) {
					PROXIES.delete(instance_name)
					setInstance(instance_name, INSTANCES.get(instance_name))
					INSTANCES.delete(instance_name)
					CONSUMERS.delete(instance_name)
				}

			  return true
			} catch (e) {
				console.dir(e)
				return false
			}
		}

		function addListener (name, callback) {

		  const instance = getInstance(name)
		  if (!instance) throw new TypeError('Not an instanse')

		  const instance_name = name
			if (!INSTANCES.has(instance_name)) {
			  INSTANCES.set(instance_name, instance)
			    
			  const proxy = buildProxy(instance)

			  PROXIES.set(instance_name, proxy)
			}
		  setConsumer(instance_name, callback)
		  setInstance(instance_name, PROXIES.get(instance_name))

		  return ID ++
		}

		function setInstance (name, new_instance) {
			const name_array = name.split('.')
			const instance_parent_name = name_array.slice(0,-1).join('.')
			const only_instance_name = name_array.slice(-1)[0]
			parent_instance = getInstance(instance_parent_name)
			parent_instance[only_instance_name] = new_instance
		}

		function getInstance (name) {
			let item = globalThis
			return item[name] ? item[name] : !name.split('.')
		  	.forEach( e => item = item[e]) && item
		}

		function setConsumer (instance_name, callback) {
			const set_of_consumers = CONSUMERS.get(instance_name)

			set_of_consumers ?
				set_of_consumers.set(ID, callback) :
				CONSUMERS.set(instance_name, new Map().set(ID, callback))
		}

		// function getInstanceName (instance, name) {
		// 	return instance.name || name
		// }

		function buildProxy (instance) {
		 return new Proxy(instance, { apply })
		}

		function apply (target, thisArg, argumentsList) {
			const target_name = target.name
			const instance_consumers = CONSUMERS.get(target_name)

			let prevent = false

			const eventObject = {
		    message: `Before ${target_name} call` ,
		    instance: INSTANCES.get(target_name),
		    name: target_name,
		    arguments: argumentsList,
		    type: 'before',
		    prevent() {
		    	prevent = true
		    }
		  }
		  console.dir(instance_consumers)
		  instance_consumers.forEach( callback => callback(eventObject) )

		  if (!prevent) {

			  const instance_return = target.apply(thisArg, argumentsList)
			  const eventData = { ...eventObject, message: `After ${target_name} call`, type: 'after', }
			  delete eventData.prevent

			  instance_consumers.forEach( callback => callback(eventData) )

			  return instance_return
		  }
		}

		return {
			on,
			addListener,
			off,
			removeListener,
		}
	}

	globalThis.globalMethodPublisherBus = globalThis.globalMethodPublisherBus || globalMethodPublisherBus()
})()
