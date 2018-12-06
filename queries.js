var promise = require('bluebird');
var md5     = require('md5');

var options = {
  promiseLib: promise
};

//connection
var pgp           = require('pg-promise')(options);
var connectionDb  = 'postgres://postgres:1234@localhost:5432/SII';
var db            = pgp(connectionDb);

module.exports = {
  login:          login,
  getAlumnos:    getAlumnos,
  getAlumno:    getAlumno,
  getMaestros: getMaestros,
  getMaestro : getMaestro,
  createMaestro: createMaestro,
  getMaterias : getMaterias,
  getMateria : getMateria,
  createMateria: createMateria,
  getGrupos: getGrupos,
  getGrupo: getGrupo,
  createGrupo: createGrupo,
  getListas: getListas,
  createLista :createLista,
  getOportunidades: getOportunidades,
  getKardex: getKardex,
  getAccesos: getAccesos,
  getUsuarios: getUsuarios,
  getUsuario: getUsuario,
  getHorario: getHorario,
  getCargaAcademica: getCargaAcademica,
  getKardexTo: getKardexTo,
  updateAlumno: updateAlumno,
  getCalificaciones: getCalificaciones,
  getGruposAsignados: getGruposAsignados,
  getGrupoAlumnos: getGrupoAlumnos,
  getGrupoAlumnosMateria: getGrupoAlumnosMateria,
  getMaestrosAlumno: getMaestrosAlumno,
  updateCalificaciones: updateCalificaciones,
  getCredenciales: getCredenciales
};
/*  getUsuarios:    getUsuarios,
  createAlumno: createAlumno,
  createUsuario: createUsuario,
  updateAlumno: updateAlumno,
  removeAlumno: removeAlumno

getAccesos: getAccesos,
  
*/


//***************************************************************************************************************************
//***********************************************************    METODOS GET   **********************************************
//***************************************************************************************************************************

