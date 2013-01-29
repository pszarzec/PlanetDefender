#pragma strict
// zawiera w sobie wszystkie warunki decydujace o ruchu planety ( lewo/prawo/stop/szybkosc )



private var PlanetScr : PlanetRotation;
private var GlobalScr : GLOBAL;

var planetHealthState : PlanetHealthState = PlanetHealthState.MAX_HP;

function Start () {
	PlanetScr = GetComponent(PlanetRotation);
	GlobalScr = GameObject.Find("GLOBAL").GetComponent(GLOBAL);
}

function ResetPlanetProperties()
{
	GetComponent(PlanetProperties).PlanetHP = GetComponent(PlanetProperties).MaxPlanetHP;
	
	// to apply properties to states
	EstimatePlanetMove();
}


function Update () {
	EstimatePlanetMove();
}


function EstimatePlanetMove()
{
	HealthCondition();
}

private var HealthStatesCount : int = 4;

enum PlanetHealthState
{
	MAX_HP,
	STATE_1,
	STATE_2,
	LOW_HP
}


function HealthCondition()
{
	var HealthPercentage = GetComponent(PlanetProperties).PlanetHP /  GetComponent(PlanetProperties).MaxPlanetHP;
	GlobalScr.planetHealthPercentage = HealthPercentage;
	
	// zeby zerowy index wypadal na maxHP
	HealthPercentage = 1.0 - HealthPercentage;
	
	var StateNr : int;
	StateNr = HealthStatesCount * HealthPercentage;
	StateNr = Mathf.Clamp(StateNr,0,HealthStatesCount - 1);
	
	// stateNr <0,HealthStatesCount-1>
	planetHealthState = StateNr;
	GlobalScr.planetHealthState = planetHealthState;
	
	switch(planetHealthState)
	{
		case PlanetHealthState.MAX_HP :
			PlanetScr.RotationSpeed = 10;
			PlanetScr.DirChangeFrequency = 10.0;
			break;
		case PlanetHealthState.STATE_1 :
			PlanetScr.RotationSpeed = 12;
			PlanetScr.DirChangeFrequency = 15;
			break;
		case PlanetHealthState.STATE_2 :
			PlanetScr.RotationSpeed = 15;
			PlanetScr.DirChangeFrequency = 20;
			break;
		case PlanetHealthState.LOW_HP :
			PlanetScr.RotationSpeed = 15;
			PlanetScr.DirChangeFrequency = 40;
			break;
	}
}

