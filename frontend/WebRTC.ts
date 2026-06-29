const constraint = {
    'audio' : true,
    'video' : true
}

async function getConnectedDevices(type:string,callback:Function){
      await navigator.mediaDevices.enumerateDevices()
    .then(devices =>  {
	const cameras = devices.filter(device => device.kind === type)
	callback(cameras);
    })
    .catch(err => {console.log(err);});
};

getConnectedDevices('videoinput',cameras => console.log("cameras found",cameras));
