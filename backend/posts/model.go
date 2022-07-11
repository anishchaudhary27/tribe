package posts

type Post struct {
	ID                   string   `firestore:"id"`
	Content              string   `firstore:"content"`
	Images               []string `firestore:"noImages"`
	CreatorUid           string   `firestore:"creatorUid"`
	CreatorHandle        string   `firestore:"creatorHandle"`
	CreatorName          string   `firestore:"creatorName"`
	CreatorAnimateAvatar bool     `firestore:"creatorAnimateAvatar"`
	Public               bool     `firestore:"public"`
	Unlike               int      `firestore:"unlike"`
	Likes                int      `firestore:"likes"`
	Views                int      `firestore:"views"`
}

type Comment struct {
	ID                     string `firestore:"id"`
	PostId                 string `firestore:"postId"`
	Content                string `firstore:"content"`
	CommentorHandle        string `firestore:"commentorHandle"`
	CommentorName          string `firestore:"commentorName"`
	CommentorAnimateAvatar bool   `firestore:"commentorAnimateAvatar"`
	Visible                bool   `firestore:"visible"`
	Unlike                 int    `firestore:"unlike"`
	Likes                  int    `firestore:"likes"`
}
