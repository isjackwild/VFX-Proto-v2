function convertToRange(value, srcRange, dstRange) {
	var adjValue, dstMax, srcMax;
	if (value < srcRange[0]) {
		return dstRange[0];
	} else if (value > srcRange[1]) {
		return dstRange[1];
	} else {
		srcMax = srcRange[1] - srcRange[0];
		dstMax = dstRange[1] - dstRange[0];
		adjValue = value - srcRange[0];
		return (adjValue * dstMax / srcMax) + dstRange[0];
	}
}

function lerp(x, t, y) {
	return x * (1-t) + y*t;
}



var threeCv, video, maskCv, maskCtx, mobileVid, mobileVidCv, mobileVidCtx,
	renderer, scene, camera,
	// geom, material, mesh, light, videoTexture,
	geom, meshes = [], group, light, videoTexture, matteTexture,
	composer, renderPass, effectCopy, rgbShift,
	then, now, delta = 1,
	mouseDB = false, isInit = false,
	w, h,
	numLayers = 6, videoOffsetX = 3.5, videoOffsetY = 1.8,
	opacityCounterSpeed = 0.2;

var mouse = {
	current : {
		x : null,
		y : null
	},
	prev : {
		x : null,
		y : null
	},
	diff : {
		x : 0,
		y : 0,
		total : 0
	}
};

var opacityCounter = {
	target : 0,
	current : 0,
	increaseSpeed : 0.15,
	decreaseSpeed : 0.07
};

var rgbCounter = {
	target : 0,
	current : 0,
	increaseSpeed : 0.15,
	decreaseSpeed : 0.11
};

var maskCounter = {
	target : 0,
	current : 0,
	increaseSpeed : 0.15,
	decreaseSpeed : 0.11
};

var posOffset = {
	x : 0,
	y : 0,
	counter : 0
};

var rgbMax = 0.005;
var opacityMax = 0.66;



function init() {
	threeCv = document.getElementById("three-cv");
	maskCv = document.getElementById("mask-cv");
	maskCtx = maskCv.getContext('2d');
	video = document.getElementById("video-texture");

	if (w < 400) {
		setupMobileVideo();
	}

	setupScene();
	setupVideoLayers();
	setupFxComposer();

	isInit = true;
}

function setupMobileVideo() {
	mobileVidCv = document.getElementById("mobile-vid-cv");
	// mobileVidCtx = mobileVidCv.getContext('2d');
	// mobileVid = document.createElement('video');
	// mobileVid.setAttribute('webkit-playsinline', true);
	// mobileVid.style.display = "none";
	// mobileVid.style.visibility = "hidden";
	// mobileVid.src = "assets/vid-3.mp4";


	mobileVid = new OgvJsPlayer(mobileVidCv);
	mobileVid.src = "test.ogv";
	mobileVid.muted = false;
	mobileVid.load();
	// mobileVid.load();
	mobileVid.onframecallback = function(){
		mobileVid.play();
	}
	// console.log(mobileVid);
}

// function playMobileVid() {
// 	mobileVid.play();
// }

function setupFxComposer() {
	var options = {
		antialias : true,
		canvas : threeCv,
		alpha: false
	};

	renderer = new THREE.WebGLRenderer(options);
	renderer.setSize(w, h);
	renderer.setClearColor( 0xffffff, 1);

	renderPass = new THREE.RenderPass(scene, camera);
	effectCopy = new THREE.ShaderPass(THREE.CopyShader);
	effectCopy.renderToScreen = true;
	rgbShift = new THREE.ShaderPass(THREE.RGBShiftShader);
	rgbShift.uniforms.angle.value = 10;
	rgbShift.uniforms.amount.value = 0;
	
	composer = new THREE.EffectComposer(renderer);
	composer.addPass(renderPass);
	composer.addPass(rgbShift);
	composer.addPass(effectCopy);
}

function setupScene() {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
	camera.position.z = 5.8;
	camera.position.y = 0;
	camera.position.x = 0;
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
	setCameraDist();
	
	light = new THREE.AmbientLight(0xffffff);
	scene.add(light);
}


