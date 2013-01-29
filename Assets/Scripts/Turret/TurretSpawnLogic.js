#pragma strict

public var prefab : GameObject;
public var prefab2 : GameObject;
public var prefab3 : GameObject;
public var Planet : GameObject;
public var Distance : float = 15;

private var Scale : float;
private var current : GameObject = null;
private var posX : float;
private var posY : float;
private var rot : float;
private var theta : float;

private var config : CONFIG;
private var myClass : TurretDragandDrop;
private var turretSelector : TurretSelector;

private var isSelectMode : boolean;
private var AllTurets : GameObject[];

private var index : int = 0;

private static var turretCount : int = 0;
private var MainPlayer : GameObject;
private var MainGUI : GUI_Main;

function Start () {
	current = null;
	posX = 0;
	posY = 0;
	rot = 0;
	theta = 0; 
	Scale = Planet.GetComponent(SphereCollider).radius * Planet.transform.localScale.x + Distance;
	
	isSelectMode = false;
	
	config = GameObject.Find('CONFIG').GetComponent(CONFIG);
	
	turretSelector = GameObject.Find("TurretSelector").GetComponent(TurretSelector);
	SpawnTurret(0);
	
	MainPlayer = GameObject.Find("PlayerObject");
	MainGUI = GameObject.Find("GUI").GetComponent(GUI_Main);
}

function Update () {

	if(isSelectMode){
			if(Input.GetKeyUp(KeyCode.Escape) || Input.GetKeyUp(KeyCode.Joystick1Button3)){
				DisableSelectMode();
				current = null;
			} 
			
			if(Input.GetKeyUp(KeyCode.LeftArrow) || Input.GetKeyUp(KeyCode.Joystick1Button4)){
				GetPrevious();
			}
			
			if(Input.GetKeyUp(KeyCode.RightArrow) || Input.GetKeyUp(KeyCode.Joystick1Button5)){
				GetNext();
			}
			
			if(Input.GetKeyUp(KeyCode.Space) || Input.GetKeyUp(KeyCode.Joystick1Button2)){
				
				current.transform.parent = null;
		
				posX = Mathf.Sin(theta) * Scale;
				posY = Mathf.Cos(theta) * Scale;
				current.transform.position = Vector3(posX,posY,0);
				
				DisableSelectMode();			
			}
	}
	else{
			if(Input.GetKeyUp(KeyCode.E) || Input.GetKeyUp(KeyCode.Joystick1Button3)){
				EnableSelectMode();
				SelectFirstTurret();
			}
			
			if(Input.GetKeyUp(KeyCode.Escape) || Input.GetKeyUp(KeyCode.Joystick1Button0)){
				if(current && (AllTurets.Length > 1)){
					MainPlayer.GetComponent(PlayerInfo).PlayerMoney += 80;
				
					//turretSelector.RemoveTurret(current.name);
					Destroy(current);
					current = null;
				}
			} 
	
			if(Input.GetKeyUp(KeyCode.LeftShift) || Input.GetKeyUp(KeyCode.Joystick1Button1)){
				if(current == null){
				
					switch( MainGUI.TurretType ){
						case 0 : 
							if(MainPlayer.GetComponent(PlayerInfo).PlayerMoney >= 100)
							{
					 			SpawnTurret(0);
								MainPlayer.GetComponent(PlayerInfo).PlayerMoney -= 100;
							}
						
							break;
							
						case 2 : 
							if(MainPlayer.GetComponent(PlayerInfo).PlayerMoney >= 150){
					 			SpawnTurret(1);
								MainPlayer.GetComponent(PlayerInfo).PlayerMoney -= 150;
							}
						
							break;
							
						case 1 : 
							if(MainPlayer.GetComponent(PlayerInfo).PlayerMoney >= 200){
					 			SpawnTurret(2);
								MainPlayer.GetComponent(PlayerInfo).PlayerMoney -= 200;
							}
						
							break;
					}
				
					
				}
			}
			
			if(Input.GetKeyUp(KeyCode.Space) || Input.GetKeyUp(KeyCode.Joystick1Button2)){
				if(current) PutPrefabOnPlanet();
				current = null;
			}
			
			if(current)
			{	
				if(Input.GetAxis("Horizontal-Key"))			
				{
					var axisKey : float = Input.GetAxis("Horizontal-Key");
					
					if(axisKey < 0)
					{
						MoveLeft();
					}
					else if(axisKey > 0)
					{
						MoveRight();
					}
				}
				
				if(Input.GetAxis("Horizontal-Pad1"))
				{
					var axisPad1 : float = Input.GetAxis("Horizontal-Pad1");
					
					if(axisPad1 < 0)
					{
						MoveLeft();
					}
					else if(axisPad1 > 0)
					{
						MoveRight();
					}
				}
			}
	}	
}

