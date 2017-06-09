var container;
var camera, scene, renderer, THREE, geometryObj;
var sprtCount = 0;
var sprtCount1 = 0;
var N = 185;
var sistema = [];
var time = 0;
var moon = {};
var keyboard = new KeyboardState();
var key = -1;
var sky;
var clock = new THREE.Clock();

init();

planets(0, 13, 'Planets/sunmap.jpg', new THREE.Vector3(0, 0, 0), 0, 0, 0, 0, 0, false, null);

//Mercuriy
planets(29, 7.5, 'Planets/mercury/mercurymap.jpg', new THREE.Vector3(29, 0, 0), -0.241, -0.47, 0, 1, 'Planets/mercury/mercurybump.jpg', true, 'Mercur.png', "Mercur1.png");

//Venera
planets(54, 8.5, 'Planets/venus/venusmap.jpg', new THREE.Vector3(54, 0, 0), -0.615, -0.35, 0, 1, 'Planets/venus/venusbump.jpg', true, 'Venus.png', "Venus1.png");

//Zemlya
planets(75, 9, 'Planets/earth/earthmap1k.jpg', new THREE.Vector3(75, 0, 0), -1, -0.29, 18, 1, 'Planets/earth/earthbump1k.jpg', true, 'earth.png', "earth1.png");
//Moon
addMoon(15, 3, 'Planets/earth/moon/moonmap1k.jpg', new THREE.Vector3(10, 0, 0), -0.9, -100, 0, 'moon.png', null);

//Mars
planets(114, 8, 'Planets/Mars/marsmap1k.jpg', new THREE.Vector3(114, 0, 0), -1.52, -0.24, 0, 1, 'Planets/mars/marsbump1k.jpg', true, 'Mars.png', "Mars1.png");

//звездная система
planets(0, 300, 'Planets/starmap.jpg', new THREE.Vector3(0, 0, 0), 0, 0, 0, 0, false, null);

animate();

function init()
{
    container = document.getElementById('container');

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    camera.position.set(100, 100, 150);

    cameraOrtho = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 1, 10);
    cameraOrtho.position.z = 10;

    sceneOrtho = new THREE.Scene();

    camera.lookAt(new THREE.Vector3(0, 0.0, 0));
    // Создание отрисовщика
    renderer = new THREE.WebGLRenderer({antialias: false});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    var ambiLight = new THREE.AmbientLight(0x333333);
    scene.add(ambiLight);

    var light = new THREE.PointLight(0xffffff, 1, 1000);
    light.position.set(0, 0, 0);
    scene.add(light);

    createEarthCloud();

}

function planets(rad_orbit, radius, textura, coords, v, phi, naklon, mat, heightmap, light, sname, sprite)
{
    var geometry = new THREE.SphereGeometry(radius, 32, 32);

    var tex = new THREE.ImageUtils.loadTexture(textura);
    tex.minFilter = THREE.NearestFilter;

    if (light)
    {
        var material = new THREE.MeshPhongMaterial({
            map: tex,
            side: THREE.DoubleSide
        });
    } else
    {
        var material = new THREE.MeshBasicMaterial({
            map: tex,
            side: THREE.DoubleSide
        });
    }

    material.bumpMap = THREE.ImageUtils.loadTexture(heightmap);
    material.minFilter = THREE.NearestFilter;
    material.bumpScale = 2;

    var sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    sphere.position.set(coords.x, coords.y, coords.z);//координаты

    var planet = {};
    planet.planet = sphere; //добавление поля planet
    planet.pos = coords; //добавление поля pos
    planet.radius = radius;
    planet.v = v;
    planet.phi = phi;// угловая скорость
    planet.naklon = naklon; // угол наклона планет только у земли у остальных 0
    planet.rad_orbit = rad_orbit;
    planet.angle = 0.0;
    planet.angle2 = 0.0;
    planet.name = null;
    planet.name1 = null;

    if (sname !== null)
    {
        var textureLoader = new THREE.TextureLoader();
        planet.sprt = textureLoader.load(sname, sprtLoad);
    }

    if (sprite !== null)
    {
        var textureLoader = new THREE.TextureLoader();
        planet.sprt1 = textureLoader.load(sprite, sprtLoad1);
    }

    sistema.push(planet);

    var lineGeometry = new THREE.Geometry();
    var vertArray = lineGeometry.vertices;
    for (var i = 0; i < 2 * Math.PI; i += (2 * Math.PI / 360))
    {
        var x = rad_orbit * Math.cos(i);
        var z = rad_orbit * Math.sin(i);
        vertArray.push(new THREE.Vector3(x, 0, z));
    }

    lineGeometry.computeLineDistances();
    var lineMaterial = new THREE.LineDashedMaterial({color: 0xcccc00, dashSize: 1, gapSize: 1});
    var line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
}

