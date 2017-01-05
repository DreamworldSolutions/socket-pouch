function create(){
	PouchDB = PouchDB.defaults({
		url: 'ws://192.168.0.51:8008'
	});
	window.db = new PouchDB('test1-pradip');
	window.db2 = new PouchDB('test2-pradip');
	window.rdb = new PouchDB('http://192.168.0.51:5984/test2-pradip');
	window.rdb = new PouchDB('test2-pradip', {
		adapter: 'socket',
		reconnectOptions: {
			timeout: 365 * 24 * 60 * 60 * 1000
		}
	});
	console.log('created')
};

function addDocs(){
	var ddoc = {
	_id: '_design/index',
	views: {
		name: {
			map: (function(doc){
				if(doc.type === 'CONTACT'){
					emit(doc.name);
				}
			}).toString()
		}
	  },
	  filters: {
		    ddoc: (function(doc){
		    	return doc._id === '_design/index';
		    }).toString(),
		    "age": "function (doc, req) {\n\t    \t   function generateKey(doc){  if(  doc.type === 'CONTACT' ){ return [doc.name, doc.age]; } };\n\t    \t   \n\t    \t   function isFilterPassed(dockey, startkey, endkey){\n\t\n\t           if(endkey === undefined){\n\t              return collate(startkey, dockey) <= 0;\n\t           }\n\t\n\t           return collate(startkey, dockey) <= 0 && collate(endkey, dockey) >= 0;\n\t         }\n\t         \n\t    \t   function collate(a, b) {\n\t\n\t    \t\t   if (a === b) {\n\t    \t\t     return 0;\n\t    \t\t   }\n\t\n\t    \t\t   a = normalizeKey(a);\n\t    \t\t   b = normalizeKey(b);\n\t\n\t    \t\t   var ai = collationIndex(a);\n\t    \t\t   var bi = collationIndex(b);\n\t    \t\t   if ((ai - bi) !== 0) {\n\t    \t\t     return ai - bi;\n\t    \t\t   }\n\t    \t\t   if (a === null) {\n\t    \t\t     return 0;\n\t    \t\t   }\n\t    \t\t   switch (typeof a) {\n\t    \t\t     case 'number':\n\t    \t\t       return a - b;\n\t    \t\t     case 'boolean':\n\t    \t\t       return a === b ? 0 : (a < b ? -1 : 1);\n\t    \t\t     case 'string':\n\t    \t\t       return stringCollate(a, b);\n\t    \t\t   }\n\t    \t\t   return Array.isArray(a) ? arrayCollate(a, b) : objectCollate(a, b);\n\t    \t\t }\n\t\n\t\n\t    \t\t function normalizeKey(key) {\n\t    \t\t   switch (typeof key) {\n\t    \t\t     case 'undefined':\n\t    \t\t       return null;\n\t    \t\t     case 'number':\n\t    \t\t       if (key === Infinity || key === -Infinity || isNaN(key)) {\n\t    \t\t         return null;\n\t    \t\t       }\n\t    \t\t       return key;\n\t    \t\t     case 'object':\n\t    \t\t       var origKey = key;\n\t    \t\t       if (Array.isArray(key)) {\n\t    \t\t         var len = key.length;\n\t    \t\t         key = new Array(len);\n\t    \t\t         for (var i = 0; i < len; i++) {\n\t    \t\t           key[i] = normalizeKey(origKey[i]);\n\t    \t\t         }\n\t    \t\t      \n\t    \t\t       } else if (key instanceof Date) {\n\t    \t\t         return key.toJSON();\n\t    \t\t       } else if (key !== null) { \n\t    \t\t         key = {};\n\t    \t\t         for (var k in origKey) {\n\t    \t\t           if (origKey.hasOwnProperty(k)) {\n\t    \t\t             var val = origKey[k];\n\t    \t\t             if (typeof val !== 'undefined') {\n\t    \t\t               key[k] = normalizeKey(val);\n\t    \t\t             }\n\t    \t\t           }\n\t    \t\t         }\n\t    \t\t       }\n\t    \t\t   }\n\t    \t\t   return key;\n\t    \t\t }\n\t\n\t    \t\t function arrayCollate(a, b) {\n\t    \t\t   var len = Math.min(a.length, b.length);\n\t    \t\t   for (var i = 0; i < len; i++) {\n\t    \t\t     var sort = collate(a[i], b[i]);\n\t    \t\t     if (sort !== 0) {\n\t    \t\t       return sort;\n\t    \t\t     }\n\t    \t\t   }\n\t    \t\t   return (a.length === b.length) ? 0 :\n\t    \t\t     (a.length > b.length) ? 1 : -1;\n\t    \t\t }\n\t    \t\t function stringCollate(a, b) {\n\t\n\t    \t\t   return (a === b) ? 0 : ((a > b) ? 1 : -1);\n\t    \t\t }\n\t    \t\t function objectCollate(a, b) {\n\t    \t\t   var ak = Object.keys(a), bk = Object.keys(b);\n\t    \t\t   var len = Math.min(ak.length, bk.length);\n\t    \t\t   for (var i = 0; i < len; i++) {\n\t\n\t    \t\t     var sort = collate(ak[i], bk[i]);\n\t    \t\t     if (sort !== 0) {\n\t    \t\t       return sort;\n\t    \t\t     }\n\t    \t\t     sort = collate(a[ak[i]], b[bk[i]]);\n\t    \t\t     if (sort !== 0) {\n\t    \t\t       return sort;\n\t    \t\t     }\n\t\n\t    \t\t   }\n\t    \t\t   return (ak.length === bk.length) ? 0 :\n\t    \t\t     (ak.length > bk.length) ? 1 : -1;\n\t    \t\t }\n\t\n\t    \t\t function collationIndex(x) {\n\t    \t\t   var id = ['boolean', 'number', 'string', 'object'];\n\t    \t\t   var idx = id.indexOf(typeof x);\n\t    \t\t  \n\t    \t\t   if (~idx) {\n\t    \t\t     if (x === null) {\n\t    \t\t       return 1;\n\t    \t\t     }\n\t    \t\t     if (Array.isArray(x)) {\n\t    \t\t       return 5;\n\t    \t\t     }\n\t    \t\t     return idx < 3 ? (idx + 2) : (idx + 3);\n\t    \t\t   }\n\t\n\t    \t\t   if (Array.isArray(x)) {\n\t    \t\t     return 5;\n\t    \t\t   }\n\t    \t\t }\n\t\n\t    \t\t var query = req.query || {};\n\t    \t\t var key = generateKey(doc);\n\t    \t\t if(!key){\n\t    \t\t\t return false;\n\t    \t\t }\n\t    \t\t return isFilterPassed(key, query.startkey, query.endkey);\n\t\n\t       }",
			name_filter: (function(doc, req){
				if(doc.type === 'CONTACT'){
					return true;
				}
				return false;
			}).toString()
		}
	};
	db2.get(ddoc._id).then(function(doc){
		ddoc._rev = doc._rev;
		db2.put(ddoc).then(function(){
			db2.replicate.to(rdb, { doc_ids: ['_design/index']});
		})
	}).catch(function(){
		db2.put(ddoc).then(function(){
			db2.replicate.to(rdb, { doc_ids: ['_design/index']});
		});
	});
}
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