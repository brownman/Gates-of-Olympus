var CloudDomeModule, canvas;
/*
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
*/
/*
A scenejs extension that renders a cloud dome using a full-screen quad and some procedural shaders.
*/
/*
Globals
*/
canvas = null;
CloudDomeModule = {
  vertexBuffer: null,
  shaderProgram: null,
  createResources: function() {
    var fragmentShader, gl, vertexShader, vertices;
    gl = canvas.context;
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    vertices = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.shaderProgram = gl.createProgram();
    vertexShader = compileShader(gl, "clouddome-vs");
    fragmentShader = compileShader(gl, "clouddome-fs");
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);
    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
    gl.useProgram(this.shaderProgram);
    this.shaderProgram.vertexPosition = gl.getAttribLocation(this.shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(this.shaderProgram.vertexPosition);
    return null;
  },
  destroyResources: function() {
    if (document.getElementById(canvas.canvasId)) {
      if (this.shaderProgram) {
        this.shaderProgram.destroy();
      }
      if (this.vertexBuffer) {
        this.vertexBuffer.destroy();
      }
    }
    return null;
  }
};
/*
SceneJS listeners
*/
SceneJS._eventModule.addListener(SceneJS._eventModule.SCENE_RENDERING, function() {
  return (canvas = null);
});
SceneJS._eventModule.addListener(SceneJS._eventModule.CANVAS_ACTIVATED, function(c) {
  return (canvas = c);
});
SceneJS._eventModule.addListener(SceneJS._eventModule.CANVAS_DEACTIVATED, function() {
  return (canvas = null);
});
SceneJS._eventModule.addListener(SceneJS._eventModule.RESET, function() {
  destroyResources();
  return (canvas = null);
});
/*
Cloud dome node type
*/
SceneJS.CloudDome = SceneJS.createNodeType("cloud-dome");
SceneJS.CloudDome.prototype._init = function(params) {
  this.setRadius(params.radius);
  return null;
};
SceneJS.CloudDome.prototype.setRadius = function(radius) {
  this.radius = radius || 100.0;
  this._setDirty();
  return this;
};
SceneJS.CloudDome.prototype.getColor = function() {
  return {
    radius: this.radius
  };
};
SceneJS.CloudDome.prototype.renderClouds = function() {
  var gl, saveState;
  gl = canvas.context;
  saveState = {
    blend: gl.getParameter(gl.BLEND),
    depthTest: gl.getParameter(gl.DEPTH_TEST)
  };
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.BLEND);
  gl.useProgram(CloudDomeModule.shaderProgram);
  gl.bindBuffer(gl.ARRAY_BUFFER, CloudDomeModule.vertexBuffer);
  gl.vertexAttribPointer(CloudDomeModule.shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  if (!saveState.blend) {
    gl.disable(gl.BLEND);
  }
  return null;
};
SceneJS.CloudDome.prototype._render = function(traversalContext) {
  if (SceneJS._traversalMode === SceneJS._TRAVERSAL_MODE_RENDER) {
    this._renderNodes(traversalContext);
    if (!CloudDomeModule.vertexBuffer) {
      CloudDomeModule.createResources();
    }
    this.renderClouds();
  }
  return null;
};