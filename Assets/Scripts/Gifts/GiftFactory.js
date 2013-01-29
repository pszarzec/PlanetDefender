#pragma strict

enum GIFT_TYPE
{
	HEALTH,
	AUTO_ATTACK,
	
	_GIFT_COUNT
}

public var GiftType : GIFT_TYPE = GIFT_TYPE.HEALTH;

function OnTriggerEnter (other : Collider) {
	if(other.tag == "PlayerBulletTag")
	{
		if(GiftType == GIFT_TYPE.HEALTH)
		{
			GameObject.Find("Planet").GetComponent(PlanetProperties).PlanetHP += 100;
			if(GameObject.Find("Planet").GetComponent(PlanetProperties).PlanetHP > 1000)
				GameObject.Find("Planet").GetComponent(PlanetProperties).PlanetHP = 1000;
    		Destroy(gameObject);
    		
    		Camera.mainCamera.SendMessage("ShakeLow");
    		
    	}else if(GiftType == GIFT_TYPE.AUTO_ATTACK)
    	{
    		var objects = GameObject.FindGameObjectsWithTag("TurretTag");
			//var objectCount = objects.Length;
			
			for(var obj in objects) {
			    obj.GetComponent(TurretDragandDrop).EnableAutoShooting = true;
			}
			
			Destroy(gameObject);
    	}
    }
}
