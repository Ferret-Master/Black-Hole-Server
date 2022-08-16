model.effectPuppetArray = {};// an object containing all spawned puppets keyed to the id's


model.systemUISettings = {//settings
	orientation:undefined,
	selectedAnim:"NONE",
	selectedUnit:"/pa/units/land/assault_bot/assault_bot.json", 
	selectedEffect:"/pa/effects/specs/black_hole.pfx", 
	effectBone:"bone_root",
	boneOffset:[0,0,-0.3], 
	boneOrient:[0,0,0], 
	useUnit:false,
	useEffect:true,
	useUnitEffects:false,
	autoDelete:false,
	timedDelete:false,
	timedReset:false,
	refreshOnFileChange:false,
	useLastEffectPath:false,
	refreshOnSettingsChange:false,
	deleteResetDuration:3,
	autoDeleteAmount:10,
	snap:0,
	scale:5000,
	travelSpeed:10,

}


model.spawnBlackHole = function(){
        var settingsObject = model.systemUISettings
        var planetId = model.planetListState().planets[model.planetListState().planets.length-1].index;
        
        if(settingsObject == undefined){return}
        //checks for error in effect file(important for refreshes)
       
  
        var puppetConfig = {};
       
          
            var location = {
                "planet":planetId || 0,
                "pos": [0,0,0],
                "scale":settingsObject.scale,
                "snap": settingsObject.snap
            }
  
            if(settingsObject.orientation !== undefined){
              location.orient = settingsObject.orientation;
            }
  
            //if it is a reset/refresh use previous location
            //puppet location added  
            puppetConfig.location = location;
            
            //called regardless of unit being used to simplify function logic

  
                  //if useUnit is enabled
                  puppetConfig.fx_offsets = [];
                  if(settingsObject.useEffect == true){
                    //selected effect added
                    puppetConfig.fx_offsets.push({
                      "type":"energy",
                      "filename":settingsObject.selectedEffect,
                      "bone":settingsObject.effectBone,
                      "offset":settingsObject.boneOffset,
                      "orientation":settingsObject.boneOrient
                    })
                  }
                  //if neither option remove the field
                  if(puppetConfig.fx_offsets.length == 0){puppetConfig.fx_offsets = undefined}
  
                  //add the material, may make this customizable in future
                  puppetConfig.material = {
                      "shader":"pa_unit",
                      "constants":{
                      "Color":[100,100,100,5],
                      "BuildInfo":[0,0,0]
                      },
                      "textures":{
                      "Diffuse":"/pa/effects/diffuse.papa"
                      }
                      }  
  
                      //base game puppet api called, returns the puppets id which we need to interact with it
                   
                        api.getWorldView(0).puppet(puppetConfig, true).then((function(result){
                          console.log(JSON.stringify(puppetConfig))
                          var puppetObject = {}
                          puppetObject.id = result.id;
                          puppetObject.location = location;
                          puppetObject.usedSettings = settingsObject
                          $.getJSON("coui://"+settingsObject.selectedEffect).then(function(data){
                                puppetObject.string = JSON.stringify(data)
                          model.effectPuppetArray[result.id] = puppetObject;
                          
                        })
                    }));
            
        
  
  
      
      }




model.spawnBlackHoleAfterSpawn = function(){
	if((model.isSpectator() == true || model.maxEnergy() > 0) && model.timeBarState().minValidTime !== -1){
		_.delay(model.spawnBlackHole,3000)
	}
	else{
		_.delay(model.spawnBlackHoleAfterSpawn,100)
	}
}

model.spawnBlackHoleAfterSpawn();