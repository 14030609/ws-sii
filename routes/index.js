var express   = require('express');
var router    = express.Router();
var app       = express();
var db        = require('../queries.js');
var basicAuth = require('basic-auth');
var fs        = require('fs');
var  auth= require('http-auth')
var https     = require('https');
var path      = require('path');



/*
var basic = auth.basic({
 realm :"miguel"

}, function (username, password,callback){
callback (username==="root" && password==="root");}
);
*/
https.createServer({
    key: fs.readFileSync('routes/server.key'),
    cert: fs.readFileSync(path.resolve('routes/server.cert'))
}, app).listen(3001, 'localhost');

//const port = 3000;
/*
https.createServer({
    key: fs.readFileSync(path.resolve('routes/server.key')),
    cert: fs.readFileSync('routes/server.cert')
}, router).listen(3000, 'localhost');

*/


var auth = function (req, res, next) {
  var user = basicAuth(req);
  if (!user || !user.name || !user.pass) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    //res.sendStatus(401);
    return;
  }
  if (user.name === 'root' && user.pass === 'root') {
    next();
  } else {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    res.sendStatus(401);
    return;
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('../views/welcome.jade.hmtl', { title: 'Express' });
});

//metodos GET
router.get('/api/login/:username/:password',auth, db.login);
router.get('/api/wsalumnos/getAlumnos/',auth, db.getAlumnos);
router.get('/api/wsalumnos/getAlumnos/:email',auth, db.getAlumno);

router.get('/api/wsmaestros/getMaestros/',auth, db.getMaestros);
router.get('/api/wsmaestros/getMaestros/:email',auth, db.getMaestro);
router.get('/api/wsmaestros/getMaestrosAlumno/:nocont',auth, db.getMaestrosAlumno);

router.get('/api/wsmaterias/getMaterias/',auth, db.getMaterias);
router.get('/api/wsmaterias/getMaterias/:cvemat',auth, db.getMateria);
  
//router.get('/api/wsgrupos/getGrupos/',auth, db.getGrupos);

router.get('/api/wscargaacademica/getCargaAcademica/:nocont',auth, db.getCargaAcademica);

router.get('/api/wscredenciales/getCredenciales/:email',auth, db.getCredenciales);


router.get('/api/wsgrupos/getGrupos/:nocont',auth, db.getGrupo);

router.get('/api/wsgrupos/getGruposAsignados/:cvemae',auth, db.getGruposAsignados);

router.get('/api/wsgrupos/getGrupoAlumnos/:cvemae',auth, db.getGrupoAlumnos);

router.get('/api/wsgrupos/getGrupoAlumnosMaterias/:cvemat/:nogpo',auth, db.getGrupoAlumnosMateria);

router.get('/api/wsaccesos/getAccesos/',auth, db.getAccesos);

//router.get('/api/wsgrupos/getGrupos/:cvemat,nogpo',auth, db.getGrupo);

router.get('/api/wslistas/getListas/',auth, db.getListas);


router.get('/api/wsoportunidades/getOportunidades/',auth, db.getOportunidades);


router.get('/api/wskardex/getKardex/:cvemat/:nocont/:opor',auth, db.getKardex);

router.get('/api/wskardex/getKardex/:nocont',auth, db.getKardexTo);

router.get('/api/wsusuarios/getUsuarios/',auth, db.getUsuarios);

router.get('/api/wsusuarios/getUsuarios/:email/:pass',auth, db.getUsuario);


router.get('/api/wshorario/getHorario/:nocont',auth, db.getHorario);

router.get('/api/wsalumnos/getCalificaciones/:nocont',auth, db.getCalificaciones);

//router.get('/api/wsusuarios/getUsuarios',auth, db.getUsuarios);

//router.get('/api/wsaccesos/getAccesos',auth, db.getAccesos);
/*
router.get('/api/wsmaestro',auth, db.getMaestros);
router.get('/api/wsmaestro/:id',auth, db.getMaestro);

router.get('/api/wscarreras',auth, db.getCarreras);
router.get('/api/wscarrera/:id',auth, db.getCarrera);
*/



//metodos Post
//router.post('/api/wsalumnos/postAlumnos',auth, db.createAlumno);
//router.post('/api/wsusuarios/postUsuario',auth, db.createUsuario);
router.post('/api/wsmaestros/postMaestro',auth, db.createMaestro);

router.post('/api/wsmaterias/postMateria',auth, db.createMateria);

router.post('/api/wsgrupos/postGrupo',auth, db.createGrupo);

router.post('/api/wslistas/postLista/',auth, db.createLista);


//router.post('/api/wskardex/postKardex',auth, db.createKardex);

//metodos Put
router.put('/api/wsusuarios/putUsuarios/:email',auth, db.updateAlumno);

router.put('/api/wslistas/putCalificaciones/:nogpo/:nocont',auth, db.updateCalificaciones);


//Metodos delete
//router.delete('/api/wsalumnos/deleteAlumno:id',auth, db.removeAlumno);

module.exports = router;


//router.get('/api/wsmaestro', db.getMaestros);
//router.get('/api/wsmaestro/:id', db.getMaestro);


//router.get('/api/wscarreras', db.getCarreras);
//router.get('/api/wscarrera/:id', db.getCarrera);


//module.exports = router;
