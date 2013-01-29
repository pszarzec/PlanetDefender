#pragma strict
public var EnemyPrefab : GameObject;
public var EnemyWithMachineGunPrefab : GameObject;

public var GoldPrefab : GameObject;
public var GoldDropProbability : float;

public var HealthGiftPrefab : GameObject;
public var EnemyAutoAttackGiftPrefab : GameObject;

private var ElapsedTimeInSeconds : float = 0.0;
public var NewEnemySpawnWait : float = 5.0;

@HideInInspector
public var EnemySpawningLocked : boolean = false;

private var NormalEnemiesRespawnedCount : int = 0;
private var RespawnMachinegunEvery : int = 3;
private var MachinegunEvery : int = 0;

private var ObjectsRespawnsCount : int = 0;
private var RespawnGiftEvery : int = 1;
private var GiftEvery : int = 0;



private var PlayerInfoScr : PlayerInfo;
private var LastUpdateLevelNr : int = 0;
function Start () {
	PlayerInfoScr = GameObject.Find("PlayerObject").GetComponent(PlayerInfo);
}

function Update () {

	if(EnemySpawningLocked == true)
		return;
	var LevelChanged : boolean = false;
	
	if(LastUpdateLevelNr != PlayerInfoScr.CurrentLevel)
	{
		LastUpdateLevelNr = PlayerInfoScr.CurrentLevel;
		LevelChanged = true;
	}
	
	ElapsedTimeInSeconds += Time.deltaTime;

	if(PlayerInfoScr.CurrentLevel == 1)
	{
		RespawnMachinegunEvery = 9999;
		RespawnGiftEvery = 9999;
		
		NewEnemySpawnWait = 4.5;
		//FirstLevelUpdate();
	}
	else if(PlayerInfoScr.CurrentLevel == 2)
	{
		RespawnMachinegunEvery = 3;
		RespawnGiftEvery = 2;
		NewEnemySpawnWait = 4.0;
		//FirstLevelUpdate();
	}
	else if(PlayerInfoScr.CurrentLevel == 3)
	{
		RespawnMachinegunEvery = 2;
		RespawnGiftEvery = 1;
		NewEnemySpawnWait = 4.0;
		//ThirdAndMoreLevelUpdate();
	}else if(PlayerInfoScr.CurrentLevel == 4)
	{
		RespawnMachinegunEvery = 1;
		RespawnGiftEvery = 1;
		NewEnemySpawnWait = 4.0;
		//ThirdAndMoreLevelUpdate();
	}
		
	//NewEnemySpawnWait = 0.1;
	
	if(MachinegunEvery == 0 || LevelChanged)
		MachinegunEvery = RespawnMachinegunEvery;
		
	if(GiftEvery == 0 || LevelChanged)
		GiftEvery = RespawnGiftEvery;
		
	if(ElapsedTimeInSeconds > NewEnemySpawnWait)
	{
		ElapsedTimeInSeconds = 0.0;
		
		var pos : Vector3;
		pos = Vector3(Random.value,Random.value,0.0)*2.0 - Vector3(1.0,1.0,0.0);
		pos.Normalize();
		
		var minDistance : float = 3.0;
		var distanceFactorFromPlanet = minDistance + Random.value*2.0;
		var planetSize = GameObject.Find("Planet").transform.localScale.x * 0.5;
		pos = pos * planetSize * distanceFactorFromPlanet;;//pos.z = 0;
		
		if(ObjectsRespawnsCount < GiftEvery )
		{
			ObjectsRespawnsCount++;
			
			// respawn normal object
			if(NormalEnemiesRespawnedCount < MachinegunEvery)
			{
				NormalEnemiesRespawnedCount++;
				Instantiate(EnemyPrefab,pos,Quaternion.identity);
			}else
			{
				MachinegunEvery = Random.value * RespawnMachinegunEvery*2.0 + RespawnMachinegunEvery;
				NormalEnemiesRespawnedCount = 0;
				Instantiate(EnemyWithMachineGunPrefab,pos,Quaternion.identity);
			}
			
		}else
		{
			GiftEvery = Random.value * RespawnGiftEvery + RespawnGiftEvery;
			ObjectsRespawnsCount = 0;
			
			// respawn gift
			var RandomVal = Random.value;
			
			var GoldPropobality = 0.4;
			var HealthPropobality = 0.5;
			var EnemyAutoPropobality = 0.1;
			
			if(RandomVal > 0.0 && RandomVal <= GoldPropobality)
			{
				Instantiate(GoldPrefab,pos,Quaternion.identity);
			}else if(RandomVal > GoldPropobality && RandomVal <= GoldPropobality + HealthPropobality)
			{
				// try again this time with present
				Instantiate(HealthGiftPrefab,pos,Quaternion.identity);
			}else if(RandomVal > GoldPropobality + HealthPropobality && RandomVal <= GoldPropobality + HealthPropobality  + EnemyAutoPropobality)
			{
				// and again with new present
				Instantiate(EnemyAutoAttackGiftPrefab,pos,Quaternion.identity);
			}
		}
			
	}
	
	LevelChanged = false;
}

function FirstLevelUpdate()
{
}


function SecondLevelUpdate()
{
}


function ThirdAndMoreLevelUpdate()
{
}