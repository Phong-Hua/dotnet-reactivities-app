using System;

namespace Domain
{
    public class Activity
    {
        // using Guid for ID because we can either generate it from server-side or client-side
        // If we create Guid on clients-side, we don't need to wait for database to generate it
        // and give back to us
        // Because we call 'Id', Entity Framework is gonna recognise this as primary key for Activity.
        // If we call it something else, then Entity Framework does not know which we want to use as Id 
        public Guid Id { get; set; }

        public string Title { get; set; }

        public DateTime Date { get; set; }

        public String Description { get; set; }

        public string Category { get; set; }

        public string City { get; set; }

        public string Venue { get; set; }
    }
}