function create(){
	PouchDB = PouchDB.defaults({
		url: 'ws://192.168.0.44:8008'
	});
	window.db = new PouchDB('test1');
	window.db2 = new PouchDB('test2');
	window.cdb = new PouchDB('http://192.168.0.44:5984/test1');
	window.rdb = new PouchDB('test2', {
		adapter: 'socket',
		reconnectOptions: {
			timeout: 365 * 24 * 60 * 60 * 1000
		}
	});
	console.log('created')
};

function start(){
	

	rdb.info().then(function(info){
		console.log(info)
	}).catch(function(err){
		console.log('error', err)
	});
	
	cdb.info().then(function(info){
		console.log(info)
	}).catch(function(err){
		console.log('errorc', err)
	});
	
}

function replicate10(){
	
	db2.replicate.from(rdb, {
		live: true, retry: true
	}).on('change', function (info) {
		  console.log('chnage10', info)
	}).on('paused', function (err) {
		 console.log('paused10', err)
	}).on('active', function () {
		 console.log('active10')
	}).on('denied', function (err) {
		 console.log('denied10', err)
	}).on('complete', function (info) {
		 console.log('complete10', info)
	}).on('error', function (err) {
		 console.log('error10', err)
	}).then(function(info){
		console.log('then10', info)
	}).catch(function(info){
		console.log('catch10', info)
	})
	
}

function replicate(){
//	db.replicate.to(cdb, {
////		live: true, retry: true
//	}).on('change', function (info) {
//		  console.log('chnage', info)
//	}).on('paused', function (err) {
//		 console.log('paused', err)
//	}).on('active', function () {
//		 console.log('active')
//	}).on('denied', function (err) {
//		 console.log('denied', err)
//	}).on('complete', function (info) {
//		 console.log('complete', info)
//	}).on('error', function (err) {
//		 console.log('error', err)
//	}).then(function(info){
//		console.log('then', info)
//	}).catch(function(info){
//		console.log('catch', info)
//	})
//	return;
	

	
	db2.replicate.to(rdb, {
//			live: true, retry: true,
		}).on('change', function (info) {
			  console.log('chnage1', info)
		}).on('paused', function (err) {
			 console.log('paused1', err)
		}).on('active', function () {
			 console.log('active1')
		}).on('denied', function (err) {
			 console.log('denied1', err)
		}).on('complete', function (info) {
			 console.log('complete1', info)
		}).on('error', function (err) {
			 console.log('error1', err)
		}).then(function(info){
			console.log('then1', info)
		}).catch(function(info){
			console.log('catch1', info)
		})

}