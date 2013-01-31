#pragma strict

//public var Style : GUIStyle;

var selGridInt :int = 0;
var selStrings :String[] = ["Ready"];
var maxButton :int = 1;

var selPlayerInt : int = 0;
var playerText : String [] = ["1Player","2Players"];

var maxButtonPlayer : int = 2;

public var SelectedPlayersCount:int=1;

/////////////////////////////////////////

var selectedTurret : int = 0;
var maxTurretSize : int = 3;
private var TurretNames : String [] = ["Basic","Extended","Double"];
public var TurretType: int = 0;

//////////////////////////////////////////

private var playerSel: int = 1;

private var global :GLOBAL; 

function OnGUI()
{
//	selGridInt = GUI.SelectionGrid(Rect(Screen.width - (Screen.width / 4), 
//		Screen.height - ((Screen.height * 85) / 100), 100, 40), selGridInt, selStrings, 1);
		
	selPlayerInt = GUI.SelectionGrid(Rect(Screen.width - 200, 200, 100, 150), selPlayerInt, playerText, 1);
		
	selectedTurret = GUI.SelectionGrid(Rect(100, 200, 100, 225), selectedTurret, TurretNames, 1);
		
}

function Start () 
{
	global = GameObject.Find("GLOBAL").GetComponent(GLOBAL);
}

function Update () 
{
    if(Input.GetKeyUp(KeyCode.Return) || Input.GetKeyDown(KeyCode.Joystick1Button7))
    {
    	if(global.GameState == GameState.GamePrepare)
    	{
    		global.GameState = GameState.GameAwaiting;
    		selStrings[0] = "Back";
    		
    		//Debug.Log("GameState set: GameStart");
    	}
    	else if(global.GameState == GameState.GameStart)
    	{
    		global.GameState = GameState.GamePrepare;
    		selStrings[0] = "Ready";
    		
    		//Debug.Log("GameState set: GamePrepare");
    	}
    }
    
    if(Input.GetKeyUp(KeyCode.JoystickButton6))
    {
        if(selPlayerInt < (maxButtonPlayer-1))
        {
            selPlayerInt++;
        }
        else
        {
            selPlayerInt = 0;
        }
    }
    
    if(Input.GetKeyUp(KeyCode.UpArrow))
    {
        if(selPlayerInt > 0)
        {
            selPlayerInt--;
        }
        else
        {
            selPlayerInt = maxButtonPlayer - 1;
        }
    }
 
    if(Input.GetKeyUp(KeyCode.DownArrow))
    {
        if(selPlayerInt < (maxButtonPlayer-1))
        {
            selPlayerInt++;
        }
        else
        {
            selPlayerInt = 0;
        }
    }
    
    if(Input.GetKeyUp(KeyCode.Alpha1) || Input.GetKeyUp(KeyCode.Joystick1Button4))
    {
        if(selectedTurret > 0)
        {
            selectedTurret--;
        }
        else
        {
            selectedTurret = maxTurretSize - 1;
        }
    }
 
    if(Input.GetKeyUp(KeyCode.Alpha2) || Input.GetKeyUp(KeyCode.Joystick1Button5))
    {
        if(selectedTurret < maxTurretSize-1)
        {
            selectedTurret++;
        }
        else
        {
            selectedTurret = 0;
        }
    }
    
    SelectedPlayersCount = selPlayerInt+1;
    TurretType = selectedTurret;
}