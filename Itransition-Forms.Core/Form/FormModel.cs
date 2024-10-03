using CSharpFunctionalExtensions;

namespace Itransition_Forms.Core.Form
{
    public class FormModel
    {
        public string Title { get; private set; } = string.Empty;
        public string Description { get; private set; } = string.Empty;

        private FormModel() { }

        public static Result<FormModel> Create(string title, string description)
        {
            if (string.IsNullOrEmpty(title) || string.IsNullOrEmpty(title))
            {
                return Result.Failure<FormModel>("Title is required");
            }

            return new FormModel()
            {
                Title = title,
                Description = description
            };
        }
    }
}