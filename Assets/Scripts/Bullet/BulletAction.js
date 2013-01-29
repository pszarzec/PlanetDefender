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
	//Debug.DrawLine(transform.position,transform.position+transform.forward*10.0,Color.red,0,false);
	
	ElapsedTime += Time.deltaTime;
	// z palca - brak czasu
	var limit : float = Mathf.Lerp(100,250,Mathf.Abs(transform.up.y));
	if(ElapsedTime > BullProperties.BulletLifeTime || transform.position.magnitude > limit)
		Destroy(gameObject);
}

function OnTriggerEnter (other : Collider) {
	
	if(other.tag == "EnemyWithMachineGun")
	{
		other.GetComponent(EnemyWithMachinegunControler).ApplyDamage(BullProperties.BulletDamage);
		PlayerInfoScr.PlayerPoints += 220;
		
		Destroy(gameObject);
		Camera.mainCamera.SendMessage("ShakeLow");
		Instantiate(ParticleBulletExplo,transform.position,Quaternion(0,0,0,0));  
	}else
	if(other.tag == "DefaultEnemyTag")
	{
		other.GetComponent(EnemyController).ApplyDamage(BullProperties.BulletDamage);
		PlayerInfoScr.PlayerPoints += 50;
		
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