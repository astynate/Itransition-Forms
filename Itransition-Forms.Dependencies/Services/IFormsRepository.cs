using CSharpFunctionalExtensions;
using Itransition_Forms.Core.Form;

namespace Itransition_Forms.Database
{
    public interface IFormsRepository
    {
        Task<Result<FormModel>> CreateForm(string email);
        Task<bool> Delete(Guid id, string? email, bool checkOwner);
        Task<FormModel?> GetFormModelById(Guid id);
        Task<FormModel[]> GetPopularTemplates(int count);
        Task<Result<FormModel[]>> GetUsersTemplates(string email, int skip = 0, int count = 5);
        Task<Result> UpdateForm(FormModel form, FormModel updatedForm);
        Task<Result> UpdateFormTitle(FormModel form, string title);
    }
}