function setupVideoLayers() {
	// group = new THREE.Object3D();

	geom = new THREE.PlaneGeometry(16,9);

	var _texture = mobileVidCv ? mobileVidCv : video;
	videoTexture = new THREE.Texture(_texture);
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;
	videoTexture.generateMipmaps = false;

	// matteTexture = THREE.ImageUtils.loadTexture('/assets/mask-16x9.png');
	matteTexture = new THREE.Texture(maskCv);
	matteTexture.wrapS = THREE.ClampToEdgeWrapping;
	matteTexture.wrapT = THREE.ClampToEdgeWrapping;
	matteTexture.minFilter = THREE.LinearFilter;

	// groupMat = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.FrontSide, transparent : true, opacity : 0, wireframe: false, alphaMap: matteTexture, blending: THREE.NormalBlending, blendSrc : THREE.DstColorFactor, blendDst : THREE.OneMinusSrcAlphaFactor});
	// group = new THREE.Mesh(geom, groupMat);
	// group.position.z = -0.1;
	group = new THREE.Object3D();

	for (var i=0; i<numLayers; i++) {
		// var _opacity = convertToRange(i, [0,numLayers-1], [0.7, 1]);
		// _opacity = 1;
		// var _zOffset = convertToRange(i, [0,numLayers-1], [0, -8]);
		// var _alphaMatte = (i == numLayers-1) ? null : matteTexture;
		// var _blend = (i == numLayers-1) ? THREE.NormalBlending : THREE.MultiplyBlending;

		// blendSrc : THREE.One, blendDst : THREE.OneMinusSrcColor
		//the background layer
		var options;

		if (i === numLayers-1) {
			options = {
				color: 0xca928c,
				side: THREE.FrontSide,
				transparent : true,
				opacity : 1,
				wireframe: false,
				depthTest: false,
				blending: THREE.NormalBlending,
			};
		} else {
			options = {
				color: 0xca928c,
				side: THREE.FrontSide,
				transparent : true,
				opacity : 0,
				wireframe: false,
				depthTest: false,
				alphaMap: matteTexture,
				blending: THREE.NormalBlending,
				blendEquation: THREE.AddEquation,
				blendDst : THREE.OneMinusDstAlphaFactor,
				blendSrc : THREE.DstColorFactor
			};
		}

		var material = new THREE.MeshPhongMaterial(options);
		var mesh = new THREE.Mesh(geom, material);
		mesh.originalPosition = {x: 0, y: 0};
		material.map = videoTexture;

		switch (i) {
			case 0:
				mesh.originalPosition.x = -videoOffsetX;
				mesh.originalPosition.y = videoOffsetY;
				break;
			case 1:
				mesh.originalPosition.x = videoOffsetX;
				mesh.originalPosition.y = videoOffsetY;
				break;
			case 2:
				mesh.originalPosition.x = -videoOffsetX;
				mesh.originalPosition.y = -videoOffsetY;
				break;
			case 3:
				mesh.originalPosition.x = videoOffsetX;
				mesh.originalPosition.y = -videoOffsetY;
				break;
		}

		meshes.push(mesh);

		if (i === 5) {
			mesh.position.z = -0.01;
			scene.add(mesh);
		} else {
			group.add(mesh);
		}
	}

	// material = new THREE.MeshPhongMaterial({color: 0xca928c, depthTest: false, side: THREE.FrontSide, opacity : 1, blending: THREE.MultiplyBlending});
	// var bg = new THREE.Mesh(geom, material);
	// bg.position.z = -0.1;

	// scene.add(bg);
	scene.add(group);
	console.log(group.children[0]);
}


function setCameraDist() {
	var vFOV = camera.fov * Math.PI/180;
	var height = 2 * Math.tan(vFOV / 2) * camera.position.z;
	var aspect = w/h;
	var width = height*aspect;

	var scaleX = 16/width;
	var scaleY = 9/height;

	if (w/h < (16/9)) {
		camera.position.z = camera.position.z*scaleY - 0.2;
	} else {
		camera.position.z = camera.position.z*scaleX - 0.2;
	}
}


function addEventListeners() {
	window.addEventListener('mousemove', onMouseMove, false);
	window.addEventListener('mousewheel', onMouseWheel, false);
	window.addEventListener('resize', onResize, false);

	// only for table tab / mobile
	if (w<400) {
		mobileVidCv.addEventListener('click', function(){
			console.log('click');
			mobileVid.play();
		});
	}
}

function onMouseMove(e) {
	if (mouseDB) return;
	mouseDB = true;

	if (mouse.prev.x) {
		mouse.diff.x = Math.abs(e.clientX - mouse.prev.x);
		mouse.diff.y = Math.abs(e.clientY - mouse.prev.y);
		mouse.diff.total = Math.sqrt(mouse.diff.x*mouse.diff.x + mouse.diff.y*mouse.diff.y);
		
		opacityCounter.target+= mouse.diff.total;
		rgbCounter.target+= mouse.diff.total;
		maskCounter.target+= mouse.diff.total;
	}

	
	mouse.prev.x = mouse.current.x;
	mouse.prev.y = mouse.current.y;

	mouse.current.x = e.clientX;
	mouse.current.y = e.clientY;

	
	// camera.position.x = (e.clientX/100) - (w/100)/2;
	// camera.position.y = (e.clientY/100) - (h/100)/2 + 1;
	// meshes[0].position.x = (e.clientX/1000) - (w/1000)/2;
	// meshes[0].position.y = (e.clientY/1000) - (h/1000)/2;

	// console.log(meshes[0].position.x);
}

