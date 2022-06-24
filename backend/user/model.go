package user

type User struct {
	Name     string `firestore:"name"`
	Handle   string `firestore:"handle"`
	PhotoURL string `firestore:"photoURL"`
	About    string `firestore:"about"`
	Country  string `firestore:"country"`
}
