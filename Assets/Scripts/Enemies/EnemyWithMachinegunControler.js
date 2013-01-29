#pragma strict
public var BulletPrefab : GameObject;
public var ParticleExplo : GameObject;

private var deltaTime : float = 0.0;
function Start () {

}

function Update () {

	deltaTime += Time.deltaTime;
	
	var speed = GetComponent(EnemyProperties).Speed;
	var attackDirection = -transform.position;
	attackDirection.Normalize();
	
	
	if(transform.position.magnitude > 100)
		transform.position += attackDirection*speed;
	else 
		transform.position -= attackDirection*speed;
	
	
	transform.rotation.SetLookRotation(-attackDirection);// *= Quaternion.AngleAxis(Random.value*10.0,Vector3(Random.value,Random.value,Random.value));
	
	if(deltaTime > 2.0)
	{
		deltaTime = 0.0;
		Instantiate(BulletPrefab,transform.position,Quaternion.identity);
	}
}

function ApplyDamage(damage : float)
{
	Debug.Log("" + GetComponent(EnemyProperties).Health);
	GetComponent(EnemyProperties).Health -= damage;
	
	if(GetComponent(EnemyProperties).Health < 0)
	{
		Destroy(gameObject);
		Instantiate(ParticleExplo,transform.position,Quaternion(0,0,0,0)); 
	}
}