//координаты, текстуры, позиция, скорость
function addMoon(rad_orbit, radius, textura, coords, v, phi, naklon, sname, sprite)
{
    var geometry = new THREE.SphereGeometry(radius, 32, 32);

    var tex = new THREE.ImageUtils.loadTexture(textura);
    tex.minFilter = THREE.NearestFilter;

    var material = new THREE.MeshBasicMaterial({
        map: tex,
        side: THREE.DoubleSide});

    var sphere = new THREE.Mesh(geometry, material);

    scene.add(sphere);

    sphere.position.set(coords.x, coords.y, coords.z);//координаты

    moon.planet = sphere; //добавление поля planet

    moon.pos = coords; //добавление поля pos
    moon.radius = radius;
    moon.v = v;
    moon.phi = phi;// угловая скорость
    moon.naklon = naklon; // угол наклона планет только у земли у остальных 0
    moon.rad_orbit = rad_orbit;
    moon.name = null;
    moon.name1 = null;

    if (sname !== null)
    {
        var textureLoader = new THREE.TextureLoader();
        moon.sprt = textureLoader.load(sname, sprtLoad);
    }

    if (sprite !== null)
    {
        var textureLoader = new THREE.TextureLoader();
        moon.sprt1 = textureLoader.load(sprite, sprtLoad1);
    }
}

function createEarthCloud()
{
    // create destination canvas
    var canvasResult = document.createElement('canvas');
    canvasResult.width = 1024;
    canvasResult.height = 512;
    var contextResult = canvasResult.getContext('2d');

    // load earthcloudmap
    var imageMap = new Image();
    imageMap.addEventListener("load", function ()
    {
        // create dataMap ImageData for earthcloudmap
        var canvasMap = document.createElement('canvas');
        canvasMap.width = imageMap.width;
        canvasMap.height = imageMap.height;
        var contextMap = canvasMap.getContext('2d');
        contextMap.drawImage(imageMap, 0, 0);
        var dataMap = contextMap.getImageData(0, 0, canvasMap.width,
                canvasMap.height);

        // load earthcloudmaptrans
        var imageTrans = new Image();
        imageTrans.addEventListener("load", function ()
        {

            // create dataTrans ImageData for earthcloudmaptrans
            var canvasTrans = document.createElement('canvas');
            canvasTrans.width = imageTrans.width;
            canvasTrans.height = imageTrans.height;
            var contextTrans = canvasTrans.getContext('2d');
            contextTrans.drawImage(imageTrans, 0, 0);
            var dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height);

            // merge dataMap + dataTrans into dataResult
            var dataResult = contextMap.createImageData(canvasMap.width, canvasMap.height);
            for (var y = 0, offset = 0; y < imageMap.height; y++)
                for (var x = 0; x < imageMap.width; x++, offset += 4)
                {
                    dataResult.data[offset + 0] = dataMap.data[offset + 0];
                    dataResult.data[offset + 1] = dataMap.data[offset + 1];
                    dataResult.data[offset + 2] = dataMap.data[offset + 2];
                    dataResult.data[offset + 3] = 255 - dataTrans.data[offset + 0];
                }
            // update texture with result
            contextResult.putImageData(dataResult, 0, 0);
            material.map.needsUpdate = true;
        });

        imageTrans.src = 'Planets/earth/earthcloudmaptrans.jpg';
    }, false);

    imageMap.src = 'Planets/earth/earthcloudmap.jpg';
    var geometry = new THREE.SphereGeometry(9.2, 32, 32);
    var material = new THREE.MeshPhongMaterial({
        map: new THREE.Texture(canvasResult),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8});

    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(75, 0, 0);

    sky = mesh;

    scene.add(mesh);
}

