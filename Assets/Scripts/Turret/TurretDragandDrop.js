#pragma strict
public var ParticleExplo : GameObject;
public var ParticleFire : GameObject;

public var Cannon : GameObject;
public var BulletPrefab : GameObject;
public var planet : GameObject;
public var TurretSpeed : float = 1.0f;
public var ThetaPI : float;

private var clampVal : float;
private var maxAngle : float;
private var versor : float;
private var timer: float;

public var TurretHealth : float = 100.0;

@HideInInspector
public var EnableAutoShooting : boolean = false;
private var AutoShootMaxTime : float = 10.0;
private var AutoShootElapsedTime : float = 0.0;

public var ShootFrequency : float = 0.1; // 0.0 oznacza ze mozna strzelac tak szybko jak sie da
private var ElapsedTimeFromLastShoot : float = 0.0;

public var DoubleShoot : boolean = false;
public var sound : AudioClip;
public var TexMaterial : Material;

function Start () {
	ThetaPI = 0;
	clampVal = 0;
	maxAngle = 0;
	versor = 0;
	timer = 0;
	Cannon.transform.RotateAroundLocal(Vector3.right,Mathf.PI/2);
	
	this.renderer.material = TexMaterial;
}

function DecreaseHP( HPDown : float)
{
	TurretHealth -= HPDown;
	
	if(TurretHealth <= 0)
	{
		GameObject.Find("TurretSelector").GetComponent(TurretSelector).RemoveTurret(name);
		
		Camera.mainCamera.SendMessage("Shake");
	   	Instantiate(ParticleExplo,transform.position,Quaternion(0,0,0,0));  
	   
		Destroy(gameObject);
		
	}
}

function Update() {
	
	ElapsedTimeFromLastShoot += Time.deltaTime;
		
	var lookAt : Quaternion = Quaternion.LookRotation(planet.transform.position - transform.position,Vector3.forward);
 
    transform.rotation = Quaternion.RotateTowards(transform.rotation, lookAt, 360);
 					
	clampVal = Time.deltaTime * 120.0 * versor;//Input.GetAxis("Horizontal");
	maxAngle += clampVal;

	versor -= Mathf.Sign(versor) * Time.deltaTime * TurretSpeed;
	
	if( Mathf.Abs(versor) < 0.1){
		timer -= Time.deltaTime;
		
		if(timer <= 0){
					
			if(maxAngle > 0){
				clampVal = -Time.deltaTime * 80.0;
				maxAngle += clampVal;
				
				if(maxAngle <= 0){
					maxAngle = 0;
					clampVal = 0;
				}
			}
			else if(maxAngle < 0){
				clampVal = Time.deltaTime * 80.0;
				maxAngle += clampVal;	
				
				if(maxAngle >= 0){
					maxAngle = 0;
					clampVal = 0;
				}		
			}

		}		
	}
	else timer = 0.4;
	
	if(maxAngle > 80){
		maxAngle = 80;
		clampVal = 0;
	}
	
	if(maxAngle < -80){
		maxAngle = -80;
		clampVal = 0;
	}
		
	Cannon.transform.RotateAround(transform.position, Vector3.forward, clampVal);

	if(EnableAutoShooting)
	{
		AutoShootElapsedTime += Time.deltaTime;
		
		if(ElapsedTimeFromLastShoot > 0.25)
			Shoot();
		
		if(AutoShootElapsedTime > AutoShootMaxTime)
		{
			EnableAutoShooting = false;
			AutoShootElapsedTime = 0.0;
		}
	}
} 
 
function Shoot() {
	if(ElapsedTimeFromLastShoot > ShootFrequency)
	{
		AudioSource.PlayClipAtPoint(sound, transform.position);
		
		if(DoubleShoot)
		{
			var Bullet1 : GameObject = Instantiate(BulletPrefab,Cannon.transform.position+Cannon.transform.up*-5.0 + Cannon.transform.right*3.0,Quaternion(0,0,0,0));
			Bullet1.transform.forward = -Cannon.transform.up + Cannon.transform.right*0.1;
			
			var Bullet2 : GameObject = Instantiate(BulletPrefab,Cannon.transform.position+Cannon.transform.up*-5.0 -  Cannon.transform.right*3.0,Quaternion(0,0,0,0));
			Bullet2.transform.forward = -Cannon.transform.up - Cannon.transform.right*0.1;
		}else
		{
			var Bullet : GameObject = Instantiate(BulletPrefab,Cannon.transform.position+Cannon.transform.up*-5.0,Quaternion(0,0,0,0));
			Bullet.transform.forward = -Cannon.transform.up;
		}
		ElapsedTimeFromLastShoot = 0.0;
	}

}

function MoveTurret(axis : float){
	versor = axis;
}