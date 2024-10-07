using CSharpFunctionalExtensions;
using Itransition_Forms.Core.User;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Form
{
    [Table("recent_templates")]
    public class RecentTemplates
    {
        [Column("id")][Key] public Guid Id { get; private set; } = Guid.NewGuid();
        [Column("email")] public string Email { get; private set; } = string.Empty;
        [Column("form_id")] public Guid FormId { get; private set; }

        private RecentTemplates() { }

        public static Result<RecentTemplates> Create(string email, Guid formId)
        {
            if (UserModel.IsValidEmail(email) == false)
                return Result.Failure<RecentTemplates>("Invalid email");

            if (formId == Guid.Empty)
                return Result.Failure<RecentTemplates>("Form not found");

            return new RecentTemplates() 
            { 
                Email = email,
                FormId = formId
            };
        }
    }
}