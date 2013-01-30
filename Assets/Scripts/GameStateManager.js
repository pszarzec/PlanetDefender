#pragma strict

private var GlobalScr : GLOBAL;

private enum GameState
{
	GamePrepare,
	GameStart,
	GameAwaiting,
	GameWon, //you pass the level
	GameLose, //you fail the level 
	
	GameStatesCount
};

public var OldGameState :GameState = GameState.GameStatesCount;
public var TurretSpawner :GameObject;
public var Player : PlayerInfo;
public var MainGUI : GameObject;

public var info1 : GUITexture;
public var info2 : GUITexture;
public var info3 : GUITexture;
	
function Start () {
	GlobalScr = GameObject.Find("GLOBAL").GetComponent(GLOBAL);
	
			info1.transform.position.x -= 100;
		info2.transform.position.x -= 100;
		info3.transform.position.x -= 100;
}

function Update () {
	if(OldGameState != GlobalScr.GameState)
	{
		OldGameState = GlobalScr.GameState;
		
		switch(GlobalScr.GameState)
		{
		case GameState.GamePrepare:
			EnterToGamePrepareState();
		break;
		
		case GameState.GameStart:
			EnterToGameStartState();
		break;
		
		case GameState.GameAwaiting:
			EnterToGameAwaitingState();
		break;
		
//		case GameState.GameWon:
//			EnterWinGameState();
//		break;
//		
//		case GameState.GameLose:
//			EnterLostGameState();
//		break;
		
		}
	}
	else if( ((GlobalScr.GameState == GameState.GameWon) ||
			 (GlobalScr.GameState == GameState.GameLose)) 
			 && ((Input.GetKeyUp(KeyCode.Return)) || (Input.GetKey(KeyCode.JoystickButton7)) )){
	
	
		if(GlobalScr.GameState == GameState.GameWon){
			EnterWinGameState();
		}
		
		if(GlobalScr.GameState == GameState.GameLose){
			EnterLostGameState();
		}
	}
}

function removeAllTurrets()
{
	var AllTurets : GameObject[] = GameObject.FindGameObjectsWithTag("TurretTag");
	var	turretSelectorSrc :TurretSelector = GameObject.Find("TurretSelector").GetComponent(TurretSelector);
	var cObj : GameObject = null; 
	 
	for(var i:int = 0; i < AllTurets.Length; i++){
		cObj = AllTurets[i];
		turretSelectorSrc.RemoveTurret(cObj.name);
		Destroy(cObj);
	}
}

function EnterLostGameState(){
	//Debug.Log("ENTER LOST GAME STATE");
	Player.ResetStats();
	Player.CloseLabels();
	TurretSpawner.active = true;
	MainGUI.active = true;
	removeAllTurrets();
	
	GlobalScr.ResetPlanet();
	GlobalScr.GameState  = GameState.GamePrepare;
	TurretSpawner.SendMessage("SpawnTurret",0);
}

function EnterWinGameState(){
	//Debug.Log("ENTER WIN GAME STATE");
	Player.CloseLabels();
	TurretSpawner.active = true;
	MainGUI.active = true;
	//removeAllTurrets();	
	
	var AllTurets : GameObject[] = GameObject.FindGameObjectsWithTag("TurretTag");
	var	turretSelectorSrc :TurretSelector = GameObject.Find("TurretSelector").GetComponent(TurretSelector);
	var cObj : GameObject = null; 
	 
	for(var i:int = 0; i < AllTurets.Length; i++){
		cObj = AllTurets[i];
		turretSelectorSrc.RemoveTurret(cObj.name);
	}
	
	GlobalScr.GameState  = GameState.GamePrepare;
	//TurretSpawner.SendMessage("SpawnTurret",0);
}

function EnterToGamePrepareState()
{
	GlobalScr.LockPlanetRotation(true);
	GlobalScr.LockEnemiesSpawner(true);
	//Debug.Log("PREPARE");
	// Włączanie spawnera od wierzyczek.
	TurretSpawner.active = true;
	
	ShowInfo(true);
}

