#pragma strict
public var ParticleBulletExplo : GameObject;
private var BullProperties : BulletProperties;
private var ElapsedTime : float = 0.0;
private var PlayerInfoScr : PlayerInfo;

function Start () {
	BullProperties = GetComponent(BulletProperties);
	PlayerInfoScr = GameObject.Find("PlayerObject").GetComponent(PlayerInfo);
}

function Update () {
	transform.position += transform.forward * BullProperties.BulletSpeed * Time.deltaTime;
	
	ElapsedTime += Time.deltaTime;
	
	if(ElapsedTime > BullProperties.BulletLifeTime)
		Destroy(gameObject);
}

function OnTriggerEnter (other : Collider) {
	
	if(other.tag == "EnemyWithMachineGun")
	{
		other.GetComponent(EnemyWithMachinegunControler).ApplyDamage(BullProperties.BulletDamage);
		PlayerInfoScr.PlayerPoints += 100;
		
		Destroy(gameObject);
		
		Camera.mainCamera.SendMessage("ShakeLow");
		Instantiate(ParticleBulletExplo,transform.position,Quaternion(0,0,0,0));  
	}else
	if(other.tag == "DefaultEnemyTag")
	{
		other.GetComponent(EnemyController).ApplyDamage(BullProperties.BulletDamage);
		PlayerInfoScr.PlayerPoints += 80;
		
		Destroy(gameObject);
		
		Camera.mainCamera.SendMessage("ShakeLow");
		Instantiate(ParticleBulletExplo,transform.position,Quaternion(0,0,0,0)); 
	}else if(other.tag == "GoldEnemyTag")
	{
		PlayerInfoScr.PlayerMoney += other.gameObject.GetComponent(EnemyProperties).MaxGold;
		
		Destroy(other.gameObject);
		
		Destroy(gameObject);
		
		Camera.mainCamera.SendMessage("ShakeLow");
	}
}