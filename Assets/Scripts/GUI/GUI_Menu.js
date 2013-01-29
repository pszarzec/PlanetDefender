#pragma strict

var selGridInt : int = 0;
var selStrings : String[] = ["Play", "Leave"];
var maxButton : int = 2;

function OnGUI()
{
	selGridInt = GUI.SelectionGrid(Rect(Screen.width - (Screen.width / 3), 
		Screen.height - ((Screen.height * 70) / 100), 140, 100), selGridInt, selStrings, 1);

//	GUI.DrawTexture(Rect(819, 490, 0, 0), texture, ScaleMode.ScaleToFit, true, 10.0f);
}

function Start () 
{
//	texture = Resources.Load("menu1");
//	var texture2 = Resources.Load("menu2");
//
//	
//	myTextures[0] = texture;
//	
//	myTextures[1] = texture2;
}

function Update () 
{
    if(Input.GetKeyUp(KeyCode.UpArrow) || Input.GetKeyUp(KeyCode.Joystick1Button5))
    {
        if(selGridInt > 0)
        {
            selGridInt--;
        }
        else
        {
            selGridInt = maxButton - 1;
        }
    }
 
    if(Input.GetKeyUp(KeyCode.DownArrow) || Input.GetKeyUp(KeyCode.Joystick1Button4))
    {
        if(selGridInt < (maxButton-1))
        {
            selGridInt++;
        }
        else
        {
            selGridInt = 0;
        }
    }
 
    if(Input.GetKeyUp(KeyCode.Return) || Input.GetKeyUp(KeyCode.Joystick1Button2))
    {
        switch(selGridInt)
        {
            case 0: 
            	Application.LoadLevel("MainScene");
                break;
            case 1: 
            	Application.CancelQuit();
                break;
        }
    }
}

//var framesPerSecond = 10.0;
//var myTextures :Texture2D[] = new Texture2D[2];
//var texture :Texture2D;
// 
//function PlayAnim () 
//{
//    var waitTime = 1.0/framesPerSecond;
//    
//    for (var i = 0; i < myTextures.Length; i++) 
//    {
//        guiTexture.texture = myTextures[i];
//        yield WaitForSeconds(waitTime);
//    }
//    
//    guiTexture.enabled = false;
//}