function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function keyboardstate()
{
    keyboard.update();

    if (keyboard.down("1"))
    {
        key = 1;
        for (var i = 2; i < 5; i++)
            scene.remove(sistema[i].name1);
        scene.add(sistema[1].name1);
    } else if (keyboard.down("2"))
    {
        key = 2;
        scene.remove(sistema[1].name1);
        scene.remove(sistema[3].name1);
        scene.remove(sistema[4].name1);
        scene.add(sistema[2].name1);
    } else if (keyboard.down("3"))
    {
        key = 3;
        scene.remove(sistema[1].name1);
        scene.remove(sistema[2].name1);
        scene.remove(sistema[4].name1);
        scene.add(sistema[3].name1);
    } else if (keyboard.down("4"))
    {
        key = 4;
        for (var i = 1; i < 4; i++)
            scene.remove(sistema[i].name1);
        scene.add(sistema[4].name1);
    } else if (keyboard.down("0"))
    {
        key = 0;
        for (var i = 1; i < 5; i++)
            scene.remove(sistema[i].name1);
    }

    if (key > 0 && key <= 4)
    {
        var m = new THREE.Matrix4();
        m.copyPosition(sistema[key].planet.matrix);// обратная опреация взятия из матрицы
        var pos = new THREE.Vector3(1, 0, 0);
        pos.setFromMatrixPosition(m);
        camera.position.x = pos.x + 20;
        camera.position.z = pos.z + 20;
        camera.position.y = 40;
        camera.lookAt(new THREE.Vector3(pos.x, 0, pos.z));

    } else if (key === 0)
    {
        camera.position.set(100, 100, 150);
        camera.lookAt(new THREE.Vector3(0, 0.0, 0));
    }
}

