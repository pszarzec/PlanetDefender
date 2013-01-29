#pragma strict

public var Speed : float;
public var MaxDamage : float;
public var Health : float = 100;
public var MaxGold : float = 100;
public var MinimumSizeInVariation : float; // jezeli wartosc bedzie rowna 0.7 oznacza to ze 
// obiekt stworzony nie bedzie mniejszy niz 0.7% oryginalnego

function Start () {

	var MaxSizeVariation : float = 1.0 - MinimumSizeInVariation;
	var SmallerPercentage : float = MaxSizeVariation * Random.value;
	
	gameObject.transform.localScale = gameObject.transform.localScale - 
										gameObject.transform.localScale * SmallerPercentage;
										
	// affect on hp and damage too
	MaxDamage = MaxDamage - MaxDamage * SmallerPercentage;
	Health = Health - Health * SmallerPercentage;
	MaxGold = MaxGold - MaxGold * SmallerPercentage;
	
	if(Health == 0)
		Health = 1;
}

function Update () {

}