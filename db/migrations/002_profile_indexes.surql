-- Profile performance indexes

-- Ideas by author (getUserIdeas query)
DEFINE INDEX IF NOT EXISTS author_idx ON idea COLUMNS author;

-- Follows relation indexes (getFollowers, getFollowing, getUserStats queries)
DEFINE INDEX IF NOT EXISTS follows_in_idx ON follows COLUMNS in;
DEFINE INDEX IF NOT EXISTS follows_out_idx ON follows COLUMNS out;

-- Voted relation index (getUserStats votes given count)
DEFINE INDEX IF NOT EXISTS voted_in_idx ON voted COLUMNS in;

RETURN "Profile indexes created";
