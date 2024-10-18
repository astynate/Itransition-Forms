using CSharpFunctionalExtensions;
using Itransition_Forms.Core.Links.Entities;
using Itransition_Forms.Core.Transfer;

namespace Itransition_Forms.Database.Repositories
{
    public interface IFillingsRepository
    {
        Task<Result> Create(Guid userId, Guid formId, FilledAnswerBase[] answers);
        Task<FormLinkModel[]> GetByFormId(Guid formId, int from, int count);
    }
}