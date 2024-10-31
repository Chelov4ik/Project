namespace Proj.Models
{
    using System;
    using System.Collections.Generic;

    // Proj.Models/UpdateUserDTO.cs
    public class UpdateUserDTO
    {
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime HireDate { get; set; }
        public string Status { get; set; }
        public List<int> TaskIds { get; set; }
    }

}

