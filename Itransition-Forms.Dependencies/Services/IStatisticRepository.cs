using Itransition_Forms.Core.Form;

namespace Itransition_Forms.Database.Repositories
{
    public interface IStatisticRepository
    {
        Task<object[]> GetQuestionStatistic(Guid formId);
    }
}