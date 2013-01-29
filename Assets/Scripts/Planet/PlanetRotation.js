#pragma strict

// setted by PlanetMoveControler based on planet state and others
@HideInInspector
public var RotationSpeed : float = 100.0;

@HideInInspector
public var DirChangeFrequency : float = 1.0; // 1 - 100

@HideInInspector
public var PlanetRotationLoced : boolean = false;

// used to calculate planet behavior
// direrction data
private var RotationDirection : float = 1.0; // -1 left, 0 stop , 1 right
private var ElapsedTimeClampedToChangeRange : float = 0.0;
private var DirChangeCountInChangeRange : float;
private var ElapsedTimeInSec : float = 0.0;
private var ChangeRange : float = 10.0;
function Start () {
	
}

function Update () {

	if(PlanetRotationLoced == true)
		return;
		
	CalculateDirection();
	
	
	transform.rotation *= Quaternion.AngleAxis(RotationSpeed * Time.deltaTime * RotationDirection,Vector3(0.0,0.0,1.0));
}

function CalculateDirection()
{
	if(ElapsedTimeClampedToChangeRange < 1.0)
	{
		DirChangeCountInChangeRange =  Mathf.Clamp(Random.value,0.5,1.0) * DirChangeFrequency;
		
	}
	
	
	ElapsedTimeClampedToChangeRange += Time.deltaTime;
	ElapsedTimeInSec += Time.deltaTime;
	
	
	if(ElapsedTimeClampedToChangeRange >= ChangeRange)
		ElapsedTimeClampedToChangeRange = 0.0;
		
	if(ElapsedTimeInSec > 0.3)
	{
		ElapsedTimeInSec = 0.0;
		
		if(Random.value < DirChangeCountInChangeRange/100.0 )
		{
			RotationDirection = -RotationDirection;
		}
	}
	
	RotationDirection = Mathf.Clamp(RotationDirection,-1.0,1.0);
}