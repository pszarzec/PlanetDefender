#pragma strict

public var ParticleExplo : GameObject;

public var SmokeEmit : GameObject;
private var ChoosenAxis : Vector3;
public var DestroySound : AudioClip;
public var DieSound : AudioClip;

function Start () {
	ChoosenAxis = Vector3(Random.value,Random.value,Random.value);
	ChoosenAxis.Normalize();
}

function Update () {
	var speed = GetComponent(EnemyProperties).Speed;
	var attackDirection = -transform.position;
	attackDirection.Normalize();
	
	transform.position += attackDirection*speed;
	transform.rotation *= Quaternion.AngleAxis(Random.value*5.0,ChoosenAxis);
}

function ApplyDamage(damage : float)
{
	Debug.Log("" + GetComponent(EnemyProperties).Health);
	GetComponent(EnemyProperties).Health -= damage;
	
	if(GetComponent(EnemyProperties).Health < 0)
	{
		AudioSource.PlayClipAtPoint(DieSound, transform.position);
		Destroy(gameObject); 
		Instantiate(ParticleExplo,transform.position,Quaternion(0,0,0,0));  
	}
}

function OnTriggerEnter (other : Collider) {

	if(other.tag == "TurretTag")
	{
		Camera.mainCamera.SendMessage("Shake");
		GameObject.Find("TurretSelector").GetComponent(TurretSelector).RemoveTurret(other.name);
		
		AudioSource.PlayClipAtPoint(DestroySound, transform.position); 	
    	Instantiate(ParticleExplo,other.gameObject.transform.position,Quaternion(0,0,0,0));    	    	
    	
		Destroy(other.gameObject);
		Destroy(gameObject);
		
		Instantiate(ParticleExplo,transform.position,Quaternion(0,0,0,0));  
	}
}