function ShowInfo(tak :boolean)
{
	if(tak == true)
	{
		info1.transform.position.x += 100;
		info2.transform.position.x += 100;
		info3.transform.position.x += 100;
	}
	else
	{
		info1.transform.position.x -= 100;
		info2.transform.position.x -= 100;
		info3.transform.position.x -= 100;
	}
}

function EnterToGameStartState()
{
	GlobalScr.LockPlanetRotation(false);
	GlobalScr.LockEnemiesSpawner(false);
	
	// Koloruje zaznaczenie.
	var	turretSelectorSrc :TurretSelector = GameObject.Find("TurretSelector").GetComponent(TurretSelector);
	turretSelectorSrc.ApplySelection();
	
	//Dołancza do planety wszystkie wierze.
	TurretSpawner.SendMessage("CheckTurrets");
	
	SortTurrets();
	
	TurretSpawner.active = false;
	ShowInfo(false);

}

function EnterToGameAwaitingState()
{
	var AllTurets : GameObject[] = GameObject.FindGameObjectsWithTag("TurretTag");
	var	turretSelectorSrc :TurretSelector = GameObject.Find("TurretSelector").GetComponent(TurretSelector);
	var config : CONFIG = GameObject.Find('CONFIG').GetComponent(CONFIG);
	
	//Debug.Log("EnterToGameAwaitingState...");
	
	var idx : int = 0; 
	for(var obj : GameObject in AllTurets){ 
	
		if(MainGUI.GetComponent(GUI_Main).SelectedPlayersCount == 1){
				if(idx == 0)
				{
					turretSelectorSrc.AddNewTurretAtEnd(obj.name, config.PlayerOne);
				}
				else
				{
					turretSelectorSrc.AddNewTurretAtEnd(obj.name, null);
				}
		}
		else{
				if(idx == 0)
				{
					turretSelectorSrc.AddNewTurretAtEnd(obj.name, config.PlayerOne);
				}
				else if(idx == 1)
				{
					turretSelectorSrc.AddNewTurretAtEnd(obj.name, config.PlayerTwo);
				}
				else
				{
					turretSelectorSrc.AddNewTurretAtEnd(obj.name, null);
				}
	
		} 
		
		idx++;
	} 
	
	//Debug.Log("DODANO" + idx);
	
	//yield WaitForSeconds(1.0);
	GlobalScr.GameState = GameState.GameStart;
	
	//DumapTab();
	MainGUI.active = false;
}

private function SortTurrets()
{    
    var table :ArrayList = GlobalScr.TurretSelections;
    var swapped;    
	
	//Debug.Log("SORTING");
	//Debug.Log("Before sort: ");	
	//DumapTab();
		
    do {
        swapped = false;
        for (var i=0; i < table.Count - 1; i++) 
        {     
        	var obj :TurretDragandDrop = GameObject.Find((table[i] as TurretSelect).objName)
        		.GetComponent(TurretDragandDrop);
        	var obj2 :TurretDragandDrop = GameObject.Find((table[i+1] as TurretSelect).objName)
        		.GetComponent(TurretDragandDrop);        	
        	   	
	         if (obj.ThetaPI > obj2.ThetaPI)            	
            {
                var temp = table[i];
                //(temp as TurretSelect).index = (table[i] as TurretSelect).index;
                
                table[i] = table[i+1];
                (table[i] as TurretSelect).index = i;
                
                //(table[i] as TurretSelect).index = (table[i+1] as TurretSelect).index;
                
                table[i+1] = temp;
                (table[i + 1] as TurretSelect).index = i + 1;
                
                //(table[i+1] as TurretSelect).index = (temp as TurretSelect).index;
                
                swapped = true;
            }
        }
    } while (swapped);	
    
    //Debug.Log("After sort: ");
	//DumapTab();
}

function DumapTab()
{
	for(var t :TurretSelect in GlobalScr.TurretSelections)
	{
		Debug.Log("Name: " + t.objName + " Index: " + t.index + " Use: " + t.use);
	}
}