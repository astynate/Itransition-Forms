using Itransition_Forms.Core.Form;

namespace Itransition_Forms.Database.Repositories
{
    public interface IStatisticRepository
    {
        Task<QuestionStatistic[]> GetQuestionStatistic(Guid formId);
    }
}