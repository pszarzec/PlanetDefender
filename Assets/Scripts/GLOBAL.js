#pragma strict
/*
	GLOBAL - powinien trzymać wszystkie zmiene potrzebne do komunikacji miedzy obiektami.
*/


// used to get planet health state
@HideInInspector
public var planetHealthState : PlanetHealthState = PlanetHealthState.MAX_HP;;
@HideInInspector
public var planetHealthPercentage : float = 1.0;

//Okreslaja nazwe obiektu(wierzyczki) która aktualnie 
//zaznaczył dany gracz.
@HideInInspector
var TurretSelections = new ArrayList();

private var config :CONFIG;
private var turretSelectorSrc :TurretSelector;
private var planetRotationScr : PlanetRotation;
private var enemySpawnerScr : EnemySpawner;

public var GameState :GameState = GameState.GamePrepare;
	
function Start () 
{
	config = GameObject.Find('CONFIG').GetComponent(CONFIG);
	planetRotationScr = GameObject.Find("Planet").GetComponent(PlanetRotation);
	enemySpawnerScr = GameObject.Find("EnemySpawner").GetComponent(EnemySpawner);
	
	turretSelectorSrc = GameObject.Find("TurretSelector").GetComponent(TurretSelector);
	turretSelectorSrc.ApplySelection();
}

function ResetPlanet()
{
	GameObject.Find("Planet").GetComponent(PlanetStateControler).ResetPlanetProperties();
}

function Update () 
{
	if(GameState == GameState.GameStart)
	{
		var actualTurret :TurretSelect = turretSelectorSrc.GetActualSelectedTurret(config.PlayerOne);
		
		if(actualTurret != null)
		{
			var actualTurretObj :TurretDragandDrop = 
				GameObject.Find(actualTurret.objName).GetComponent(TurretDragandDrop);
			
			if(Input.GetKeyUp(KeyCode.Joystick1Button2) || Input.GetKeyUp(KeyCode.Space))
			{
				actualTurretObj.Shoot();
			}
			
			var axisPlayerOneKey :float = Input.GetAxis("Horizontal-Key");
			
			if(axisPlayerOneKey)
			{
				actualTurretObj.MoveTurret(axisPlayerOneKey);
			}
			
			var axisPlayerOnePad :float = Input.GetAxis("Horizontal-Pad1");
			
			if(axisPlayerOnePad)
			{
				actualTurretObj.MoveTurret(axisPlayerOnePad);
			}
			
			if(Input.GetKeyUp(KeyCode.Joystick1Button4) || Input.GetKeyUp(KeyCode.DownArrow))
			{	
				//Debug.Log("Player 1 - down - LB ");
				turretSelectorSrc.ChangeSelection(config.PlayerOne, true);
			}
				
			if(Input.GetKeyUp(KeyCode.Joystick1Button5) || Input.GetKeyUp(KeyCode.UpArrow))
			{
				//Debug.Log("Player 1 - down - RB ");
				turretSelectorSrc.ChangeSelection(config.PlayerOne, false);
			}
		}
		//--------------- PLAYER TWO ---------------------//
		
		var actualTurretTwo :TurretSelect = turretSelectorSrc.GetActualSelectedTurret(config.PlayerTwo);
		
		if(actualTurretTwo != null)
		{
			var actualTurretObjTwo :TurretDragandDrop = 
				GameObject.Find(actualTurretTwo.objName).GetComponent(TurretDragandDrop);
			
			if(Input.GetKeyUp(KeyCode.Joystick2Button2) || Input.GetKeyUp(KeyCode.Space))
			{
				actualTurretObjTwo.Shoot();
			}
			
			var axisPlayerTwo :float = Input.GetAxis("Horizontal-Pad2");
			
			if(axisPlayerTwo)
			{
				actualTurretObjTwo.MoveTurret(axisPlayerTwo);
			}
			
			if(Input.GetKeyUp(KeyCode.Joystick2Button4) || Input.GetKeyUp(KeyCode.LeftArrow))
			{	
				//Debug.Log("Player 1 - down - LB ");
				turretSelectorSrc.ChangeSelection(config.PlayerTwo, true);
			}
				
			if(Input.GetKeyUp(KeyCode.Joystick2Button5) || Input.GetKeyUp(KeyCode.RightArrow))
			{
				//Debug.Log("Player 1 - down - RB ");
				turretSelectorSrc.ChangeSelection(config.PlayerTwo, false);
			}
		}
	}
}

// true to lock, false to unlock
function LockPlanetRotation( RotationLock : boolean)
{
	planetRotationScr.PlanetRotationLoced = RotationLock;
}

function LockEnemiesSpawner(SpawningLock : boolean)
{
	enemySpawnerScr.EnemySpawningLocked = SpawningLock;
}