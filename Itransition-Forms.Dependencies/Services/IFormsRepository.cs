using CSharpFunctionalExtensions;
using Itransition_Forms.Core.Form;

namespace Itransition_Forms.Database
{
    public interface IFormsRepository
    {
        Task<Result<FormModel>> CreateForm(string email);
        Task<Result<FormModel?>> GetFormModelById(Guid id);
    }
}