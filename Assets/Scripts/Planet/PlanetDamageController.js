#pragma strict

public var ParticleExplo : GameObject;
public var ParticleFire : GameObject;
private var PlayerInfoScr : PlayerInfo;
public var sound : AudioClip;
public var PlanetDamageOnEnemyCrash : float;

function Start () {
	PlayerInfoScr = GameObject.Find("PlayerObject").GetComponent(PlayerInfo);
}

function Update () {

}

function OnTriggerEnter (other : Collider) {
	if(other.tag == "DefaultEnemyTag" || other.tag == "EnemyWithMachineGun")
	{
		// kazde rozbicie powoduje odjecie 100 hp
		GetComponent(PlanetProperties).PlanetHP -= PlanetDamageOnEnemyCrash;
    	Camera.mainCamera.SendMessage("Shake");
	   	Instantiate(ParticleExplo,other.transform.position,Quaternion(0,0,0,0));  
	   
		AudioSource.PlayClipAtPoint(sound, transform.position);
    
    	Destroy(other.gameObject);
    
    }else if(other.tag == "GoldEnemyTag" || other.tag == "GiftsTag")
	{
    	Destroy(other.gameObject);
    	//Debug.Log("Uusunolem");
    }
}