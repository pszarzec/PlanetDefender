#pragma strict

public var Speed :float;
public var Min :float;
public var Max :float;

private var global :GLOBAL;

private var health :float;

function Start () 
{
	global = GameObject.Find("GLOBAL").GetComponent(GLOBAL);
	
	if(Speed == 0)
		Debug.LogError("Parametry Speed skryptu jest ustawiony na zero!", this);
		
	health = global.planetHealthPercentage;
}

function Update () 
{
	var actualHealth = global.planetHealthPercentage;

	if(actualHealth >= 0)
	{
		if(health != actualHealth)
		{
			if(health > actualHealth)
			{
				// spadło
				Speed -= (health - actualHealth) * 10;
				//Debug.Log(Speed);
			}
			else if(health < actualHealth)
			{
				// urosło
				Speed -= (health - actualHealth) * 10;
				//Debug.Log(Speed);
			}	
		}
		
		health = actualHealth;
		
		var heart : GUITexture = this.GetComponent(GUITexture);
		
		var timing = Mathf.Clamp(Mathf.Sin(Time.fixedTime * Speed), -0.5, 0.5);
		
		if(timing < 0)
		{		
			// timing = -
		
			if(heart.pixelInset.width > 20 )
			{
				heart.pixelInset.width += timing;
				heart.pixelInset.height += timing;
			}
			else
				timing = -timing;
		}
	 	
	 	if(timing > 0)
		{	
			// timing = +
			
			if(heart.pixelInset.width < 80)
			{
				heart.pixelInset.width += timing;
				heart.pixelInset.height += timing;
			}
			else if(heart.pixelInset.width > 20)
			{
				timing = -timing;
			
				heart.pixelInset.width += timing;
				heart.pixelInset.height += timing;
			}
		}
	}
}