// get all credenciales
function getCredenciales(req, res, next) {
var email = req.params.email;
  db.any('SELECT  u.email, p.id_permiso, p.permiso, r.id_rol, r.rol from usuarios u inner join usuarios_rol ur on u.email= ur.email inner join rol r on r.id_rol= ur.id_rol inner join rol_permiso rp on rp.id_rol= r.id_rol inner join permisos p on p.id_permiso= rp.id_permiso where u.email= $1 ',email)
    .then(function (data) {
      res.status(200)
        .json({
          credenciales: data
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


// get all Alumnos
function getAlumnos(req, res, next) {
  db.any('select * from alumnos')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL alumnos'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

  
//get horario 
function getHorario(req, res, next) {
var nocont = req.params.nocont;
  db.any('select  a.email, a.nocont,a.nombre alumno,e.nombre especialidad, g.nogpo, g.salon, ma.nombre materia, m.nombre maestro, ma.horteo,ma.horpra,ma.creditos,ca.dia,ca.hora from alumnos a inner join especialidades e on a.cveesp=e.cveesp inner join maestros m on m.cveesp=e.cveesp inner join grupos g on g.cvemae=m.cvemae inner join materias ma on ma.cvemat=g.cvemat inner join cargaacademica ca on g.nogpo=ca.nogpo where a.nocont=$1',nocont)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          horario: data,
          message: 'Retrieved ALL alumnos'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


// login
function login(req, res) {
var arrayD = [req.params.email,req.params.contraseña];

    db.any('SELECT * FROM usuarios WHERE email = $1 AND contraseña = $2',arrayD)
        .then(function () {
            res.status(200)
            accesos(email, res);
        })
        .catch(function (err) {
            return next(err);
        });
}

//accesos

function getAccesos(req, res) {
    var email = req.params.email;
    db.any('SELECT * FROM accesos WHERE email = $1 AND contraseña = $2',[email])
        .then(function () {
            res.status(200)
            accesos(email, res);
        })
        .catch(function (err) {
            return next(err);
        });
}


function accesos(email,res) {

    var token = md5(email);
    db.none("INSERT INTO accesos (email, fecha_inicio, fecha_fin, token) " +
        "values ('" + email + "', now(), now() + interval '30 minutes', '"+token+"')")
        .then(function(){
            res.status(200)
                .json({
                    token:token
                });
        })
}

// get a single alumno
function getAlumno(req, res, next) {
var email = req.params.email;

  db.one('select * from alumnos where email=$1', email).then(function (data) 
  {
      res.status(200)
        .json(
           data,
        );
    })
    .catch(function (err) {
      return next(err);
    });
}

// get a single alumno de materia
function getGrupoAlumnosMateria(req, res, next) {
var arrayD = [req.params.cvemat,req.params.nogpo];

  db.any('select a.nombre alumno, a.nocont,l.nogpo,m.nombre materia,a.email,a.semestre  from listas l inner join alumnos a on l.nocont=l.nocont inner join grupos g on g.nogpo=l.nogpo inner join maestros ma on ma.cvemae=g.cvemae inner join materias m on m.cvemat=g.cvemat where l.cvemat=$1 and l.nogpo =$2;', arrayD).then(function (data) 
  {
      res.status(200)
        .json(
        {

           alumnos: data
        }
          
        );
    })
    .catch(function (err) {
      return next(err);
    });
}


//get a single cargaAcademica

function getCargaAcademica(req, res) {
var nocont = req.params.nocont;

    db.any('select ma.cvemat,ma.nombre,g.nogpo, g.dia, g.horario from grupos g inner join maestros m on m.cvemae=g.cvemae inner join materias ma on ma.cvemat=g.cvemat inner join listas l on l.nogpo=g.nogpo inner join alumnos a on a.nocont=l.nocont where a.nocont=$1',nocont)
        .then(function (data) {
            res.status(200).json
            ({
              cargaacademica :data
            }
              );
        })
        .catch(function (err) {
            return next(err);
        });
}

//get calificaciones
function getCalificaciones(req, res) {
var nocont = req.params.nocont;

    db.any('select l.nogpo,l.cvemat,m.nombre materia, l.parcial_1,l.parcial_2,l.parcial_3,l.parcial_4  from listas l inner join materias m on m.cvemat=l.cvemat where nocont=$1;',nocont)
        .then(function (data) {
            res.status(200).json
            ({
              calificaciones :data
            }
              );
        })
        .catch(function (err) {
            return next(err);
        });
}





//get all carreras
function getEspecialidades(req, res, next) {
  db.any('select * from especialidades')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          especialidades: data,
          message: 'Retrieved ALL especialidades'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//get a single carrera
function getEspecialidad(req, res, next) {
var cveesp = req.params.id;
  db.one('select * from especialidades where cveesp = $1', cveesp)    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved single especialidad'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}
// get maestros 
function getMaestros(req, res, next) {
  db.one('select * from maestros')    .then(function (data) {
      res.status(200)
        .json(
      data
        );
    })
    .catch(function (err) {
      return next(err);
    });
}


// get all maestros
function getMaestrosAlumno(req, res, next) {
var nocont = req.params.nocont;
  db.any('select m.cvemae,m.nombre,m.cveesp,m.email from maestros m inner join grupos g on g.cvemae=m.cvemae inner join listas l on g.nogpo=l.nogpo inner join alumnos a on a.nocont=l.nocont where l.nocont=$1',nocont)
    .then(function (data) {
      res.status(200)
        .json({
          maestros: data,
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//get a single maestro
function getMaestro(req, res, next) {
var email = req.params.email;
  db.one('select * from maestros where email = $1', email)    .then(function (data) {
      res.status(200)
        .json(
      data
        );
    })
    .catch(function (err) {
      return next(err);
    });
}

//get all usuarios
function getUsuarios(req, res, next) {
  db.any('select * from usuarios')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL ususarios'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


//get a single usuario
function getUsuario(req, res, next) {
var arrayD = [req.params.email,req.params.pass];

  db.one('select u.email,r.rol from usuarios u inner join usuarios_rol ur on u.email=ur.email inner join rol r on ur.id_rol=r.id_rol where u.email=$1 and u.contraseña=$2',arrayD)    .then(function (data) {
      res.status(200)
        .json(
           data
        );
    })
    .catch(function (err) {
      return next(err);
    });
}

//get a single Reticula
function getReticula (req, res, next) {
  db.any('select * from reticula ')    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all of reticula '
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


//get a single kardex
function getKardex(req, res, next) {
var arrayD = [req.params.cvemat,req.params.nocont,req.params.opor];

  db.any('select * from kardex where cvemat=$1 and nocont=$2 and opor=$3',arrayD)    .then(function (data) {
      res.status(200)
        .json(
           data
        );
    })
    .catch(function (err) {
      return next(err);
    });
}

// get kardex to 
function getKardexTo(req, res) {
var nocont = req.params.nocont;

    db.any('select m.nombre materia,o.descripcion oportunidad,k.calif,k.semestre  from kardex k inner join materias m on m.cvemat=k.cvemat inner join oportunidad o on o.opor=k.opor where nocont=$1',nocont)
        .then(function (data) {
            res.status(200).json
            ({
              kardex :data
            }
              );
        })
        .catch(function (err) {
            return next(err);
        });
}



//get all materias
function getMaterias(req, res, next) {
  db.any('select * from materias')
    .then(function (data) {
      res.status(200)
        .json({
          materias: data
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


//get a single materia
function getMateria(req, res, next) {
var cvemat = req.params.cvemat;
  db.one('select * from materias where  cvemat= $1', cvemat)    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved A single materia'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//get all grupos
function getGrupos(req, res, next) {
  db.any('select * from grupos')
    .then(function (data) {
      res.status(200)
        .json({
              grupos: data
           
        }
//          status: 'success',
  //        message: 'Retrieved ALL grupos'
        );
    })
    .catch(function (err) {
      return next(err);
    });
}

function getGruposAsignados(req, res, next) {
var cvemae= req.params.cvemae; 

  db.any('select ma.cvemat,g.nogpo,g.dia,g.horario, g.salon, ma.nombre materia, m.nombre maestro, ma.horteo,ma.horpra,ma.creditos from maestros m inner join grupos g on g.cvemae=m.cvemae inner join materias ma on ma.cvemat=g.cvemat  inner join listas l on l.nogpo=g.nogpo where m.cvemae=$1',cvemae)
    .then(function (data) {
      res.status(200)
        .json({
            grupos: data           
        });
    })
    .catch(function (err) {
      return next(err);
    });
}




//get a single materia
function getoneGrupo(req, res, next) {
var arrayD= [req.params.cvemat,req.params.nogpo];

  db.one('select * from grupos where  cvemat= $1 and nogpo=$2', arrayD)    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved A single grupo '
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

// grupo del alumno 
function getGrupo(req, res, next) {
var nocont= req.params.nocont;
  
  db.any('select g.cvemat,g.nogpo,g.dia,g.horario, g.salon, ma.nombre materia, m.nombre maestro, ma.horteo,ma.horpra,ma.creditos from alumnos a inner join especialidades e on a.cveesp=e.cveesp inner join maestros m on m.cveesp=e.cveesp inner join grupos g on g.cvemae=m.cvemae inner join materias ma on ma.cvemat=g.cvemat inner join reticula r on r.cvemat=g.cvemat where a.nocont=$1 and g.cvemat not in ( select k.cvemat from alumnos a inner join kardex k on a.nocont=k.nocont where a.nocont=$1 and  k.calif>7.0) and ma.cvemat not in (select l.cvemat from listas l where l.nocont=$1)', nocont)    .then(function (data) {
      res.status(200)
        .json({
          grupos: data
          
        } 
        );
    })
    .catch(function (err) {
      return next(err);
    });
}

//get alumnos de grupo
function getGrupoAlumnos(req, res, next) {
var cvemae= req.params.cvemae;

  db.any('select a.nombre alumno, a.nocont, g.nogpo, ma.nombre materia, a.email, a.semestre from alumnos a inner join listas l on l.nocont=a.nocont inner join grupos g on g.nogpo=l.nogpo inner join maestros m on m.cvemae=g.cvemae inner join materias ma on ma.cvemat=g.cvemat where m.cvemae=$1;', cvemae)    .then(function (data) {
      res.status(200)
        .json({
          alumnos: data
          
        } 
        );
    })
    .catch(function (err) {
      return next(err);
    });
}






//get all listas
function getListas(req, res, next) {
  db.any('select * from listas')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL listas'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


//get a single materia
function getLista(req, res, next) {
var arrayD= [req.params.cvemat,req.params.nogpo,req.params.nocont];

  db.one('select * from grupos where  cvemat= $1 and nogpo=$2 and nocont=$3', arrayD)    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved A single lista '
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//get all oportunidades
function getOportunidades(req, res, next) {
  db.any('select * from oportunidad')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL oportunidades'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//get a single cargaAcdemica
function getOportunidad(req, res, next) {
var opor = parseInt(req.params.opor);
  db.one('select * from oportunidad where  opor= $1 ', opor)    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved A single oportunidad '
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


//get all roles
function getRol(req, res, next) {
  db.any('select * from rol')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL roles'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//get all permisos
function getPermisos(req, res, next) {
  db.any('select * from permisos')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL permisos'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//get all permisos
function getPermisos(req, res, next) {
  db.any('select * from permisos')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL permisos'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//get all usuarios -roles
function getUsuarios_rol(req, res, next) {
  db.any('select * from usuarios_rol')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL usuarios_rol '
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//get all usuarios -roles
function getRol_permiso(req, res, next) {
  db.any('select * from rol_permiso')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL rol_permiso '
        });
    })
    .catch(function (err) {
      return next(err);
    });
}



//***************************************************************************************************************************
//***********************************************************    METODOS POSTS  *********************************************
//***************************************************************************************************************************


// post usuarios
function createUsuario(req, res, next) {
 // req.body.id_alumno = parseInt(req.body.id_alumno);
  db.none('insert into usuarios(email, contraseña)' +
      'values(${nomuser}, ${pwduser}, ${id_alumno})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one usuario'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

// post maestros
function createMaestro(req, res, next) {
 
  db.none('insert into maestros(cvemae,nombre,cveesp)' +
      'values(${cvemae}, ${nombre}, ${cveesp})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one maestro'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

// post especialidad
function createEspecialidad(req, res, next) {
  db.none('insert into maestros(cveesp,nombre)' +
      'values(${cveesp}, ${nombre})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one especialidad'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


// post alumno
function createAlumno(req, res, next) {
 // req.body.id_carrera = parseInt(req.body.id_carrera);
  db.none('insert into alumnos(nocont,nombre,cveesp,sexo,semestre,email)' +
      'values(${nocont},${nombre},${cveesp},${sexo},${semestre},${email})',
       req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one alumno'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

// post especialidad
function createReticula(req, res, next) {
  db.none('insert into reticula(cveesp,cvemat)' +
      'values(${cveesp}, ${cvemat})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one reticula'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


// post grupo
function createGrupo(req, res, next) {
//   req.body.horario = req.body.horario;
 
  db.none('insert into grupos(cvemat,nogpo,cvemae,salon,horario)' +
      'values(${cvemat},${nogpo},${cvemae},${salon},${horario})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one grupo'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


// post materia
function createMateria(req, res, next) {
  db.none('insert into materias(cvemat,nombre,horteo,horpra,creditos)' +
      'values(${cvemat}, ${nombre},${horteo},${horpra},${creditos})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one materia'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

// post materia
function createMateria(req, res, next) {
  db.none('insert into materias(cvemat,nombre,horteo,horpra,creditos)' +
      'values(${cvemat}, ${nombre},${horteo},${horpra},${creditos})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one materia'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

// post kardex
function createKardex(req, res, next) {
  db.none('insert into kardex(cvemat,nocont,opor,calif)' +
      'values(${cvemat}, ${nocont},${opor},${calif})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one kardex'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

// post kardex
function createLista(req, res, next) {
  db.none('insert into listas(cvemat,nogpo,nocont)' +
      'values(${cvemat}, ${nogpo},${nocont})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one lista'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


// post cargaAcademica
function createCargaAcademica(req, res, next) {
  db.none('insert into cargaacademica(cvemat,dia,hora)' +
      'values(${cvemat}, ${nogpo},${dia},${hora})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one carga academica'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

// post cargaAcademica
function createUsuario_rol(req, res, next) {
  req.body.id_rol = parseInt(req.body.id_rol);

  db.none('insert into usuarios_rol(email,id_rol)' +
      'values(${email}, ${id_rol})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one usuarios_rol'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

// post permiso
function createPermisos(req, res, next) {
  req.body.id_permiso = parseInt(req.body.id_permiso);

  db.none('insert into permisos(id_permiso,permiso)' +
      'values(${id_permiso},${permiso})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one permiso'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

// post permiso_rol
function createRol_permiso(req, res, next) {
  req.body.id_permiso = parseInt(req.body.id_permiso);
  req.body.id_rol = parseInt(req.body.id_rol);

  db.none('insert into permiso_rol(id_permiso,id_rol)' +
      'values(${id_permiso},${id_rol})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one permiso_rol'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}



// metodos PUT
//------------------------------------

function updateAlumno(req, res, next) {
  db.none('update alumnos set nombre=$1, where id=$5',
    [req.body.name, req.body.breed, parseInt(req.body.age),
      req.body.sex, parseInt(req.params.id)])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated Alumno'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


//***************************************************************************************************************************
//***********************************************************    METODOS DELETE *********************************************
//***************************************************************************************************************************


//delete alumno
function removeAlumno(req, res, next) {
  var nocont = req.params.nocont;
  db.result('delete from alumnos where nocont = $1', nocont)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} alumno`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//delete alumno
function removeMaestro(req, res, next) {
  var cvemae = req.params.cvemae;
  db.result('delete from maestros where cvemae = $1', cvemae)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} maestro`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//delete especialidad
function removeEspecialidad(req, res, next) {
  var cveesp = req.params.cveesp;
  db.result('delete from especialidades where cveesp = $1', cveesp)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} especialidad`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//delete reticula
function removeReticula(req, res, next) {
  var arrayD= [req.params.cveesp,req.params.cvemat];

  db.result('delete from reticula where cveesp = $1 and cvemat=$2', arrayD)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} reticula`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//delete grupo
function removeGrupo(req, res, next) {
var arrayD= [req.params.cvemat,req.params.nogpo];
  db.result('delete from grupos where cvemat = $1 and nogpo=$2', arrayD)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} grupo`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//delete materia
function removeMateria(req, res, next) {
  var cvemat = req.params.cvemat;
  
  db.result('delete from materias where cvemat = $1', cvemat)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} materia`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


//delete materia
function removeMateria(req, res, next) {
  var cvemat = req.params.cvemat;
  
  db.result('delete from materias where cvemat = $1', cvemat)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} materia`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


//delete kardex
function removeKardex(req, res, next) {
 var arrayD= [req.params.cvemat,req.params.nocont,req.params.opor];
 
  db.result('delete from kardex where cvemat = $1 and nocont=$2 and opor= $3' , arrayD)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} kardex`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//delete listas
function removeListas(req, res, next) {
  var arrayD= [req.params.cvemat,req.params.nocont,req.params.nogpo];

  db.result('delete from listas where cvemat = $1 and nocont=$2 and nogpo= $3' , arrayD)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} lista`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//delete carga academica 
function removeCargaAcademica(req, res, next) {
  
  var arrayD= [req.params.cvemat,req.params.nogpo];

  db.result('delete from cargaacademica where cvemat = $1 and nogpo=$2' , arrayD)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} carga academica`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//delete ususario
function removeUsuario(req, res, next) {
  var email = req.params.email;
  
  db.result('delete from usuarios where email = $1 ' ,email)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} usuario`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//delete ususario
function removeUsuario(req, res, next) {
  var email = req.params.email;
  
  db.result('delete from usuarios where email = $1 ' ,email)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} usuario`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//delete rol
function removeRol(req, res, next) {
  var id_rol = req.params.id_rol;
  
  db.result('delete from rol where id_rol = $1 ' ,id_rol)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} usuario`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//delete usuario rol
function removeUsuario_rol(req, res, next) {
  var arrayD= [req.params.id_rol,req.params.email];

  db.result('delete from usuarios_rol where id_rol = $1 and email=$2' ,arrayD)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} usuario_rol`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


//delete permiso
function removePermiso(req, res, next) {
  var id_permiso = req.params.id_permiso;
  
  db.result('delete from permisos where id_permiso = $1' ,id_permiso)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} permiso`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}



//delete rol_permisio
function removeRol_permiso(req, res, next) {
 var arrayD= [req.params.id_rol,req.params.id_permiso];

  db.result('delete from permisos where id_rol = $1 and id_permiso=$2' ,arrayD)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} permiso`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


//----------------------------------------------------------------------------------
function updateAlumno(req, res, next) {
  db.none('update usuarios set  telefono=$2 ,nss=$3, direccion=$4 where email=$5',
    [req.body.contraseña,req.body.telefono,req.body.nss,req.body.direccion,req.params .email])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'update usuario'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateCalificaciones(req, res, next) {
  db.none('update listas set parcial_1=$1, parcial_2=$2, parcial_3=$3, parcial_4=$4 where nogpo=$5 and nocont=$6',
    [parseInt(req.body.parcial_1),parseInt(req.body.parcial_2),parseInt(req.body.parcial_3),parseInt(req.body.parcial_4),
      req.params.nogpo, req.params.nocont])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated calificaciones'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}