function onMouseWheel(e) {
	camera.position.z += e.wheelDeltaY/500;
}

function onResize() {
	w = window.innerWidth;
	h = window.innerHeight;

	if (!isInit) return;

	
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
	setCameraDist();
	
	renderer.setSize(w, h);
}



function animate() {
	now = new Date().getTime();
	if (then) {
		delta = (now - then) / 16.666;
	}
	then = now;
	scrollDB = false;
	mouseDB = false;
	update();
	renderMask();

	if (w<400) {
		renderMobileVidCv();
	}

	render();

	requestAnimationFrame(animate);
}

function update() {
	updateLayerOpacity();
	updateRgbShift();
	updatePositionOffset();
}

function updatePositionOffset() {
	var _offsetX, _offsetY, _counter;
	posOffset.counter += 0.002*delta;
	// console.log(_offset)

	for (var i = 0; i < group.children.length-1; i++) {
		_counter = posOffset.counter+(i*2*(Math.PI/4));
		_offsetX = Math.cos(_counter)*-5.5;
		_offsetY = Math.sin(_counter)*3;

		group.children[i].position.x = _offsetX;
		group.children[i].position.y = _offsetY;
	}
}

function updateLayerOpacity() {
	if (opacityCounter.target > 1) {
		opacityCounter.target = lerp(opacityCounter.target,  opacityCounter.decreaseSpeed*delta , 0);
		opacityCounter.current = lerp(opacityCounter.current,  opacityCounter.increaseSpeed*delta , opacityCounter.target);
	} else if (opacityCounter.current > 0){
		opacityCounter.target = 0;
		opacityCounter.current = 0;
	}
	
	if (opacityCounter.current > 0) {
		var _opacity = convertToRange(opacityCounter.current, [0,333], [0, opacityMax]);

		for (var i = 0; i < group.children.length; i++) {
			group.children[i].material.opacity = _opacity;
		}
	}
}

function updateRgbShift() {
	if (rgbCounter.target > 1) {
		rgbCounter.target = lerp(rgbCounter.target,  rgbCounter.decreaseSpeed*delta , 0);
		rgbCounter.current = lerp(rgbCounter.current,  rgbCounter.increaseSpeed*delta , rgbCounter.target);
	} else if (rgbCounter.current > 0){
		rgbCounter.target = 0;
		rgbCounter.current = 0;
	}
	
	if (rgbCounter.current > 0) {
		var _shift = convertToRange(opacityCounter.current, [22,1666], [0, rgbMax]);
		rgbShift.uniforms.amount.value = _shift;
	}
}

function renderMask() {
	if (maskCounter.target > 1) {
		maskCounter.target = lerp(maskCounter.target,  maskCounter.decreaseSpeed*delta , 0);
		maskCounter.current = lerp(maskCounter.current,  maskCounter.increaseSpeed*delta , maskCounter.target);
	} else if (maskCounter.current > 0){
		maskCounter.target = 0;
		maskCounter.current = 0;
	}
	
	if (maskCounter.current > 0) {
		var _rad = convertToRange(maskCounter.current, [0,1111], [maskCv.height/8, maskCv.height/2.25]);
		var _blur = convertToRange(maskCounter.current, [0,1111], [10, 20]);

		maskCtx.fillStyle = '#000000';
		maskCtx.fillRect(0, 0, maskCv.width, maskCv.height);
		maskCtx.beginPath();
		maskCtx.arc(maskCv.width/2, maskCv.height/2, _rad, 0, 2*Math.PI, false);
		maskCtx.fillStyle = '#ffffff';
		maskCtx.fill();

		stackBlurCanvasRGB('mask-cv', 0, 0, maskCv.width, maskCv.height, _blur);
	}


	if (matteTexture) matteTexture.needsUpdate = true;
}

function renderMobileVidCv() {
	// console.log(mobileVid);
	// mobileVid.load();
	// mobileVid.onframecallback = function(){
	// 	mobileVid.play();
	// }
	// if (mobileVid.currentTime >= mobileVid.duration-1) {
	// 	mobileVid.currentTime = 0;
	// } else {
	// 	mobileVid.currentTime += 1/60*delta;
	// }
	// mobileVidCtx.drawImage(mobileVid, 0, 0, mobileVidCv.width, mobileVidCv.height);
	console.log(mobileVid.ended);
}

function render() {
	if (video.readyState === video.HAVE_ENOUGH_DATA || w < 400) {
		if (videoTexture) videoTexture.needsUpdate = true;
	}

	// camera.lookAt(meshes[meshes.length-1].position);
	composer.render(delta);
}


window.addEventListener('load', function(){
	onResize();
	init();
	addEventListeners();

	requestAnimationFrame(animate);
});
