#pragma strict
public var ParticleBulletExplo : GameObject;
private var BullProperties : BulletProperties;
private var ElapsedTime : float = 0.0;
private var InitialDirDeviation : Vector3;
function Start () {
	BullProperties = GetComponent(BulletProperties);
	InitialDirDeviation = Vector3(Random.value,Random.value,0.0)*0.5;
}

function Update () {
	var dir : Vector3 = -transform.position;
	dir.Normalize();
	dir += InitialDirDeviation;
	dir.Normalize();
	transform.position += dir * BullProperties.BulletSpeed * Time.deltaTime;
	
	ElapsedTime += Time.deltaTime;
	
	if(ElapsedTime > BullProperties.BulletLifeTime)
		Destroy(gameObject);
}

function OnTriggerEnter (other : Collider) {
	
	if(other.name == "Planet")
	{
		other.GetComponent(PlanetProperties).PlanetHP -= BullProperties.BulletDamage;
		Destroy(gameObject);
		Instantiate(ParticleBulletExplo,transform.position,Quaternion(0,0,0,0));  
	}else if(other.tag == "TurretTag")
	{
		other.GetComponent(TurretDragandDrop).DecreaseHP(BullProperties.BulletDamage);
		Instantiate(ParticleBulletExplo,transform.position,Quaternion(0,0,0,0));  
	}
}