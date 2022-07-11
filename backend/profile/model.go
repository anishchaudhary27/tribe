package profile

type Profile struct {
	UID           string `firestore:"uid"`
	Name          string `firestore:"name"`
	Handle        string `firestore:"handle"`
	AnimateAvatar bool   `firestore:"animateAvatar"`
	About         string `firestore:"about"`
	Twitter       string `firestore:"twitter"`
	Instagram     string `firestore:"instagram"`
	Facebook      string `firestore:"facebook"`
	Youtube       string `firestore:"youtube"`
	Supporters    int    `firestore:"supporters"`
	Supported     int    `firestore:"supported"`
	Posts         int    `firestore:"posts"`
}
