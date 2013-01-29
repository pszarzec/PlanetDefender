#pragma strict

function Start () {

}

function Update () {
	var speed = 0.2;
	var MoveDirection = -transform.position;
	MoveDirection.Normalize();
	
	transform.position += MoveDirection*speed;
	
	//if(transform.position.magnitude < 100)
	//	Destroy(gameObject);
	//transform.rotation *= Quaternion.AngleAxis(Random.value*10.0,Vector3(Random.value,Random.value,Random.value));
}