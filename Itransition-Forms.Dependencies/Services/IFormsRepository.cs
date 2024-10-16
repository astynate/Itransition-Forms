using CSharpFunctionalExtensions;
using Itransition_Forms.Core.Form;

namespace Itransition_Forms.Database
{
    public interface IFormsRepository
    {
        Task<Result<FormModel>> CreateForm(Guid userId);
        Task<bool> Delete(Guid id, Guid userId, bool checkOwner);
        Task<FormModel?> GetFormModelById(Guid id);
        Task<FormModel[]> GetPopularTemplates(int count);
        Task<Result<FormModel[]>> GetUsersTemplates(Guid userId, int skip = 0, int count = 5);
        Task<Result> UpdateForm(FormModel form, FormModel updatedForm);
        Task<Result> UpdateFormTitle(FormModel form, string title);
    }
}