function SpawnTurret(type : int ) {
	theta = Mathf.PI * rot / 180.0f;
	posX = Mathf.Sin(theta) * Scale;
	posY = Mathf.Cos(theta) * Scale;
	
	if(type == 0){
		current = Instantiate(	prefab,
							Vector3(posX,posY,0),
							Quaternion(0,0,0,0));
	}
	else if(type == 1){
		current = Instantiate(	prefab2,
							Vector3(posX,posY,0),
							Quaternion(0,0,0,0));
	}
	else if(type == 2){
		current = Instantiate(	prefab3,
							Vector3(posX,posY,0),
							Quaternion(0,0,0,0));
	}
							
	myClass = current.GetComponent(TurretDragandDrop);
	myClass.planet = Planet;
	
	var name :String = "turret_" + turretCount;
	
	current.name = name;
		
	turretCount += 1;
}

function PutPrefabOnPlanet() {
	var UnitSize : float = Scale - Distance + (current.transform.localScale.x*0.5);
	posX = Mathf.Sin(theta) * UnitSize;
	posY = Mathf.Cos(theta) * UnitSize;
	
	current.transform.position = Vector3(posX,posY,0);
	current.transform.parent = Planet.transform;
	current.GetComponent(TurretDragandDrop).ThetaPI = theta;
}

function MoveLeft() {
	rot += 1;
	if(rot == 360) rot = 0;

	theta = Mathf.PI * rot / 180.0f;
	posX = Mathf.Sin(theta) * Scale;
	posY = Mathf.Cos(theta) * Scale;
	
	current.transform.position = Vector3(posX,posY,0);
}

function MoveRight() {
	rot -= 1;
	if(rot == 0) rot = 360;
	
	theta = Mathf.PI * rot / 180.0f;
	posX = Mathf.Sin(theta) * Scale;
	posY = Mathf.Cos(theta) * Scale;
	
	current.transform.position = Vector3(posX,posY,0);
}

function EnableSelectMode(){
	isSelectMode = true;
}

function DisableSelectMode(){
	current.renderer.material.color = Color.white;
	isSelectMode = false;
}

function SelectFirstTurret() {
	AllTurets = GameObject.FindGameObjectsWithTag("TurretTag");
	
	if(AllTurets.Length == 0) {
		DisableSelectMode();
	}
	else{
		index = 0;
		current = AllTurets[0];
		current.renderer.material.color = Color.red;
	}
}

function GetNext()
{
	index++;
	if(index == AllTurets.Length) index = 0;
	
	current.renderer.material.color = Color.white;
	
	current = AllTurets[index];
	current.renderer.material.color = Color.red;
}

function GetPrevious()
{
	index--;
	if(index <= 0) index = AllTurets.Length - 1;
	
	current.renderer.material.color = Color.white;
	
	current = AllTurets[index];
	current.renderer.material.color = Color.red;
}

function CheckTurrets()
{
	if(current){
		if(current.transform.parent == null){
			PutPrefabOnPlanet();
		}
	} 

	Debug.Log("Check Status!!!");
}

