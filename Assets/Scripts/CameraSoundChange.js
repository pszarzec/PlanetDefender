#pragma strict

public var NormalSound : AudioClip;
public var DieSound : AudioClip;

private var toDie : boolean;
private var updating : boolean; 
private var ready : boolean;
function Start () {
	updating = false;
	toDie = true;
	ready = false;
	ChangeToNormal();
}

function Update () {

}

function FixedUpdate () {
	

	var approxSecondsToFade : int = 2;

	if(updating){
		
		if (audio.volume > 0)
		{
			audio.volume = audio.volume - (Time.deltaTime / (approxSecondsToFade + 1));
		}
		else
		{
			audio.volume = 0;
			audio.Stop();
			audio.clip = (toDie ? DieSound : NormalSound);
			audio.loop = true;
			audio.Play();
			updating = false;
		}
	}
	else{
		if(audio.volume < 1 ){
			audio.volume = audio.volume + (Time.deltaTime / (approxSecondsToFade + 1));
		}
		else {
			audio.volume = 1;
			ready = false;
		}
	}
}

function ChangeToDie() {
	if(!ready){
		Debug.Log("CHANGE TO DIE");
		ready = true;
		updating = true;
		toDie = true;
	}
}

function ChangeToNormal() {
	if(!ready){
		Debug.Log("CHANGE TO NORMAL");
		ready = true;
		updating = true;
		toDie = false;
	}
}