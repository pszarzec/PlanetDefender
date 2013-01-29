#pragma strict
/*
	ApplySelection() - zmienia materiał na obiektach według aktualnego zaznaczenia.
	
	ChangeSelection(playerName :String, positiv :boolean) - przesuwa zaznaczenie dla 
		konkretnego graczna, positiv na true przesuwa w przód.
		
	AddNewTurretAtEnd(objName :String, use :String) - dodaje nowa wize na koniec kolejki.

	AddNewTurret(index :int, objName :String, use :String) - dodaje w dowolne miejsce.
	
	PlayerOneMat :Material - określa materiał zaznaczenia dla gracza 1
	PlayerTwoMat :Material - --==-- dla gracza 2
*/

public var PlayerOneMat :Material;
public var PlayerTwoMat :Material;
public var NoCheckMat :Material;

private var _turretSelections :ArrayList;
private var ConfigScr : CONFIG;

function Start () 
{
	var GlobalScr = GameObject.Find("GLOBAL").GetComponent(GLOBAL);
	_turretSelections = GlobalScr.TurretSelections;
	
	ConfigScr = GameObject.Find("CONFIG").GetComponent(CONFIG);
}

function Update () 
{

}

function AddNewTurretAtEnd(objName :String, use :String)
{
	_turretSelections.Add(new TurretSelect(_turretSelections.Count, objName, use));
}

function AddNewTurret(index :int, objName :String, use :String)
{
	_turretSelections.Insert(index, new TurretSelect(index, objName, use));
}

function RemoveTurret(name :String)
{
	var indexRemoveObj :int = 0;

	for (var turret :TurretSelect in _turretSelections)
	{
		if(turret.objName == name)
			break;
		
		indexRemoveObj++;
	}
	
	// testujemy czy chcemy usunac aktualnie zaznaczony turret - w takim wypadku przelaczamy sie na kolejny
	// gdy nie ma juz kolejnych ustawiana jest flaga game over
	var CurrentSelTurretP1 : TurretSelect;
	var CurrentSelTurretP2 : TurretSelect;
	CurrentSelTurretP1 = GetActualSelectedTurret(ConfigScr.PlayerOne);
	CurrentSelTurretP2 = GetActualSelectedTurret(ConfigScr.PlayerTwo);
	
	if(CurrentSelTurretP1 == (_turretSelections[indexRemoveObj] as TurretSelect) )
	{
		// chcemy usunac turreta ktorym gra aktualnie gracz 1
		ChangeSelection(ConfigScr.PlayerOne,true);
	}else if(CurrentSelTurretP2 == (_turretSelections[indexRemoveObj] as TurretSelect) )
	{
		// chcemy usunac turreta ktorym gra aktualnie gracz 2
		ChangeSelection(ConfigScr.PlayerTwo,true);
	}
	
	// teraz mozemy spokojnie usunac turreta :)
	
	var RetractIndex = (_turretSelections[indexRemoveObj] as TurretSelect).index;
	var TempIndex : int;
	
	_turretSelections.RemoveAt(indexRemoveObj);
	
	for(var i : int = indexRemoveObj; i < _turretSelections.Count ; i++)
	{
		TempIndex = (_turretSelections[i] as TurretSelect).index;
		(_turretSelections[i] as TurretSelect).index = RetractIndex;
		RetractIndex = TempIndex;
	}
}

function GetActualSelectedTurret(playerName :String) :TurretSelect
{
	for (var turret :TurretSelect in _turretSelections)
	{
		if(turret.use != null && turret.use == playerName)
			return turret;
	}
	
	return null;
}

function ApplySelection()
{		
	var GlobalScr = GameObject.Find("GLOBAL").GetComponent(GLOBAL);
	_turretSelections = GlobalScr.TurretSelections;
	
	for (var turret :TurretSelect in _turretSelections)
	{
		if(turret.use != null)
		{
			if(turret.use.Contains("player1"))
			{
				var playerOneSelection = GameObject.Find(turret.objName);

				playerOneSelection.renderer.material = PlayerOneMat;
			}
			
			if(turret.use.Contains('player2'))
			{
				var playerTwoSelection = GameObject.Find(turret.objName);

				playerTwoSelection.renderer.material = PlayerTwoMat;
			}
		}
		else
		{
			var otherObj = GameObject.Find(turret.objName);
								
			otherObj.renderer.material = otherObj.GetComponent(TurretDragandDrop).TexMaterial;
		}
	}
}

function ChangeSelection(playerName :String, positiv :boolean)
{
	for (var turret :TurretSelect in _turretSelections)
	{
		if(turret.use != null)
			if(turret.use == playerName)	
			{
				if(positiv == true)
				{
					ChangePosition(turret.index, turret.index + 1, playerName, true);
					ApplySelection();
					break;
				}
				else
				{
					ChangePosition(turret.index, turret.index - 1, playerName, false);
					ApplySelection();
					break;
				}
			}
	}
} 

private function ChangePosition(actualIndex :int, nextIndex :int, playerName :String, positiv :boolean)
{
		if(nextIndex < 0)
			nextIndex = _turretSelections.Count - 1;
		if(nextIndex > _turretSelections.Count)
			nextIndex = 0;
			
		if(nextIndex >= _turretSelections.Count)
			nextIndex = 0;
	
	if(_turretSelections[nextIndex] != null)
	{	
		var next :TurretSelect = _turretSelections[nextIndex] as TurretSelect;
		var actual :TurretSelect = _turretSelections[actualIndex] as TurretSelect;
		
		if(next.use == null)
		{
			actual = _turretSelections[actualIndex] as TurretSelect;	
			
			//Release old selection.
			actual.use = null;
			//Apply new selection on next turret.
			next.use = playerName;
		}
		else
		{
			if(positiv == true)
			{
				nextIndex += 1;
				
				if(nextIndex < 0)
					nextIndex = _turretSelections.Count - 1;
				if(nextIndex > _turretSelections.Count)
					nextIndex = 0;
					
				if(nextIndex >= _turretSelections.Count)
					nextIndex = 0;
				
				next = _turretSelections[nextIndex] as TurretSelect;			
				actual = _turretSelections[actualIndex] as TurretSelect;
				
							//Release old selection.
				actual.use = null;
				//Apply new selection on next turret.
				next.use = playerName;
			}
			else
			{
				nextIndex -= 1;
				
				if(nextIndex < 0)
					nextIndex = _turretSelections.Count - 1;
				if(nextIndex > _turretSelections.Count)
					nextIndex = 0;
					
				if(nextIndex >= _turretSelections.Count)
					nextIndex = 0;
				
				next = _turretSelections[nextIndex] as TurretSelect;			
				actual = _turretSelections[actualIndex] as TurretSelect;
				
							//Release old selection.
				actual.use = null;
				//Apply new selection on next turret.
				next.use = playerName;
			}
		}
	}
}

function ApplyRange(nextIndex :int) :int
{
	if(nextIndex < 0)
		return _turretSelections.Count - 1;
	if(nextIndex >= _turretSelections.Count)
		return 0;
		
	return 0;
}