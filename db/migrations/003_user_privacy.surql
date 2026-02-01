-- User privacy settings

-- Add is_public field to user (default true for existing users)
DEFINE FIELD IF NOT EXISTS is_public ON user TYPE bool DEFAULT true;

RETURN "User privacy field added";