function animate()
{
    var delta = clock.getDelta();// время  с предыдущего запуска
    time += delta;

    for (var i = 0; i < sistema.length; i++)
    {
        sistema[i].angle += sistema[i].phi * delta;
        sistema[i].angle2 += sistema[i].v * delta;

        var m = new THREE.Matrix4();
        var m1 = new THREE.Matrix4();
        var m2 = new THREE.Matrix4();
        var m3 = new THREE.Matrix4();
        var m4 = new THREE.Matrix4();

        //создание матрицы поворота (вокруг оси Y) в m1 и матрицы перемещения в m2
        m1.makeRotationY(sistema[i].angle2);
        m4.makeRotationZ(sistema[i].naklon * Math.PI / 180);
        m3.makeRotationY(sistema[i].angle);
        m2.setPosition(new THREE.Vector3(sistema[i].rad_orbit, 0, 0));

        ////запись результата перемножения m1 и m2 в m
        m.multiplyMatrices(m2, m1); //установка m в качестве матрицы преобразований объекта object
        m.multiplyMatrices(m3, m);

        sistema[i].planet.matrix = m;
        sistema[i].planet.matrixAutoUpdate = false;

        var m1 = new THREE.Matrix4();
        m1.copyPosition(sistema[i].planet.matrix);// обратная опреация взятия из матрицы
        var pos = new THREE.Vector3(1, 0, 0);
        pos.setFromMatrixPosition(m1);

        if (sistema[i].name !== null)
        {
            sistema[i].name.position.copy(pos);
            sistema[i].name.position.y += 13;
        }

        if (sistema[i].name1 !== null)
        {
            sistema[i].name1.position.copy(pos);
            sistema[i].name1.position.y += 27;
            sistema[i].name1.position.x += 17;
        }
    }

    var mpos = new THREE.Matrix4();
    var V = new THREE.Vector3();

    sistema[3].planet.matrixWorld.copyPosition(mpos);
    V.setFromMatrixPosition(sistema[3].planet.matrix);
    sky.position.x = V.x;
    sky.position.z = V.z;

    var m2 = new THREE.Matrix4();
    var m = new THREE.Matrix4();
    m.copyPosition(sistema[3].planet.matrix);// обратная опреация взятия из матрицы
    var pos = new THREE.Vector3(1, 0, 0);
    pos.setFromMatrixPosition(m);

    m2.setPosition(new THREE.Vector3(pos.x + moon.rad_orbit * Math.cos(moon.v * time), 0, pos.z + moon.rad_orbit * Math.sin(moon.v * time)));// вращение луны вокруг солнца

    moon.planet.matrix = m2;
    moon.planet.matrixAutoUpdate = false;

    if (moon.name !== null)
    {
        var m1 = new THREE.Matrix4();
        m1.copyPosition(moon.planet.matrix);// обратная опреация взятия из матрицы

        var pos1 = new THREE.Vector3(1, 0, 0);
        pos1.setFromMatrixPosition(m1);

        moon.name.position.copy(pos1);
        moon.name.position.y += 13;
    }

    if (moon.name1 !== null)
    {
        var m1 = new THREE.Matrix4();
        m1.copyPosition(moon.planet.matrix);// обратная опреация взятия из матрицы

        var pos1 = new THREE.Vector3(1, 0, 0);
        pos1.setFromMatrixPosition(m1);

        moon.name1.position.copy(pos1);
        moon.name1.position.y += 13;
        moon.name1.position.x += 13;
    }

    keyboardstate();

    requestAnimationFrame(animate);
    render();
}

function render()
{
    renderer.render(scene, camera);
    renderer.clear();
    renderer.autoClear = false;
    renderer.render(scene, camera);
    renderer.clearDepth();
    renderer.render(sceneOrtho, cameraOrtho);
}

function sprtLoad()
{
    sprtCount++;

    if (sprtCount === 5)
        sprtSet();
}

function sprtLoad1()
{
    sprtCount1++;

    if (sprtCount1 === 4)
        sprtSet1();

}

function createSprt(planet, position)
{
    var material = new THREE.SpriteMaterial({map: planet.sprt});
    var width = material.map.image.width;
    var height = material.map.image.height;

    var sprite = new THREE.Sprite(material);

    sprite.scale.set(width / 25, height / 25, 1);
    sprite.position.copy(position);

    planet.name = sprite;

    scene.add(sprite);
}


function sprtSet()
{
    createSprt(sistema[2], new THREE.Vector3(0, 0, 0)); // Venera
    createSprt(sistema[3], new THREE.Vector3(0, 0, 0)); //земля
    createSprt(sistema[4], new THREE.Vector3(0, 0, 0)); //марс
    createSprt(sistema[1], new THREE.Vector3(0, 0, 0)); //меркурий
    createSprt(moon, new THREE.Vector3(0, 0, 0));  //луна
}


function sprtSet1()
{
    createSprt1(sistema[2], new THREE.Vector3(100, 80, 0)); // Venera
    createSprt1(sistema[3], new THREE.Vector3(100, 80, 0)); //земля
    createSprt1(sistema[4], new THREE.Vector3(100, 80, 0)); //марс
    createSprt1(sistema[1], new THREE.Vector3(100, 80, 0)); //меркурий
    createSprt1(moon, new THREE.Vector3(100, 80, 0));  //луна
}

function createSprt1(planet, position)
{
    var material = new THREE.SpriteMaterial({map: planet.sprt1});
    var width = material.map.image.width;
    var height = material.map.image.height;

    var sprite = new THREE.Sprite(material);

    sprite.scale.set(width / 70, height / 70, 1);
    sprite.position.copy(position);

    planet.name1 = sprite;
}
