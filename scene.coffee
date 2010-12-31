###
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
Proxies
###

gui = new GUI
skybox = new Skybox
backgroundCamera = new BackgroundCamera(skybox.node)
level = new Level
levelCamera = new LevelCamera(level.node)
levelLookAt = new LevelLookAt(levelCamera.node, backgroundCamera.node)
guiCamera = new GUICamera(gui, levelCamera)
moon = new Moon
sun = new Sun
atmosphere = new Atmosphere

###
The main scene definition
###

class Scene
  constructor: () ->
    @node =
      type: "scene"
      id: "gameScene"
      canvasId: "gameCanvas"
      loggingElementId: "scenejsLog"
      nodes: [
        type: "geometry"
        resource: "tmp"
        primitive: "triangles"
        positions: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        indices: [0, 1, 2]
      ,
        type: "renderer"
        clear:
          depth:    true
          color:    true
          stencil:  false
        clearColor: { r: 0.5, g: 0.5, b: 0.5 }
        nodes: [
          type:      "light"
          id:        "sunLight"
          mode:      "dir"
          color:     { r: 1.0, g: 1.0, b: 1.0 }
          diffuse:   true
          specular:  false
          dir:       { x: 1.0, y: 1.0, z: -1.0 }
        ,
          type:      "light"
          id:        "moonLight"
          mode:      "dir"
          color:     { r: 0.5, g: 0.5, b: 0.5 }
          diffuse:   true
          specular:  false
          dir:       { x: -1.0, y: -1.0, z: -1.0 }
        ,
          graft(gui.lookAtNode, [guiCamera.node])
        ,
          levelLookAt.node
        ,
          levelLookAt.backgroundLookAtNode
        ]
      ]
    SceneJS.createNode(@node)

  withNode: -> SceneJS.withNode "gameScene"
  withSunLightNode: -> SceneJS.withNode "sunLight"
  withMoonLightNode: -> SceneJS.withNode "moonLight"
  
  updateSunLight: (color, lightDir) -> 
    @withSunLightNode()
      .set("color", {r: color[0], g: color[1], b: color[2]})
      .set("dir", {x: lightDir[0], y: lightDir[1], z: lightDir[2]})
  
  updateMoonLight: (color, lightDir) -> 
    @withMoonLightNode()
      .set("color", {r: color[0], g: color[1], b: color[2]})
      .set("dir", {x: lightDir[0], y: lightDir[1], z: lightDir[2]})

scene = new Scene

