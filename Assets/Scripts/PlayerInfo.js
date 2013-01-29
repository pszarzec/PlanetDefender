#pragma strict

public var PlayerMoney : int;
public var PlayerPoints : int;

public var CurrentLevel : int; //current game level we can use this to select difficulty or seed 

public var PlayerMoneyLabel : GUIText;
public var PlayerPointsLabel : GUIText; 
public var PlanetLifeLabel : GUIText;

public var LoseLabel : GUIText;
public var CompleteLabel : GUIText;

private var GlobalScr : GLOBAL;

private var NextRequiredPoints : int;


private var PlanetLife : int;
private var lockDieSound : boolean = true; 
 
function Start () {
	PlayerMoney = 500;
	
	PlayerPoints = 0;
	CurrentLevel = 1;
	NextRequiredPoints = 1200;
	
	GlobalScr = GameObject.Find("GLOBAL").GetComponent(GLOBAL); 
	PlanetLife = GlobalScr.planetHealthPercentage * 100;
}

function ResetStats() {
	PlayerMoney = 500;
	PlayerPoints = 0; 
	PlanetLife = GlobalScr.planetHealthPercentage * 100;
	CurrentLevel = 1;
	NextRequiredPoints = 1200;
	
	lockDieSound  = true;
	CloseLabels();
}

function cleanAllScene()
{
	var cObj : GameObject = null; 
	var allenemy : GameObject [] = GameObject.FindGameObjectsWithTag("DefaultEnemyTag");
	
	for(var i:int = 0; i < allenemy.Length; i++){
		cObj = allenemy[i];
		Destroy(cObj);
	}
	
	var allMachine : GameObject [] = GameObject.FindGameObjectsWithTag("EnemyWithMachineGun");
	
	for(i = 0; i < allMachine.Length; i++){
		cObj = allMachine[i];
		Destroy(cObj);
	} 
	
	var allGold : GameObject [] = GameObject.FindGameObjectsWithTag("GoldEnemyTag");
	
	for(i = 0; i < allGold.Length; i++){
		cObj = allGold[i];
		Destroy(cObj);
	} 
	
	var allGifs : GameObject [] = GameObject.FindGameObjectsWithTag("GiftsTag");
	
	for(i = 0; i < allGifs.Length; i++){
		cObj = allGifs[i];
		Destroy(cObj);
	} 
}

function Update() { 
	PlanetLife = Mathf.Clamp(GlobalScr.planetHealthPercentage * 100,0.0,100);
	
	var Saturation : ColorCorrectionCurves = Camera.mainCamera.GetComponent(ColorCorrectionCurves);
	var clampHealt : float =  Mathf.Clamp(GlobalScr.planetHealthPercentage,0.0,1.0);
	Saturation.saturation = clampHealt;
	
	if((clampHealt < 0.35) && lockDieSound){
		lockDieSound = false;
		Camera.mainCamera.GetComponent(CameraSoundChange).SendMessage("ChangeToDie");
	}
	
	
	PlayerMoneyLabel.text = "Money: " + PlayerMoney;
	PlayerPointsLabel.text = "Points: " + PlayerPoints;
	PlanetLifeLabel.text = "Planet life: " + PlanetLife + "/100";
	 
	if((GlobalScr.GameState != GameState.GameLose) && (GlobalScr.GameState != GameState.GameWon)){
		if(GlobalScr.planetHealthPercentage  <= 0.0){
			GlobalScr.planetHealthPercentage = 1.0;
			
			GlobalScr.GameState = GameState.GameLose;
			LoseLabel.active = true; 
			
			GlobalScr.LockPlanetRotation(true);
			GlobalScr.LockEnemiesSpawner(true);
		
			cleanAllScene();
			
			
				lockDieSound = true;
				Camera.mainCamera.GetComponent(CameraSoundChange).SendMessage("ChangeToNormal");
			
		}
	
		if(PlayerPoints >= NextRequiredPoints){
			GlobalScr.GameState = GameState.GameWon;
			CompleteLabel.active = true;
			 
			GlobalScr.LockPlanetRotation(true);
			GlobalScr.LockEnemiesSpawner(true);
		 
			cleanAllScene();
			
			
				lockDieSound = true;
				Camera.mainCamera.GetComponent(CameraSoundChange).SendMessage("ChangeToNormal");
			
			
			PlayerMoney += 500; // stala wartosc gotowki dodawana z kazdym kolejnym levelem
			
			CurrentLevel++;
			
			switch(CurrentLevel){
				case 1 : 
				
					NextRequiredPoints = 1200;
			
				break;
				
				case 2 : 
					
					NextRequiredPoints = 15000;
				
				break;
				
				case 3 : 
					
					NextRequiredPoints = 30000;
				
				break;
				
				case 4 : 
					
					NextRequiredPoints = 45000;
				
				break;
				
				case 5 : 
				
					Application.LoadLevel("Menu");
				
				break;
				
			}
		}
	}	

}

function CloseLabels() {
	LoseLabel.active = false;
	CompleteLabel.active = false;
}

