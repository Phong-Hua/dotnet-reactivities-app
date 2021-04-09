namespace Domain
{
    public class UserFollowing
    {
        // Observer follow the target
        public string ObserverId { get; set; } // similar to id of follower
        public AppUser Observer { get; set; }
        public string TargetId { get; set; }    // similar to id of followee
        public AppUser Target { get; set; }
    }
}